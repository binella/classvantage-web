'use strict';

angular.module('classvantageApp')
  .factory('Page', function (Store, ENV, $analytics) {
		var resource = Store({
			type: 'page',
			url: ENV.baseURL + 'pages',
			relations: [
				{
					name: 'students',
					type: 'student',
					inverse: 'pages',
					isArray: true
				},
				{
					name: 'rubrics',
					type: 'rubric',
					inverse: 'page',
					isArray: true
				},
				{
					name: 'checklists',
					type: 'checklist',
					inverse: 'page',
					isArray: true
				},
				{
					name: 'assignments',
					type: 'assignment',
					inverse: 'page',
					isArray: true
				}
			]
		});
		
		// Callbacks
		resource.afterSave = function (instance, isNew) {
			if (isNew) { $analytics.eventTrack('page.create', {grade: instance.grade}); };
		};
		

		return resource;
  })
	.run(function(Page) {});
