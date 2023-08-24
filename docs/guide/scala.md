---
title: Scala Guide
---

<div>
    <a href="https://github.com/christian-schlichtherle/bali-di-scala/releases/latest"><img src="https://img.shields.io/github/release/christian-schlichtherle/bali-di-scala.svg" alt="Release Notes"></a>
    <a href="https://search.maven.org/artifact/global.namespace.bali/bali-scala_2.13"><img src="https://img.shields.io/maven-central/v/global.namespace.bali/bali-scala_2.13" alt="Maven Central"></a>
    <a href="https://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/github/license/christian-schlichtherle/bali-di-scala.svg" alt="Apache License 2.0"></a>
    <a href="https://github.com/christian-schlichtherle/bali-di-scala/actions?query=workflow%3Atest"><img src="https://github.com/christian-schlichtherle/bali-di-scala/workflows/test/badge.svg" alt="Test Workflow"></a>
</div>

# Scala Guide

Bali DI for Scala is a pure def macro which transforms the abstract syntax tree to automate dependency injection.
It currently supports Scala 2.12 and 2.13, with Scala 3 on the roadmap.

This project is a sibling of [Bali DI for Java](java.md).
As a sibling, it is based on the exact same concepts and aims for feature parity.

> Bali is also an [island](https://en.wikipedia.org/wiki/Bali) between Java and Lombok in Indonesia.
> For disambiguation, the name of this project is "Bali DI", not just "Bali", where DI is an acronym for
> [_dependency injection_](https://en.wikipedia.org/wiki/Dependency_injection).
> In code however, the term "DI" is dropped because there is no ambiguity in this context.

## Getting Started

Bali DI for Scala is implemented as a def macro for the Scala compiler.
If you use SBT, you need to add the following dependency to your project:

```sbt
libraryDependencies += "global.namespace.bali" %% "bali-scala" % "0.5.3" % Provided
```

Note that this is a compile-time-only dependency - there is no runtime dependency of your code on Bali DI for Scala!

## Sample Code

This project uses a modular build.
The module [`bali-scala-sample`](https://github.com/christian-schlichtherle/bali-di-scala/tree/main/scala-sample)
provides lots of sample code showing how to use the annotations and generated source code.
The module is not published on Maven Central however - it is only available as source code.
You can browse the source code
[here](https://github.com/christian-schlichtherle/bali-di-scala/tree/main/scala-sample/src/main/scala/bali/scala/sample)
or clone this project.

The module is split into different packages with each package representing an individual, self-contained showcase.
For example, the package
[`bali.scala.sample.greeting`](https://github.com/christian-schlichtherle/bali-di-scala/tree/main/scala-sample/src/main/scala/bali/scala/sample/greeting)
showcases a glorified way to produce a simple "Hello world!" message by using different components with dependency
injection.

## Tutorial

### WeatherStation

> The source code shown in this section is available
> [here](https://github.com/christian-schlichtherle/bali-di-scala/tree/main/scala-sample/src/main/scala/bali/scala/sample/weatherstation).

Let's define our first component:

```scala
trait Clock {

  def now: java.util.Date
}
```

In a component type, every abstract member is a dependency, so the `Clock` trait has a single dependency named `now`
with type `Date`.
We want our clock to return a fresh `Date` on every call, so `now` is declared as a `def`.
This component doesn't have any domain logic, so there are no other members.

Next, let's look at a more advanced component and its companion object:

```scala
import bali.Lookup

trait Temperature[U <: Temperature.Unit] {

  @Lookup("tempValue")
  val value: Float // (1)

  @Lookup("tempUnit")
  val unit: U // (2)

  override def toString: String = f"$value%.1f˚ $unit"
}

object Temperature {

  sealed trait Unit

  type Celsius = Celsius.type
  object Celsius extends Unit { override def toString: String = "C" }

  type Fahrenheit = Fahrenheit.type
  object Fahrenheit extends Unit { override def toString: String = "F" }
}
```

The component trait `Temperature` has two abstract members and thus, two dependencies:

1. `value`, with type `Float`.
1. `unit`, with type `U <: Temperature.Unit`.

We want our temperature instances to be immutable, so both members are declared as a `val`.

The `@Lookup` annotation on each dependency defines an alias name for it.
This is used to bind each dependency to some element in some module context - more on that later.

Next, let's look at our last component:

```scala
trait WeatherStation[U <: Temperature.Unit] extends Clock {

  def temp: Temperature[U]

  override def toString: String = s"$now: $temp"
}
```

This component also has two dependencies:

1. `now`, with type `Date`, inherited from trait `Clock`.
1. `temp`, with type `Temperature[U]`.

We want our weather station to return a fresh `Temperature` on each call, so `temp` is declared as a `def` again.

> Note that the component trait `WeatherStation` reuses the component trait `Clock` by inheritance and the component
> trait `Temperature` by composition:
> There is no limitation on how you arrange component types into a larger dependency graph.
> Because dependencies are resolved just-in-time, your dependency graph may even be circular!

Eventually, all the abstract methods in the components you've seen so far get implemented in a very simple manner by
forwarding the call as-is to some module context.
So for example, the abstract method `now` in the component trait `Clock` gets implemented as follows:

```scala
final override def now: Date = context.now
```

Likewise, if a dependency is declared as a `val`, then it gets implemented as a `lazy val`.
So for example, the abstract method `value` in the component trait `Temperature` gets implemented as follows:

```scala
final override lazy val value: Float = context.tempValue
```

Note that the implementation respects the alias defined by the `@Lookup("tempValue")` annotation before.

> Also, note that a dependency may have type parameters and parameter lists:
> The parameter lists are also forwarded in this case - more on that later.

In Scala, a module context is either:

1. Any place in your code where you call the `def` macro `bali.scala.make`, or
1. any type annotated with `@bali.Module`.

The `make` macro implements a module in place by creating an instance of an anonymous inner class which extends it type
parameter and then implementing all abstract methods as shown before.

Let's look at an example:

```scala
import bali.scala.make

object MyApp extends App { context =>

  def now = new Date

  val clock = make[Clock] // (1)
}
```

The line with the call to `make[Clock]` gets expanded as follows:

```scala
val clock = new Clock {
  
  final override def now: Date = context.now
}
```

> Note that if the type to make isn't abstract, then no anonymous inner class is created, and the default constructor is
> called instead.
> So for example, a call to `make[Date]` simply gets expanded to `new Date`.

With this in mind, let's look at the module type for our weather station: 

```scala
import bali.Module
import java.util.concurrent.ThreadLocalRandom

@Module
trait WeatherStationModule {

  val april: WeatherStation[Temperature.Celsius] // (1)

  protected def now: Date // (2)

  protected def temp: Temperature[Temperature.Celsius] // (3)

  protected def tempValue: Float = ThreadLocalRandom.current.nextDouble(5d, 25d).toFloat

  protected final val tempUnit = Temperature.Celsius
}
```

Like a component type, a module type can also have abstract members (numbered 1 to 3 in this case).
The difference is that in a module type, its abstract methods get implemented as a recursive call to the `make`
macro.
So for example, the abstract method `now` (no. 2 in the previous example) gets implemented as follows:

```scala
final override protected def now: Date = make[Date] // (2)
```

The call to `make[Date]` is then recursively expanded to `new Date`.

> Why is this a recursive call?
> Because you need to call `make[WeatherStationModule]` in order to let it implement the method `now` in the first
> place!

Finally, let's look at some test code for our module:

```scala
import bali.scala.make
import bali.scala.sample.weatherstation.Temperature.Celsius
import org.scalatest.matchers.should.Matchers._
import org.scalatest.wordspec.AnyWordSpec

import java.util.Date

class WeatherStationModuleSpec extends AnyWordSpec {

  "A WeatherStationModule" should {
    val module = make[WeatherStationModule] // (1)
    import module._

    "report typical April weather" in {
      april.now should not be theSameInstanceAs(april.now)
      new Date should be <= april.now
      val temp = april.temp
      temp should not be theSameInstanceAs(april.temp)
      temp.value shouldBe temp.value
      temp.value should be >= 5f
      temp.value should be < 25f
      temp.unit shouldBe temp.unit
      temp.unit shouldBe Celsius
    }
  }
}
```

Putting all the puzzle pieces together, we can conclude that the line with the call to `make[WeatherStationModule]` gets
expanded by the macro as follows:

```scala
val module = new WeatherStationModule {

  final override lazy val april: WeatherStation[Celsius] = make[WeatherStation[Celsius]]

  final override protected def now: Date = make[Date]

  final override protected def temp: Temperature[Celsius] = make[Temperature[Celsius]]
}
```

Next, another round is started to recursively expand the generated `make[...]` calls and form the final result:

```scala
val module = new WeatherStationModule { context =>

  final override lazy val april: WeatherStation[Celsius] = new WeatherStation[Celsius] {

    final override def temp: Temperature[Celsius] = context.temp

    final override def now: Date = context.now
  }

  final override protected def now: Date = new Date

  final override protected def temp: Temperature[Celsius] = new Temperature[Celsius] {

    final override lazy val value: Float = context.tempValue

    final override lazy val unit: Celsius = context.tempUnit
  }
}
```

As you can see, Bali DI automates the generation of a lot of boilerplate code for you, but there's much more to it
than just that.
For a general discussion of its design concept, features and benefits please check the [Overview](overview.md) page.
