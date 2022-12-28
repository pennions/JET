<!-- TOC -->

- [1. JET](#1-jet)
- [2. Installation](#2-installation)
    - [2.1. In the browser](#21-in-the-browser)
    - [2.2. In NodeJS as ES6 module](#22-in-nodejs-as-es6-module)
    - [2.3. In NodeJS as CommonJS module](#23-in-nodejs-as-commonjs-module)
- [3. Design principles:](#3-design-principles)
- [4. Architecture](#4-architecture)
    - [4.1. Compilation order](#41-compilation-order)
- [5. Viewmodel](#5-viewmodel)
- [6. Features](#6-features)
    - [6.1. Interpolation](#61-interpolation)
        - [6.1.1. Interpolate nested properties](#611-interpolate-nested-properties)
        - [6.1.2. Html encode interpolation](#612-html-encode-interpolation)
    - [6.2. Loops](#62-loops)
        - [6.2.1. Looping over nested properties](#621-looping-over-nested-properties)
    - [6.3. Conditionals](#63-conditionals)
        - [6.3.1. if x is y](#631-if-x-is-y)
        - [6.3.2. if x not y](#632-if-x-not-y)
        - [6.3.3. if x](#633-if-x)
    - [6.4. Partials](#64-partials)
    - [6.5. Viewmodel wrappers](#65-viewmodel-wrappers)
        - [6.5.1 Syntax](#651-syntax)
- [7. Functions](#7-functions)
    - [7.1. build](#71-build)
    - [7.2. render](#72-render)
    - [7.3. compile](#73-compile)
- [8. JET Framework](#8-jet-framework)
    - [8.1. Get value](#81-get-value)
    - [8.2. Watchers](#82-watchers)
    - [8.3. Adding event listeners](#83-adding-event-listeners)

<!-- /TOC -->

# 1. JET
JET stands for Jelmer's Easy Templating. I have created this library 
because I could not find a good library that is very small (jet.min.js is ~8kb! pre-gzip)
and that is not bulky with too many features. doT.js came very close, but its syntax was
bulky. Try JET here in this repl: https://pennions.github.io/JET/

> If you intend to use this commercially, think about becoming a supporter, check *Sponsor this project* section on this GitHub page.

&nbsp;
# 2. Installation

You can install it using a package manager:

```yarn add @pennions/jet``` 

```npm install @pennions/jet```

Or manually:

Download the latest zip from https://github.com/pennions/JET/releases

Inside the zip file you will find both regular and minified versions.

&nbsp;
## 2.1. In the browser

```
<script src="js/jet.min.js"></script>
```

or from a CDN like unpkg:

```
<script src="https://unpkg.com/browse/@pennions/jet/dist/jet.min.js"></script>
```

&nbsp;
## 2.2. In NodeJS as ES6 module

```
import { compile } from 'js/jet.min.js';
```

Or

```
import { render, build } from 'js/jet.min.js';
```

&nbsp;
## 2.3. In NodeJS as CommonJS module
```
const jet = require('js/jet.min.js');
```

&nbsp;
# 3. Design principles:

- Easy to use
- Explicit over implicit (inspired from Python)
- Semantic (easy to remember)
- Clean (write as little syntax as possible)
- Logic free (Single responsibility)

&nbsp;
# 4. Architecture
For designing this templating engine I have implemented the View and Viewmodel part of MVVM (Model View ViewModel).

The view is created with help of the viewmodel, which gives a pre-rendered state.
Then it can be interpolated (fill in the properties) with the same viewmodel. So as long as your JSON model has the keys that are referenced in this pre-rendered state, you don't need to recompile.

## 4.1. Compilation order

1. Partials 
2. Viewmodel wrappers
3. Loops
4. Conditionals

&nbsp;
# 5. Viewmodel
A viewmodel is a JSON object.

Example:

```
const vm = {
    todoList: ['task1', 'task2', 'task3'],
    shoppingList: {
        groceryStore: ['Carrot', 'Melon', 'Potato'],
        bakery: {
            birthday: 'carrot cake',
            daily: ['Bread', 'Cookies'] 
        }
    },
    isAdmin: false,
    username: 'Jet'
}
```
&nbsp;
# 6. Features

- Interpolation
- Loops
- Conditionals
    - This contradicts Logic Free, see explanation for the reason.
- Partials

&nbsp;
## 6.1. Interpolation

You can use the curlybrace (also known as mustachios) to place properties in a template.

&nbsp;
JSON model:

```
const vm = {
    ...
    username: 'Jet'
}
```

Example template:

```
<div>
    <span>Hello </span>
    <span>{{ username }}</span>
</div>
```

Output: 

```
<div>
    <span>Hello </span>
    <span>Jet</span>
</div>
```
&nbsp;
### 6.1.1. Interpolate nested properties
&nbsp;
JSON model:

```
const vm = {
    ...
    shoppingList: {
        ...
        bakery: {
            ...
            daily: ['Bread', 'Cookies'] 
        }
    },
    ...
}
```

Example template:

```
<div>
    <span>Don't forget to buy: </span>
    <span>{{ shoppingList.bakery.daily.0 }}</span>
</div>
```

Output: 

```
<div>
    <span>Don't forget to buy: </span>
    <span>Bread</span>
</div>
```
&nbsp;
### 6.1.2. Html encode interpolation
Sometimes you want to html encode properties, like for a code example or for safety reasons.

&nbsp;
JSON model:

```
const vm = {
   codeExample: '<div>Hello world!</div>'
}
```

Example template:

```
<pre>
    <code>
        {{! codeExample }}
    </code>
</pre>
```

Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<pre>
    <code>
        &lt;div&gt;Hello world!&lt;/div&gt;
    </code>
</pre>
```

&nbsp;
## 6.2. Loops

To demonstrate this principle let us take a look at a very familiar example of a Todo app.

&nbsp;
JSON model:

```
const vm = {
    todoList: ['task1', 'task2', 'task3'],
    ...
}
```

Example template:

```
<ul>
    {{% for task in todoList
        <li>
            {{ task }}
        </li>
    %}}
</ul>
```

> Supports both for ... in ... as wel as for ... of ...

&nbsp;

Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<ul>
    <li>
        task1
    </li>
    <li>
        task2
    </li>
    <li>
        task3
    </li>
</ul>
```
&nbsp;
### 6.2.1. Looping over nested properties
&nbsp;
JSON model:

```
const vm = {
    ...
    shoppingList: {
        groceryStore: ['Carrot', 'Melon', 'Potato'],
    ...
}
```

Example template:

```
<ul>
    {{% for item in shoppingList.groceryStore
        <li>
            {{ item }}
        </li>
    %}}
</ul>
```

Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<ul>
    <li>
        Carrot
    </li>
    <li>
        Melon
    </li>
    <li>
        Potato
    </li>
</ul>
```
&nbsp;

## 6.3. Conditionals
Conditionals contradict the principle of 'Logic Free'. However having conditional renderings is a must for it to be easy, as 'being easy' is the top priority it has been implemented. Therefor the implementation is kept to a bare minimum. The following conditions can be checked:

* if x is y
* if x not y
* if x

&nbsp;
### 6.3.1. if x is y
This is implemented as a string comparison resolved as:

```
x.toString().toLowerCase() === y.toString().toLowerCase()
```

> caveat: you need to start your inner template with either a { or a < else it will be included in the comparison.

&nbsp;

JSON model:

```
    ...
    shoppingList: {
    bakery: {
            ...
            birthday: 'carrot cake',
            ...
        }
    ... 
```

Example template:

```
{{~ if shoppingList.bakery.birthday is carrot cake 
    <div>The cake is not a lie!</div>
~}}
```

Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<div>The cake is not a lie!</div>
```
&nbsp;
### 6.3.2. if x not y
&nbsp;
JSON model:

```
    ...
    isAdmin: false
    ... 
```

Example template:

```
{{~ if isAdmin not true
    <div>Regular user</div>
~}}

{{~ if isAdmin is true
    <div>Admin user</div>
~}}
```

Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<div>Regular user</div>
```

&nbsp;
### 6.3.3. if x

Checks if a property exists in the model and checks if its value resolves to true with a terniary comparison like:

```
x ? template : ''
```

> **Important:** 0, false, '' and [ ] results are all counted as *false*

&nbsp;
JSON model:

```
    ...
    isAdmin: false,
    username: 'Jet'
    ... 
```

Example template:

```
{{~ if isAdmin
    <div>Admin user</div>
~}}

{{~ if username
    <div>{{ username }}</div>
~}}
```

Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<div>Jet</div>
```
&nbsp;
## 6.4. Partials

Partials are uncompiled or precompiled templates as a string in your viewmodel.
&nbsp;
JSON model: 

```
const vm = {
    todoList: ['task1', 'task2', 'task3'],
    shoppingList: {
        groceryStore: ['Carrot', 'Melon', 'Potato'],
        bakery: {
            birthday: 'carrot cake',
            daily: ['Bread', 'Cookies'] 
        }
    },
    isAdmin: false,
    username: 'Jet',
    partials: {
        shoppingList: `<ul> {{% for item in shoppingList.groceryStore <li> {{ item }} </li> %}} </ul>`,
        username: `{{~ if username <div>{{ username }}</div> ~}}`
    }
}
```

Example template:

```
    {{# partials.username #}}
    {{# partials.shoppingList #}}
```
Run:

```
const renderedTemplate = jet.compile(template, vm);
```

Output:

```
<div>Jet</div>
<ul>
    <li> Carrot </li>
    <li> Melon </li>
    <li> Potato </li> 
</ul>
```

## 6.5. Viewmodel wrappers

If you want to create reusable partials for example, you need a way to prefix your properties in a template. A viewmodel wrapper provides this.

### 6.5.1 Syntax

```
{{$ from path.to.property

$}}
```

For example you have a partial with the following template:

```
<h1>{{ title }}</h1>
```

And you have a viewmodel with this structure: 

```
const vm = {
    book: {
        title: 'Epic book'
    },
    title_partial: '<h1>{{ title }}</h1>'
}
```

If you would add the partial directly, title will be undefined.

Unless you wrap it like:

```
{{$ from book
    {{# title_partial #}}
$}}
```

Now it will resolve to:

```
<h1>{{ book.title }}</h1>
```

&nbsp;
# 7. Functions

There are three functions exposed in the library:

* build
* render
* compile

## 7.1. build

Build is the pre-render step.
It takes a template and a viewmodel and returns a new template with all the property paths resolved.

&nbsp;
JSON model: 

```
const vm = {
    todoList: ['task1', 'task2', 'task3'],
}
```

Example template:

```
<ul>
    {{% for task in todoList
        <li>
            {{ task }}
        </li>
    %}}
</ul>
```

Run:

```
const buildTemplate = jet.build(template, vm);
```

Output:

```
<ul>
    <li>
        {{ todoList.0 }}
    </li>
    <li>
        {{ todoList.1 }}
    </li>
    <li>
        {{ todoList.2 }}
    </li>
</ul>
```
&nbsp;
## 7.2. render
This step will fill in the property values and return html.
It takes a template from the build step and the viewmodel which was used.

JSON model: 

```
const vm = {
    todoList: ['task1', 'task2', 'task3'],
}
```

Example template:

```
<ul>
    <li>
        {{ todoList.0 }}
    </li>
    <li>
        {{ todoList.1 }}
    </li>
    <li>
        {{ todoList.2 }}
    </li>
</ul>
```

Run:

```
const renderedTemplate = jet.render(template, vm);
```

Output:

```
<ul>
    <li>
        task1
    </li>
    <li>
        task2
    </li>
    <li>
        task3
    </li>
</ul>
```
&nbsp;
## 7.3. compile
Compile is a function that combines build and render steps.
&nbsp;
# 8. JET Framework
Included in jet is a reactive framework which you can use to not only build and interpolate your template, but also update the it on-the-fly in the browser!

You have only need two commands.

One for the initialization. It takes two required arguments: 
```
jet.init('app', vm);
```

You can also pass a function as a third argument. This will be called after everything has been initialized.

*'app'* is an element id, in which you did all your templating and vm is a viewmodel.

> example viewmodel:
```
const vm = {
    shoppingList: {
        groceryStore: ['Carrot', 'Melon', 'Potato']
    },
    a: {
        b: {
            c: 1337
        }
    },
    message: 'Hello world!',
    hello_world: '<div>{{ message }}</div>'
};
```

After you initialized the framework, you can use the following command to update the template with a new value:

```
jet.update('a.b.c', 42);
``` 

*'a.b.c* is the complete path in the vm, so in this example, *c* is nested under *b* which is nested under *a*.

Another valid example would be:

```
jet.update('hello_world', '<h1>{{ message }}</h1>')
```

It works just like you would access a property from a JSON object.

In the above example you are setting a new template. Which will now be rendered. This is useful for having router functionality. 

You could write your own router to fetch a new template on demand and update your viewmodel. All the properties inside will also become reactive!


## 8.1. Get value
You can use the following command to retrieve the current value of a property inside the reactive viewmodel:

```
jet.get('a.b.c');
```

Where *a.b.c* is the complete property path.

## 8.2. Watchers
You can do a function when a value changes, it will pass the new value as an argument:

```
jet.watch('a.b.c', myFunction(newValue) => console.log(newValue));
```

**N.B.** if the value is nested and you update it like ```'a.b.c'``` it will only trigger when you watch it with ```'a.b.c'``` parameter and *not* for instance if you do ```jet.update('a.b', { c: 'newString' } );```

## 8.3. Adding event listeners
Shorthand for ```document.getElementById(id).addEventListener(event, eventFunction, options?)```:
 
```
jet.addEvent(id, event, eventFunction, options?);
```

Shorthand for ```document.getElementById(id).removeEventListener(event, eventFunction, options?)```:
 
```
jet.removeEvent(id, event, eventFunction, options?);
```
