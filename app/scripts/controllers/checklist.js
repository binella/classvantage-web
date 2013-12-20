'use strict';

angular.module('classvantageApp')
  .controller('ChecklistCtrl', function ($scope, $controller, rubric, units, ChecklistItem) {
		$controller('RubricCtrl', {$scope: $scope, rubric: rubric, units: units});
		
		$scope.newChecklistItem = ChecklistItem.new();
		
		$scope.addChecklistItem = function () {
			$scope.rubric.checklist_items.$insert($scope.newChecklistItem);
			$scope.newChecklistItem.$save();
			$scope.newChecklistItem = ChecklistItem.new();
		}
		
		$scope.deleteChecklistItem = function (item) {
			var confirmDelete = confirm("Are you sure you want to delete this item?");
			if (confirmDelete) {
				$scope.rubric.checklist_items.$remove(item);
				$scope.rubric.$save();
			};
		}
	});