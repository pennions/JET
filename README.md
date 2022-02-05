# JET
JET stands for Just Easy Templating. I've created this library 
because I couldn't find a good library that is very small (jet.min.css is ~2kb! pre-gzip)
and that isn't bulky with too many features. doT.js came very close, but it's syntax was
bulky.

# Design principles:

- Easy to use
- Explicit over implicit (inspired from Python)
- Semantic (easy to remember)
- Clean (write as little syntax as possible)
- Logic free (Single responsibility)

# Architecture
For designing this templating engine I've implemented the View and ViewModel part of MVVM (Model View ViewModel).

The view is build based on the viewmodel, which gives a pre-rendered state.
Then it can be interpolated (fill in the properties) with the same viewmodel. So if your viewmodel structure never changes, you can re-use the same rendered template even if it's contents changes.

# Viewmodel
A viewmodel is a JSON object.

Example used in this readme:

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

# Features

- Interpolation
- Loops
- Conditionals
    - This contradicts Logic Free, see explanation for the reason
- Partials


## Interpolation

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

### Interpolate nested properties

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

## Loops

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
### Looping over nested properties
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

## Conditionals
Conditionals contradict the principle of 'Logic Free'. However having conditional renderings is a must for it to be easy, as 'being easy' is the top priority it has been implemented. However implementation is in a bare minimum. The following conditions can be checked.

* if x is y
* if x not y
* if x

### if x is y
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

### if x not y

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

### if x

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

### Partials

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