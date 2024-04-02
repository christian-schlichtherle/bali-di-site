# On Structuring Modules

In a larger app, it's critical how you partition your code into smaller units.
Java and Scala already give you types (i.e. classes, interfaces etc), packages and compilation units to structure your code.
For the benefit of brevity and focus, we assume that you are already familiar with these concepts, so we won't discuss
them here.

Following are some guidelines for structuring modules, i.e. types annotated with the `@Module` annotation.
The example code is in Java, but the underlying concepts equally apply to Scala code.

## Use inheritance for convenience

[...]

For example:

```java
// This is not a module, so no code is generated for it.
interface Clock {
    
    Date now();
}

// This is a module, so the annotation processor will generate a so-called companion interface named `App$` and a
// companion class named `App$$`.
// The companion interface will contain default methods for all abstract, non-void methods which are not annotated with `@Lookup`.
@Module
interface App extends Clock {

    // [...]
}
```

Also:

```java
@Module
interface Clock {
    
    Date now();
}

// Inheriting from the companion interface `Clock$`, which has been generated by the annotation processor, allows the
// annotation processor to reuse the code previously generated in `Clock$` when generating the code for the companion
// interface `App$`.
@Module
interface App extends Clock$ {
    
    // [...]
}
```

Also:

```java
@Module
interface Clock {

    // This is a dependency, so the annotation processor will NOT generate code for it.
    @Lookup
    Date now();
}

// Inherit from the companion interface `Clock$`, which has been generated by the annotation processor.
@Module
interface App extends Clock$ {

    @Override
    Date now();

    // [...]
}
```

## Use composition for encapsulation

[...]

For example:

```java
@Module
interface Clock {
    
    Date now();
}

@Module
interface App {
    
    Clock clock();

    // [...]
}
```

Also:

```java
@Module
interface Clock {

    // This is a dependency, so the annotation processor will NOT generate code for it.
    @Lookup
    Date now();
}

@Module
interface App {

    Date now();

    Clock clock();

    // [...]
}
```