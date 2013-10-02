'use strict';

angular.module('classvantageApp')
  .factory('Unit', function ($resource) {
		return $resource(_baseURL + 'units');
  });
