'use strict';

angular.module('classvantageApp')
  .controller('AssessmentCtrl', function ($scope, assessment, Mark) {
		
		$scope.assessment = assessment;

		console.log(assessment);

		$scope.saveMark = function (mark, value) {
			mark.value = value;
			mark.$save();
		}
		
  });