'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $stateParams, Rubric, units, currentRubric) {
	
		$scope.units = units;
		
		$scope.rubric = currentRubric;
		
		
		
		// TODO: this needs to be DRYed out of here
		$scope.updateModel = function() {
			//console.log($scope.rubric);
			Rubric.update({id: $scope.rubric.id}, {rubric: $scope.rubric}, function (){/* success */}, function (){/* error */});
		};
		
		$scope.displayDesc = false;
		
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			if (!$scope.rubric.unit) {return false};
			return unit.grade == $scope.rubric.unit.grade && unit.strand.subject.id == $scope.rubric.unit.strand.subject.id;
		}
		
  });
