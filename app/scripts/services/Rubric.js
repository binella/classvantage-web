'use strict';

angular.module('classvantageApp')
  .factory('Rubric', function ($resource) {
    // Service logic


    // Public API here
    return $resource(_baseURL + 'rubrics/:id', {id: "@id"}, {update: {method: 'PUT'}});
  });
