'use strict';

angular.module('classvantageApp')
  .factory('Strand', function (Store, ENV) {
		return Store({
			type: 'strand',
			url: ENV.baseURL + 'strands',
			relations: [
				{
					name: 'subject',
					type: 'subject',
					inverse: 'strands'
				},
				{
					name: 'units',
					type: 'unit',
					inverse: 'strand',
					isArray: true
				}
			]
		});
  })
	.run(function(Strand) {});
