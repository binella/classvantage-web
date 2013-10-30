'use strict';

angular.module('classvantageApp')
  .controller('AssessmentCtrl', function ($scope, assessment, Mark) {
		
		$scope.assessment = assessment;
		
		$scope.mark = function (row, value) {
			var mark = $scope.assessment.$markForRow(row);
			if (!mark) {
				var mark = Mark.new({row: row});
				$scope.assessment.marks.$insert(mark);
			};
			
			mark.value = value;
			mark.$save();
		}
		
  });