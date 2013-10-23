'use strict';

angular.module('classvantageApp')
  .factory('OverallExpectation', function (Store) {
		return Store({
			type: 'overall_expectation',
			url: _baseURL + 'overall_expectations'
		});
		//return $resource(_baseURL + 'units');
  })
	.run(function(OverallExpectation) {});