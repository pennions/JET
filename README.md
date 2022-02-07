<!-- TOC -->

- [1. JET](#1-jet)
- [2. Installation](#2-installation)
    - [2.1. In the browser](#21-in-the-browser)
    - [2.2. In NodeJS as ES6 module](#22-in-nodejs-as-es6-module)
    - [2.3. In NodeJS as CommonJS module](#23-in-nodejs-as-commonjs-module)
- [3. Design principles:](#3-design-principles)
- [4. Architecture](#4-architecture)
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
- [7. Functions](#7-functions)
    - [7.1. build](#71-build)
    - [7.2. render](#72-render)
    - [7.3. compile](#73-compile)

<!-- /TOC -->

# 1. JET
JET stands for Jelmer's Easy Templating. I have created this library 
because I could not find a good library that is very small (jet.min.css is ~2kb! pre-gzip)
and that is not bulky with too many features. doT.js came very close, but its syntax was
bulky. Try it here in this repl: https://pennions.github.io/JET/

> If you intend to use this commercially, think about becoming a supporter, check *Sponsor this project* section on this GitHub page.

&nbsp;
# 2. Installation

Download the latest zip from https://github.com/pennions/JET/releases

Inside the zip file you will find both regular and minified versions.

&nbsp;
## 2.1. In the browser

```
<script src="js/jet.min.js"></script>
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
For designing this templating engine I have implemented the View and ViewModel part of MVVM (Model View ViewModel).

The view is build based on the viewmodel, which gives a pre-rendered state.
Then it can be interpolated (fill in the properties) with the same viewmodel. So if your viewmodel structure never changes, you can re-use the same rendered template even if its contents changes.

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

Loops are kind of the bread and butter of templating. Don't we all know the 'Todo' apps we build in a new language?

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
Conditionals contradict the principle of 'Logic Free'. However having conditional renderings is a must for it to be easy, as 'being easy' is the top priority it has been implemented. However implementation is in a bare minimum. The following conditions can be checked.

* if x is y
* if x not y
* if x

&nbsp;
### 6.3.1. if x is y
This is implemented as a string comparison on both ways.

> caveat: you need to start your inner template with either a { or a < else it will be used as comparison.

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

Checks if a property exists in the model and checks if it's value resolves to true with a terniary comparison.

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

Partials are uncompiled or precompile templates as a string in your viewmodel.
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
&nbsp;
# 7. Functions

There are three functions exposed in the library:

* build
* render
* compile

## 7.1. build

Build is the pre-render step.
It takes a template and a viewmodel an returns a new template with all the property paths resolved.

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
const renderedTemplate = jet.build(template, vm);
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
const renderedTemplate = jet.build(template, vm);
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

Compile is a function that combines both build and render step.
