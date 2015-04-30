# Simple Method Calls

Meteor makes making real-time web apps extremely easy. But calling a Meteor method and showing the result can be a little tricky. It usually involves using the `reactive-var` package and calling the method somewhere else. It's just not so meteoric.

The following example shows a how to call an `add` method with a few numbers and return the result with a template helper.

```js
// showing meteor method result
// using reactive-var package

Template.hello.created = function () {
  this.total = new ReactiveVar();
};

Template.hello.rendered = function () {
  var self = this;
  Meteor.call('add', 4, 5, function (err, res) {
    self.total.set(res);
  });
};

// {{total}} can be used inside hello template
Template.hello.helpers({
  total: function () {
    var tpl = Template.instance();
    return tpl.total.get();
  }
});
```

```js
// server-side code
Meteor.methods({
  add: function (x, y) {
    return x + y;
  }
});
```

The code can become a real mess and simply it's just too much code for doing something like this.

## Simple Example

Using this (`mnmtanish:call`) package the above example can be written like this.

```js
// {{total}} can be used inside hello template
Template.hello.helpers({
  total: function () {
    var uniqueId = 'add-numbers';
    return Call(uniqueId, 'add', 4, 5);
  }
});
```

A method call id is used to cache method call results. The method will be called only once for a particular id. If you want to call the method again, use a different id or use the `call.update()` method explained below.

## Another Example

This is another example which also uses 2 helper arguments, checks whether the result is ready and handles method errors.

```js
Template.hello.helpers({
  total: function (x, y) {
    var id = 'add-'+x+'-'+y;
    var call = Call(id, 'add', x, y);

    if(!call.ready()) {
      // method call has not finished yet
      return 'adding numbers...';
    }

    var err = call.error();
    if(err) {
      // method call returned an error
      console.error(err);
      return 'error';
    }

    return call.result();
  }
});
```

## Installation

Add this package with this command.

```
meteor add mnmtanish:call
```

***

## API

### Call(uniqueId, methodName, arg1, arg2, ...)

Calls a meteor method and returns a `MethodCall` instance (let's call it a `call`). It can be returned from a helper directly it's methods can be used. If the uniqueId already exists its result (`MethodCall` instance) will be returned without calling the method again.

### Call.get(id)

Returns a `MethodCall` instance by its unique id.

### call.ready()

**Reactive.** Returns whether the method call has finished or is still being processed on the server;

### call.error()

**Reactive.** Returns a method error if the method call ends with an error.

### call.result()

**Reactive.** Returns method result if the method call ends successfully.

### call.update()

Call the method again.

### call.destroy()

Deletes the method call and result from cache.
