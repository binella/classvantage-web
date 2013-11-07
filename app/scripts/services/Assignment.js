'use strict';

angular.module('classvantageApp')
  .factory('Assignment', function (Store, ENV) {
		var resource = Store({
			type: 'assignment',
			url: ENV.baseURL + 'assignments',
			relations: [
				{
					name: 'page',
					type: 'page'
				}
			]
		});
		
		return resource;
  })
	.run(function(Assignment) {});
