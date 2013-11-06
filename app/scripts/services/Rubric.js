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
		
		return resource;    
  })
	.run(function (Rubric) {});
