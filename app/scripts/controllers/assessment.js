'use strict';

angular.module('classvantageApp')
  .controller('AssessmentCtrl', function ($scope, assessment, Mark) {
		
		$scope.assessment = assessment;

		$scope.toggleAutograde = function () {
			if ($scope.assessment.value) { 
				$scope.assessment.value = null;
				$scope.assessment.$save();
			}
		};
		
		$scope.saveMark = function (mark, value) {
			mark.value = value;
			mark.$save();
		};
		
		$scope.marks = {};
		
		$scope.markFor = function (row) {
			var mark = $scope.marks[row.id] = $scope.assessment.marks.$firstForRow(row);
			// TODO: also just use .id when datastore implements generating ids for newly created objects
			return mark.id || '_' + Math.random().toString(36).substr(2, 9);
		};
		
		$scope.printAssessment = function () {
			window.print();
			return false;
		};
		
  });