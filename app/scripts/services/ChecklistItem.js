'use strict';

angular.module('classvantageApp')
  .factory('ChecklistItem', function (Store, ENV) {

		var resource = Store({
			type: 'checklist_item',
			url: ENV.baseURL + 'checklist_items',
			relations: [
				{
					name: 'checklist',
					type: 'checklist',
					inverse: 'checklist_items'
				}
			]
		});

		return resource;    
  })
	.run(function (ChecklistItem) {});