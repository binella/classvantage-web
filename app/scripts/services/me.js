'use strict';

angular.module('classvantageApp')
  .factory('Me', function ($resource) {
    // Service logic
    // ...

    // Public API here
    return $resource(_baseURL + 'me');
  });
