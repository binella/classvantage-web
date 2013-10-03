'use strict';

angular.module('classvantageApp')
  .factory('Page', function ($resource) {
		return $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
  });
