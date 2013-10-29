'use strict';

angular.module('classvantageApp')
  .controller('AdminCtrl', function ($scope, $location, units) {
	
		$scope.selection = {unit: {grade: null, subject_id: null}, unit_id: null};
	
		$scope.units = units;
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			return unit.grade == $scope.selection.unit.grade && unit.strand.subject.id == $scope.selection.unit.subject_id;
		};
		
		$scope.goToUnit = function () {
			$location.path('/admin/' + $scope.selection.unit_id);
		}
		
		$scope.revert = function () {
			$location.path('/admin');
		}
		
  });
