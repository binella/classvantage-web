'use strict';

angular.module('classvantageApp')
  .factory('Row', function (Store) {

		var resource = Store({
			type: 'row',
			url: _baseURL + 'rows',
			relations: [
				{
					name: 'rubric',
					type: 'rubric',
					inverse: 'rows'
				}
			]
		});

		return resource;    

		//return $resource(_baseURL + 'rubrics/:id', {id: "@id"}, {update: {method: 'PUT'}});
  })
	.run(function (Row) {});
