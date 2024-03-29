'use strict';

angular.module('classvantageApp')
  .factory('SpecificExpectation', function (Store, ENV) {
		return Store({
			type: 'specific_expectation',
			url: ENV.baseURL + 'specific_expectations',
			relations: [
				{
					name: 'overall_expectation',
					type: 'overall_expectation',
					inverse: 'specific_expectations'
				}
			]
		});
		//return $resource(_baseURL + 'units');
  })
	.run(function(SpecificExpectation) {});