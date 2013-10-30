'use strict';

angular.module('classvantageApp')
  .factory('Rubric', function (Store) {

		var resource = Store({
			type: 'rubric',
			url: _baseURL + 'rubrics',
			relations: [
				{
					name: 'page',
					type: 'page'
				},
				{
					name: 'rows',
					type: 'row',
					inverse: 'rubric',
					isArray: true
				}
			]
		});

		return resource;    

		//return $resource(_baseURL + 'rubrics/:id', {id: "@id"}, {update: {method: 'PUT'}});
  })
	.run(function (Rubric) {});
