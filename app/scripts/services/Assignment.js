'use strict';

angular.module('classvantageApp')
  .factory('Assignment', function (Store, ENV, $analytics) {
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
		
		resource.afterSave = function (instance, isNew) {
			if (isNew) { $analytics.eventTrack('assignment.create', {type: instance.assignment_type === 'percentage' ? 'manualgrade' : 'checkmark' }); };
		};
		
		return resource;
  })
	.run(function(Assignment) {});
