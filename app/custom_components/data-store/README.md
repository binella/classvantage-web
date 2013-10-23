angular-model
=============

Usage:
-------------

Include library in angular
```javascript
angular.module('myApp', ['data.store'])
```

In your model factory:
```javascript
angular.module('myApp')
  .factory('ModelName', function(Store) {
    var resource = Store({
      type: 'modelname',
      url: 'http://rest.path.to/resources[include plural form]'
    });
    
    return resource;
    
  });
```

In your controller/route-resolve
```javascript
var collection = ModelName.fetchAll();    // Can also do ModelName.fetchAll().$promise if you want a promise

var instance = ModelName.fetchOne(:id);   // Again can do .$promise


// Saving:
instance.some_attribute = 'some_value';
instance.$save();

// Deleting:
instance.$destroy();    // Alternatively can use ModelName.destroy(:id);
```

Thats it for now!

