'use strict';

angular.module('classvantageApp')
  .factory('Gradebook', function ($resource, ENV) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return $resource(ENV.baseURL + 'gradebook', {}, {update: {method: 'PUT'}});
  });
