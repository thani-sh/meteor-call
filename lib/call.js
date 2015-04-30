var calls = {};
var slice = Array.prototype.slice;


Call = function Call (id, name /*, arg1, arg2, ...*/) {
  var call = calls[id];
  if(call) {
    return call;
  }

  var args = slice.call(arguments, 2);
  call = new MethodCall(id, name, args);
  calls[id] = call;
  call.update();

  return call;
};

Call.get = function (id) {
  return calls[id];
};


MethodCall = function MethodCall (id, name, args) {
  this._id = id;
  this._name = name;
  this._args = args;
  this._error = new ReactiveVar();
  this._ready = new ReactiveVar();
  this._result = new ReactiveVar();
};

MethodCall.prototype.update = function() {
  var self = this;
  self._ready.set(false);
  Meteor.apply.call(Meteor, this._name, this._args, function (err, res) {
    self._ready.set(true);
    self._error.set(err);
    self._result.set(res);
  });
};

MethodCall.prototype.error = function() {
  return this._error.get();
};

MethodCall.prototype.ready = function() {
  return this._ready.get();
};

MethodCall.prototype.result = function() {
  return this._result.get();
};

MethodCall.prototype.destroy = function() {
  delete calls[this._id];
};

MethodCall.prototype.toString = function() {
  return this.result() || '';
};
