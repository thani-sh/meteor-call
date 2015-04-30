var calls = {};


Call = function Call (/*callId, methodName, arg1, arg2, ...*/) {
  var args = Array.prototype.slice.call(arguments);
  var id = args.shift();
  var name = args.shift();
  var call = calls[id];

  if(!call) {
    call = new MethodCall(id, name, args);
    calls[id] = call;
    call.update();
  }

  return call;
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