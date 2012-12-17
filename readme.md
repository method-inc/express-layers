# Express Layers

Easily group express middleware into named layers.

## Installation

```
$ npm install express-layers
```

## Usage

app.js:
```js

var express = require('express');
var layers = require('express-layers');

var app = express();
layers(app);  // adds app.lay()

app.use(express.compress());
app.lay('static');  // creates a layer
app.lay('static', express.static(path.join(__dirname, 'public'))); // adds middleware to a layer
app.use(express.router);
```

myComponent.js:
```js
// this will be executed before express.router
app.lay('static', express.static(path.join(__dirname, 'components', 'myComponent', 'public')));
```

## Running Tests

```js
$ npm install
$ make test
```

## With Components

At Skookum, we organize node.js projects into components
(components / feature groups / related user stories).
A project might have components like: users, dashboard, marketing, errors, and admin.

In order to keep the components decoupled, each component is responsible for registering its own routes, controller actions, views, models, etc.

Using express-layers allows us to, for example, group all of the static middleware for different components into the same layer.
Otherwise, routes for one component might intercept public files for another, since components are loaded one after another.

