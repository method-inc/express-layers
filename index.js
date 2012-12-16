function patchExpress(app) {
  app.layers = {};
  app.layer = app.lay = createLayer;
}

function createLayer(name) {
  // Create the layer
  if (arguments.length === 1) {
    var newLayer = this.layers[name] = new Layer();
    return this.use(newLayer.handler());
  }
  // Add a middleware to an existing layer
  if (!this.layers[name]) throw new Error('No such layer:', name);
  var actions = Array.prototype.slice.call(arguments, 1);
  this.layers[name].add(actions);
  return this.layers[name];
}

function Layer() {}

Layer.prototype = {

  middlewares: [],

  handler: function() {
    var self = this;
    return handleFn;

    function handleFn(req, res, next) {
      var i = -1;
      run();

      function run(err) {
        if (err) return next(err);
        if (++i < self.middlewares.length) {
          return self.middlewares[i](req, res, run);
        }
        return next();
      }
    }
  },

  add: function(middlewares) {
    if (!Array.isArray(middlewares)) {
      middlewares = Array.prototype.slice.call(arguments);
    }
    this.middlewares = this.middlewares.concat(middlewares);
  }
};

module.exports = patchExpress;