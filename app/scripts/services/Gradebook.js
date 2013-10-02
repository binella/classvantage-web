'use strict';

angular.module('classvantageApp')
  .factory('Gradebook', function ($resource) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return $resource(_baseURL + 'gradebook', {}, {update: {method: 'PUT'}});
  });
