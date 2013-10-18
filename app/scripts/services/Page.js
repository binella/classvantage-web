'use strict';

angular.module('classvantageApp')
  .factory('Page', function ($resource, Store) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store('page', _baseURL + 'pages');

		return resource;
  });
