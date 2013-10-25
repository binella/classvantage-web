'use strict';

angular.module('classvantageApp')
  .controller('AdminCtrl', function ($scope, $location, units) {
	
		$scope.selectedUnit = {grade: null, subject_id: null};
	
		$scope.units = units;
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			return unit.grade == $scope.selectedUnit.grade && unit.strand.subject.id == $scope.selectedUnit.subject_id;
		};
		
		$scope.goToUnit = function (unit) {
			$location.path('/admin/' + unit.id);
		}
  });
