'use strict';

angular.module('classvantageApp')
  .factory('Student', function (Store, ENV, $analytics) {
		var resource = Store({
			type: 'student',
			url: ENV.baseURL + 'students',
			relations: [
				{
					name: 'pages',
					type: 'page',
					inverse: 'students',
					isArray: true
				},
				{
					name: 'assessments',
					type: 'assessment',
					inverse: 'student',
					isArray: true
				}
			]
		});

		// Callbacks
		resource.afterSave = function (instance, isNew) {
			if (isNew) { $analytics.eventTrack('student.create'); };
		}

		resource.resourcePrototype.$assessmentsFor = function (rubrics, assignments, checklists) {
			var arr = [];
			// Rubrics
			for (var i=0, l=rubrics.length; i<l; i++) {
				var assessment = this.assessments.$firstForRubric(rubrics[i]);
				assessment.$cachedAverage = assessment.$averageGrade;
				assessment.$columnCreatedAt = rubrics[i].created_at;
				arr.push(assessment);
			}
			// Assignments
			for (var i=0, l=assignments.length; i<l; i++) {
				var assessment = this.assessments.$firstForAssignment(assignments[i]);
				assessment.$columnCreatedAt = assignments[i].created_at;
				arr.push(assessment);
			}
			// Checklists
			for (var i=0, l=checklists.length; i<l; i++) {
				var assessment = this.assessments.$firstForAssignment(checklists[i]);
				assessment.$cachedAverage = assessment.$averageGrade;
				assessment.$columnCreatedAt = checklists[i].created_at;
				arr.push(assessment);
			}
			return arr;
		}
		
		Object.defineProperty(resource.resourcePrototype, '$parent_emails', {
			get: function () {
				if (!this.parent_emails) { return null;};
				return this.parent_emails.join(',');
			},
			set: function (newValue) {
				if (!newValue || newValue.trim() == '') { this.parent_emails = []; return; };
				this.parent_emails = newValue.split(',');
			}
		});

		return resource;
  })
// This is required to load the factory, otherwise angular wont load until its needed
	.run(function(Student) {
		
	});
