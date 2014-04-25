'use strict';

angular.module('classvantageApp')
  .factory('Curriculum', function (Store, ENV) {
		return Store({
			type: 'curriculum',
			url: ENV.baseURL + 'curriculums',
			relations: [
				{
					name: 'subjects',
					type: 'subject',
					inverse: 'curriculum',
					isArray: true
				}
			]
		});
  })
	.run(function(Curriculum) {});
