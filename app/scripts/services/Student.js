'use strict';

angular.module('classvantageApp')
  .factory('Student', function ($resource, Store) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store({
			type: 'student',
			url: _baseURL + 'students'
		});

		return resource;
  })
// This is required to load the factory, otherwise angular wont load until its needed
	.run(function(Student) {
		
	});