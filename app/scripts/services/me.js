'use strict';

angular.module('classvantageApp')
  .factory('Me', function ($resource, ENV) {
    // Service logic
    // ...

    // Public API here
    return $resource(ENV.baseURL + 'me');
  });
