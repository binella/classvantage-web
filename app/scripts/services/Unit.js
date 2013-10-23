'use strict';

angular.module('classvantageApp')
  .factory('Unit', function (Store) {
		return Store({
			type: 'unit',
			url: _baseURL + 'units',
			relations: [
				{
					name: 'overall_expectations',
					type: 'overall_expectation',
					isArray: true
				}
			]
		});
		//return $resource(_baseURL + 'units');
  })
	.run(function(Unit) {});
