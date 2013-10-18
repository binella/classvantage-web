'use strict';

angular.module('classvantageApp')
  .factory('Page', function ($resource, Store, Student) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store({
			type: 'page',
			url: _baseURL + 'pages',
			relations: {
				'students': Student
			}
		});

		return resource;
  });
