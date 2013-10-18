'use strict';

angular.module('classvantageApp')
  .factory('Student', function ($resource, Store) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store({
			type: 'student',
			url: _baseURL + 'students'
		});

		return resource;
  });
