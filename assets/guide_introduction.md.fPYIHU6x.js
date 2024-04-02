import{_ as e,c as t,o as n,a3 as o}from"./chunks/framework.Dcugq_a2.js";const g=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"guide/introduction.md","filePath":"guide/introduction.md","lastUpdated":1712055057000}'),a={name:"guide/introduction.md"},i=o('<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><h2 id="motivation" tabindex="-1">Motivation <a class="header-anchor" href="#motivation" aria-label="Permalink to &quot;Motivation&quot;">​</a></h2><p>Does the world really need yet another tool for an idiom as simple as dependency injection? Well, I&#39;ve been frustrated with existing popular solutions like Spring, Guice, PicoContainer, Weld/CDI, MacWire etc in various projects for years, so I think the answer is &quot;yes, please&quot;!</p><p>Most of these tools bind dependencies at runtime, which is the first mistake already: By deferring the dependency binding to runtime, the compiler will not be able to tell you about missing dependencies or type mismatches and so the error detection is also deferred until runtime.</p><p>To mitigate the risk of deploying an erroneous dependency wiring plan into production, these tools typically instantiate the entire dependency graph at application startup, which in turn contributes to the slow application startup for which Java is so infamous. For example, Spring is well-known for slowing down application start-up because it typically scans the entire byte code for its annotations and then it builds the entire dependency graph based on its findings. Of course, you can avoid the annotation scanning by going down XML configuration hell - oh my!</p><p>Then again, if something is not working because you forgot to sprinkle your code with a qualifier annotation in order to discriminate two dependencies of the same type but with different semantics (say, two strings representing a database hostname and schema), then you may spend a lot of time debugging and analyzing this problem.</p><p>By the way, good luck with debugging <a href="https://en.wikipedia.org/wiki/Inversion_of_control" target="_blank" rel="noreferrer">IOC</a> containers: If you forget to add an annotation somewhere then your code may not even get called and so setting a breakpoint for debugging becomes pointless.</p><p>For worse, dependency injection at runtime is not even type-safe when it comes to generic classes due to type erasure. For example, your component may get a <code>List&lt;String&gt;</code> injected when it actually wants a <code>List&lt;User&gt;</code>.</p><p>Last but not least, all of these tools (even Macwire, which is for Scala) support dependency injection into constructors, methods and fields. For Java, this means you either have to write a lot of boiler plate code, for example the constructor plus the fields if you want to use constructor injection (which is the least bad of the three options), or your code gets hardwired to your DI tool by sprinkling it with even more annotations, for example Spring&#39;s <code>@Autowired</code> on fields (please don&#39;t do that).</p><h2 id="design-concept" tabindex="-1">Design Concept <a class="header-anchor" href="#design-concept" aria-label="Permalink to &quot;Design Concept&quot;">​</a></h2><p>To resolve the aforementioned issues, Bali DI employs a new, completely different approach:</p><ol><li><p>A dependency is declared as an abstract method in a component type. The method may have any type parameters and parameter list(s), but it must not have a void return type.</p></li><li><p>The dependency needs to be defined (or declared) as a (possibly abstract) element in some module context. This element must be assignment-compatible to the abstract method in the component type.</p></li><li><p>The compiler <em>binds</em> the dependency by implementing the abstract method in the component type so that it forwards the call to the element in the module context and (if desired) caches the result.</p></li><li><p>If the module context is a type, and the element is an abstract member of this type, then the compiler implements this member so that it creates and (if desired) caches the dependency unless annotated otherwise.</p></li><li><p>To configure this algorithm the compiler respects some annotations, e.g. to</p><ol><li>declare a module type, or</li><li>configure the name of an element, or</li><li>suppress the implementation of an abstract member of a module type, or</li><li>select the caching strategy for the result of a method call (optional), or</li><li>create an instance of a subtype in the implementation of an abstract member of a module type (optional).</li></ol></li></ol><h2 id="features-and-benefits" tabindex="-1">Features and Benefits <a class="header-anchor" href="#features-and-benefits" aria-label="Permalink to &quot;Features and Benefits&quot;">​</a></h2><ul><li><p><strong>Dependency bindings are type-checked</strong></p><p>The compiler type-checks all dependency bindings. This means that if a dependency is missing, then the compiler emits an error message, so that your app never crashes from an unsatisfied dependency at runtime. Likewise, if a dependency isn&#39;t assignment-compatible to the expected type, then an error message gets emitted too, so that a <code>Map&lt;User, List&lt;Order&gt;&gt;</code> never gets assigned to a <code>Map&lt;String, String&gt;</code> at runtime.</p></li><li><p><strong>Dependencies are resolved just-in-time</strong></p><p>When an abstract method in a component gets called for the first time, it&#39;s dependency gets created just-in-time and (if desired) cached for subsequent calls. This results in a more responsive behavior of your app than if the entire dependency graph would be created upfront at application startup. It also avoids polluting the heap with dependencies which are never used at runtime, eventually reducing heap pressure and thus, unnecessary CPU cycles spent on garbage collection.</p></li><li><p><strong>Dependencies are identified by name</strong></p><p>Dependencies are declared by abstract methods, so they don&#39;t just have a (return) type, but also a name. This means that a dependency like <code>String username()</code> is never mistaken for <code>String password()</code> or vice versa. There is no need for any (qualifier) annotation to discern them.</p></li><li><p><strong>No runtime libraries or annotation processing</strong></p><p>Bali DI generates all the necessary code at compile time, with zero library usage or annotation processing at runtime. This means that you don&#39;t need to worry about updating conflicting dependencies because there are none. Also, using Bali DI does not break any byte code analysis or transformation tools like SonarQube or ProGuard.</p></li><li><p><strong>Simple and scalable</strong></p><p>Dependencies are defined in module contexts, which can be module types. Module types can get composed into larger systems by inheritance or composition. This concept scales very well from a simple Hello-world app up to very large monolithic applications.</p></li><li><p><strong>Supports Java and Scala</strong></p><p>Bali DI is implemented as an annotation processor in Java and as a def macro in Scala. You can even use it in mixed Java/Scala projects.</p></li><li><p><strong>Mix-and-match with JSR 330</strong></p><p>Bali DI is based on a concept which is completely complementary to any implementation of <a href="https://jcp.org/en/jsr/detail?id=330" target="_blank" rel="noreferrer">JSR 330</a>. This means that you can mix and match Bali DI with any JSR 330 implementation like Spring, Guice, Macwire, CDI etc. It also means that you can use Bali DI in a library without the need to worry about breaking apps which use any of these tools.</p></li><li><p><strong>No IDE plugin required</strong></p><p>In Java, the annotation processor emits formatted Java source code. This means that you can inspect, test and debug the generated source code along with the rest of your source code. There is no need for any IDE plugin to make it &quot;understand&quot; Bali DI.</p></li><li><p><strong>Effectively eliminates <code>new</code></strong></p><p>The design of Bali DI is entirely based on the versatility and power of abstract types. However, implementing abstract types manually is cumbersome and tedious. Yet, this seeming disadvantage serves as a very effective deterrent to accidentally <code>new</code> an abstract type in your code and thereby waiving the merits of dependency injection.</p></li></ul>',14),s=[i];function r(d,l,c,p,h,m){return n(),t("div",null,s)}const y=e(a,[["render",r]]);export{g as __pageData,y as default};
