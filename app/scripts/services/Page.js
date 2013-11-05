'use strict';

angular.module('classvantageApp')
  .factory('Page', function (Store, ENV) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});

		var resource = Store({
			type: 'page',
			url: ENV.baseURL + 'pages',
			relations: [
				{
					name: 'students',
					type: 'student',
					inverse: 'pages',
					isArray: true
				},
				{
					name: 'rubrics',
					type: 'rubric',
					inverse: 'page',
					isArray: true
				}
			]
		});

		return resource;
  })
	.run(function(Page) {});
