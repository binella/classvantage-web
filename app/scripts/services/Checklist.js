'use strict';

angular.module('classvantageApp')
  .factory('Checklist', function (Store, ENV, $analytics) {

		var resource = Store({
			type: 'checklist',
			url: ENV.baseURL + 'checklists',
			relations: [
				{
					name: 'page',
					type: 'page'
				},
				{
					name: 'checklist_items',
					type: 'checklist_item',
					inverse: 'checklist',
					isArray: true
				},
				{
					name: 'unit',
					type: 'unit'
				},
				{
					name: 'overall_expectations',
					type: 'overall_expectation',
					isArray: true
				}
			]
		});
		
		// Callbacks
		
		resource.afterSave = function (instance, isNew) {
			if (isNew) { $analytics.eventTrack('assignment.create', {type: 'checklist'}); };
		}

		resource.resourcePrototype.$resolveGradeAndSubject = function () {
			if (!this.unit.id) {
				this.$grade = this.page.grade;
				this.$subjectId = this.page.subject_id;
			} else {
				this.$grade = this.unit.grade;
				this.$subjectId = this.unit.strand.subject.id;
			}
		};
		
		resource.resourcePrototype.$hasOverall = function (overall) {
			// SHOULD BE ABLE TO USE indexOf
			for (var i=0, l=this.overall_expectations.length; i<l; i++) {
				if (overall.id === this.overall_expectations[i].id) {
					return true;
				};
			}
			return false;
		}
		
		return resource;    
  })
	.run(function (Checklist) {});