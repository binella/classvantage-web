'use strict';

angular.module('classvantageApp')
  .factory('Rubric', function (Store, ENV) {

		var resource = Store({
			type: 'rubric',
			url: ENV.baseURL + 'rubrics',
			relations: [
				{
					name: 'page',
					type: 'page'
				},
				{
					name: 'rows',
					type: 'row',
					inverse: 'rubric',
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
	.run(function (Rubric) {});
