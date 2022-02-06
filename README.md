<!-- TOC -->

- [1. JET](#1-jet)
- [2. Design principles:](#2-design-principles)
- [3. Architecture](#3-architecture)
- [4. Viewmodel](#4-viewmodel)
- [5. Features](#5-features)
    - [5.1. Interpolation](#51-interpolation)
        - [5.1.1. Interpolate nested properties](#511-interpolate-nested-properties)
        - [5.1.2. Html encode interpolation](#512-html-encode-interpolation)
    - [5.2. Loops](#52-loops)
        - [5.2.1. Looping over nested properties](#521-looping-over-nested-properties)
    - [5.3. Conditionals](#53-conditionals)
        - [5.3.1. if x is y](#531-if-x-is-y)
        - [5.3.2. if x not y](#532-if-x-not-y)
        - [5.3.3. if x](#533-if-x)
    - [5.4. Partials](#54-partials)
- [6. Functions](#6-functions)
    - [6.1. build](#61-build)
    - [6.2. render](#62-render)
    - [6.3. compile](#63-compile)

<!-- /TOC -->

# 1. JET
JET stands for Just Easy Templating. I've created this library 
because I couldn't find a good library that is very small (jet.min.css is ~2kb! pre-gzip)
and that isn't bulky with too many features. doT.js came very close, but it's syntax was
bulky. Try it here in this repl: https://pennions.github.io/JET/

# 2. Design principles:

- Easy to use
- Explicit over implicit (inspired from Python)
- Semantic (easy to remember)
- Clean (write as little syntax as possible)
- Logic free (Single responsibility)

# 3. Architecture
For designing this templating engine I've implemented the View and ViewModel part of MVVM (Model View ViewModel).

The view is build based on the viewmodel, which gives a pre-rendered state.
Then it can be interpolated (fill in the properties) with the same viewmodel. So if your viewmodel structure never changes, you can re-use the same rendered template even if it's contents changes.

# 4. Viewmodel
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

# 5. Features

- Interpolation
- Loops
- Conditionals
    - This contradicts Logic Free, see explanation for the reason
- Partials


## 5.1. Interpolation

You can use the curlybrace (also known as mustachios) to place properties in a template.

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

### 5.1.1. Interpolate nested properties

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

### 5.1.2. Html encode interpolation
Sometimes you want to html encode properties, like for a code example or for safety reasons.


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


## 5.2. Loops

Loops are kind of the bread and butter of templating. Don't we all know the 'Todo' apps we build in a new language?

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
### 5.2.1. Looping over nested properties
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

## 5.3. Conditionals
Conditionals contradict the principle of 'Logic Free'. However having conditional renderings is a must for it to be easy, as 'being easy' is the top priority it has been implemented. However implementation is in a bare minimum. The following conditions can be checked.

* if x is y
* if x not y
* if x

### 5.3.1. if x is y
This is implemented as a string comparison on both ways.

> caveat: you need to start your inner template with either a { or a < else it will be used as comparison.

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

### 5.3.2. if x not y

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

### 5.3.3. if x

Checks if a property exists in the model and checks if it's value resolves to true with a terniary comparison.

> **Important:** 0, false, '' and [ ] results are all counted as *false*


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

## 5.4. Partials

Partials are uncompiled or precompile templates as a string in your viewmodel.

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

# 6. Functions

There are three functions exposed in the library:

* build
* render
* compile

## 6.1. build

Build is the pre-render step.
It takes a template and a viewmodel an returns a new template with all the property paths resolved.


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

## 6.2. render
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

## 6.3. compile

Compile is a function that combines both build and render step.
