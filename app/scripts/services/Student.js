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

		resource.resourcePrototype.$assessmentsFor = function (rubrics, assignments) {
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
			return arr;
		}

		return resource;
  })
// This is required to load the factory, otherwise angular wont load until its needed
	.run(function(Student) {
		
	});
