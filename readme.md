# Express Layers

Easily group middleware into named layers.

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

app.use(express.compress());
app.lay('static');  // creates a layer
app.lay('static', express.static(path.join(__dirname, 'public'))); // adds middleware to a layer
app.use(express.router);
```

myComponent.js:
```js

app.lay('static', express.static(path.join(__dirname, 'components/myComponent/public'))); // will be executed before router
```