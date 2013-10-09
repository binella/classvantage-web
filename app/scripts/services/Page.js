'use strict';

angular.module('classvantageApp')
  .factory('Page', function ($resource) {
		var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		return resource;
  });
