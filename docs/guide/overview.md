# Overview

## Motivation

Does the world really need yet another tool for an idiom as simple as dependency injection?
Well, I've been frustrated with existing popular solutions like Spring, Guice, PicoContainer, Weld/CDI, MacWire etc in
various projects for years, so I think the answer is "yes, please"!

Most of these tools bind dependencies at runtime, which is the first mistake already:
By deferring the dependency binding to runtime, the compiler will not be able to tell you about missing dependencies or
type mismatches and so the error detection is also deferred until runtime.

To mitigate the risk of deploying an erroneous dependency wiring plan into production, these tools typically instantiate
the entire dependency graph at application startup, which in turn contributes to the slow application startup for which
Java is so infamous.
For example, Spring is well-known for slowing down application start-up because it typically scans the entire byte code
for its annotations and then building the entire dependency graph based on its findings.
Of course, you can avoid the annotation scanning by going down XML configuration hell - oh my!

Then again, if something is not working because you forgot to sprinkle your code with a qualifier annotation in order to
discriminate two dependencies of the same type but with different semantics (say, a `String` representing a username and
a password - yeah, don't do that), then you may spend a lot of time debugging and analyzing this problem.

By the way, good luck with debugging [IOC](https://en.wikipedia.org/wiki/Inversion_of_control) containers:
If your code is not called because you forgot to add an annotation somewhere then debugging it is pointless because...
as I said, it's not called.

For worse, dependency injection at runtime is not even type-safe when it comes to generic classes due to type erasure.
For example, your component may get a `List<String>` injected when it actually wants a `List<User>`.

Last but not least, all of these tools (even Macwire, which is for Scala) support dependency injection into
constructors, methods and fields. For Java, this means you either have to write a lot of boiler plate code, for example
the constructor plus the fields if you want to use constructor injection (which is the least bad of the three options),
or your code gets hardwired to your DI tool by sprinkling it with even more annotations, for example Spring's
`@Autowired` on fields (again - don't do that).

## Design Concept

To resolve the aforementioned issues, Bali DI employs a new, completely different approach:

1. A dependency is _declared_ as an abstract method in a component type.
   This method may have any type parameters and parameter list(s), but it must not have a void return type. 

1. A dependency needs to be _defined_ as an element in some module context.
   This element must be assignment-compatible to the abstract method in the component type.

1. The compiler _binds_ the dependency by implementing the abstract method in the component type so that it forwards the
   call to the element in the module context and (if desired) caches the result.

1. If the module context is a type, and the element is an abstract member of this type, then the compiler implements 
   this member so that it creates and (if desired) caches the dependency unless annotated otherwise.

1. To configure this algorithm the compiler respects some annotations, e.g. to
   1. declare a module type, or
   1. configure the name of an element, or
   1. suppress the implementation of an abstract member of a module type, or
   1. select the caching strategy for the result of a method call (optional), or
   1. create an instance of a subtype in the implementation of an abstract member of a module type (optional). 

## Features and Benefits

**Dependency bindings are type-checked**

:   The compiler type-checks all dependency bindings.
    This means that if a dependency is missing, then the compiler emits an error message, so that your app never crashes
    from an unsatisfied dependency at runtime. 
    Likewise, if a dependency isn't assignment-compatible to the expected type, then an error message gets emitted too,
    so that a `Map<User, List<Order>>` never gets assigned to a `Map<String, String>` at runtime.

    &nbsp;

**Dependencies are identified by name**

:   Dependencies are declared by abstract methods, so they don't just have a (return) type, but also a name.
    This means that a dependency like `String username()` is never mistaken for `String password()` or vice versa.
    There is no need for any (qualifier) annotation to discern them.

    &nbsp;

**Dependencies are resolved just-in-time**

:   When an abstract method in a component gets called for the first time, it's dependency gets created just-in-time and
    (if desired) cached for subsequent calls. 
    This results in a more responsive behavior of your app than if the entire dependency graph would be created upfront
    at application startup.
    It also avoids polluting the heap with dependencies which are never used at runtime, eventually reducing heap 
    pressure and thus, unnecessary CPU cycles spent on garbage collection.

    &nbsp;

**No runtime libraries or annotation processing**

:   Bali DI generates all the necessary code at compile time, with zero library usage or annotation processing at
    runtime.
    This means that you don't need to worry about updating conflicting dependencies because there are none.
    Also, using Bali DI does not break any byte code analysis or transformation tools like SonarQube or ProGuard. 

    &nbsp;

**Simple and scalable**

:   Dependencies are defined in module contexts, which can be module types.
    Module types can get composed into larger systems by inheritance or composition.
    This concept scales very well from a simple Hello-world app up to very large monolithic applications.

    &nbsp;

**Supports Java and Scala**

:   Bali DI is implemented as an annotation processor in Java and as a def macro in Scala.
    You can even use it in mixed Java/Scala projects.

    &nbsp;

**Mix-and-match with JSR 330**

:   Bali DI is based on a concept which is completely complementary to any implementation of
    [JSR 330](https://jcp.org/en/jsr/detail?id=330).
    This means that you can mix and match Bali DI with any JSR 330 implementation like Spring, Guice, Macwire, CDI etc.
    It also means that you can use Bali DI in a library without the need to worry about breaking apps which use any of
    these tools.

    &nbsp;

**No IDE plugin required**

:   In Java, the annotation processor emits formatted Java source code.
    This means that you can inspect, test and debug the generated source code along with the rest of your source code.
    There is no need for any IDE plugin to make it "understand" Bali DI.

    &nbsp;
