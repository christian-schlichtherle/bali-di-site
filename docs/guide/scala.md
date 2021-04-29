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
It currently supports Scala 2.13, with Scala 3 on the roadmap.

This project is a sibling of [Bali DI for Java](java.md).
As a sibling, it is based on the exact same concepts and aims for eventual feature parity.

> Bali is also an [island](https://en.wikipedia.org/wiki/Bali) between Java and Lombok in Indonesia.
> For disambiguation, the name of this project is "Bali DI", not just "Bali", where DI is an acronym for
> [_dependency injection_](https://en.wikipedia.org/wiki/Dependency_injection).
> In code however, the term "DI" is dropped because there is no ambiguity in this context.

## Getting Started

Bali DI for Scala is implemented as a def macro for the Scala compiler.
If you use SBT, you need to add the following dependency to your project:

``` sbt
libraryDependencies += "global.namespace.bali" %% "bali-scala" % "0.4.5" % Provided
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

The module is organized into different packages with each package representing an individual, self-contained showcase.
For example, the package
[`bali.scala.sample.greeting`](https://github.com/christian-schlichtherle/bali-di-scala/tree/main/scala-sample/src/main/scala/bali/scala/sample/greeting)
showcases a glorified way to produce a simple "Hello world!" message by using different components with dependency
injection.
