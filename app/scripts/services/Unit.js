'use strict';

angular.module('classvantageApp')
  .factory('Unit', function (Store, ENV) {
		return Store({
			type: 'unit',
			url: ENV.baseURL + 'units',
			relations: [
				{
					name: 'overall_expectations',
					type: 'overall_expectation',
					inverse: 'unit',
					isArray: true
				},
				{
					name: 'strand',
					type: 'strand',
					inverse: 'units'
				}
			]
		});
		//return $resource(_baseURL + 'units');
  })
	.run(function(Unit) {});
