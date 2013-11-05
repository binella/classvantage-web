'use strict';

angular.module('classvantageApp')
  .factory('Row', function (Store, ENV) {

		var resource = Store({
			type: 'row',
			url: ENV.baseURL + 'rows',
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
