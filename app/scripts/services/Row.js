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
  })
	.run(function (Row) {});
