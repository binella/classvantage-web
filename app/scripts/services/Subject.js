'use strict';

angular.module('classvantageApp')
  .factory('Subject', function (Store, ENV) {
		return Store({
			type: 'subject',
			url: ENV.baseURL + 'subjects',
			relations: [
				{
					name: 'curriculum',
					type: 'curriculum',
					inverse: 'subejcts'
				},
				{
					name: 'strands',
					type: 'strand',
					inverse: 'subject',
					isArray: true
				}
			]
		});
  })
	.run(function(Subject) {});
