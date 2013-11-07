'use strict';

angular.module('classvantageApp')
  .factory('Student', function (Store, ENV) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
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

		resource.resourcePrototype.$assessmentsFor = function (rubrics, assignments) {
			var arr = [];
			// Rubrics
			for (var i=0, l=rubrics.length; i<l; i++) {
				var assessment = this.assessments.$firstForRubric(rubrics[i]);
				assessment.$cachedAverage = assessment.$averageGrade;
				arr.push(assessment);
			}
			// Assignments
			for (var i=0, l=assignments.length; i<l; i++) {
				var assessment = this.assessments.$firstForAssignment(assignments[i]);
				assessment.$cachedAverage = '99';
				arr.push(assessment);
			}
			return arr;
		}

		return resource;
  })
// This is required to load the factory, otherwise angular wont load until its needed
	.run(function(Student) {
		
	});
