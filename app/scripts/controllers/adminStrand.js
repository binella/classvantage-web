'use strict';

angular.module('classvantageApp')
  .controller('AdminStrandCtrl', function ($scope, Unit) {
		$scope.noUnit = false;
		
		$scope.goToUnit = function (strand, grade) {
			
			var unit = null;
			for (var i=0, l=strand.units.length; i < l; i++) {
				if (strand.units[i].grade == grade) {
					unit = strand.units[i];
					break;
				}
			}
			
			if (unit) {
				$scope.noUnit = false;
				$scope.$state.go('admin.curriculum.strand.unit', {unit_id: unit.id});
			} else {
				$scope.noUnit = true;
			}
		}
		
		$scope.createUnit = function () {
			var unit = Unit.new({grade: $scope.selection.grade});
			$scope.selection.strand.units.$insert(unit);
			unit.$save().then(function (u) {
				$scope.noUnit = false;
				$scope.$state.go('admin.curriculum.strand.unit', {unit_id: u.id});
			});
		}
		
		$scope.revert = function () {
			$scope.noUnit = false;
			if ($scope.$state.is('admin.curriculum.strand.unit')) {
				$scope.$state.go('admin.curriculum.strand');
			};
		}
  });