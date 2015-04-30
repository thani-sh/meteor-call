# Simple Method Calls

Meteor makes making real-time web apps extremely easy. But calling a Meteor method and showing the result can be a little tricky (especially for beginners). It usually involves using the `reactive-var` package and calling the method somewhere else.

```
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

Template.hello.helpers({
  total: function () {
    var tpl = Template.instance();
    return tpl.total.get();
  }
});
```

## Simple Example

The code can become a real mess fast and it's too much code when you want to get things done fast. Using this (`mnmtanish:call`) package the above example can be written like this.

```
Template.hello.helpers({
  total: function () {
    return Call('total', 'add', 4, 5);
  }
});
```

## Another Examples

This is another example which also uses a helper argument, checks whether the result is ready and handles errors.

```
Template.hello.helpers({
  hello: function (name) {
    var id = 'hello-'+name;
    var call = Call(id, 'sayHello', name);

    if(!call.ready()) {
      // method call has not finished yet
      return '...';
    }
    
    if(call.error()) {
      // method call returned an error
      return 'error!';
    }
    
    return call.result();
  }
});
```

## API

### Call(uniqueId, methodName, arg1, arg2, ...)

Calls a meteor method and returns a `MethodCall` instance (let's call it a `call`). It can be returned from a helper directly it's methods can be used.

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
