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
		
		// Callbacks
		
		resource.afterSave = function (instance, isNew) {
			if (isNew) { $analytics.eventTrack('assignment.create', {type: instance.assignment_type}); };
		};
		
		
		Object.defineProperty(resource.resourcePrototype, '$pattern', {
			get: function () {
				switch (this.assignment_type) {
					case 'letter':
						return '/^(f|F|[a-dA-d](\\+|\\-)?)$/';
					case 'grade':
						return '/^(r|R|[1-4](\\+|\\-)?)$/';
					default:
						return '/(^[1-9]\\d*$)$/';
				}
			}
		});
		
		
		return resource;
  })
	.run(function(Assignment) {});
