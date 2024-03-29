'use strict';

angular.module('classvantageApp')
  .factory('OverallExpectation', function (Store, ENV) {
		return Store({
			type: 'overall_expectation',
			url: ENV.baseURL + 'overall_expectations',
			relations: [
				{
					name: 'unit',
					type: 'unit',
					inverse: 'overall_expectations'
				},
				{
					name: 'specific_expectations',
					type: 'specific_expectation',
					inverse: 'overall_expectation',
					isArray: true
				}
			]
		});
		//return $resource(_baseURL + 'units');
  })
	.run(function(OverallExpectation) {});