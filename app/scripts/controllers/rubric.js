'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $stateParams, units, rubric, Row) {
	
		$scope.units = units;
		
		$scope.rubric = rubric;
		
		// TODO: this needs to be DRYed out of here
		$scope.updateModel = function() {
			$scope.rubric.$save();
			//console.log($scope.rubric);
			//Rubric.update({id: $scope.rubric.id}, {rubric: $scope.rubric}, function (){/* success */}, function (){/* error */});
		};
		
		$scope.displayDesc = false;
		
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			if (!$scope.rubric.unit) {return false};
			return unit.grade == $scope.rubric.unit.grade && unit.strand.subject.id == $scope.rubric.unit.strand.subject.id;
		}
		
		$scope.addRow = function () {
			var row = Row.new();
			$scope.rubric.rows.$insert(row);
			row.$save();
		}
		
		$scope.deleteRow = function(row) {
			var confirmDelete = confirm("Are you sure you want to delete this row?");
			if (confirmDelete) {
				$scope.rubric.rows.$remove(row);
				$scope.rubric.$save();
			};
		}
		
		$scope.unlock = function (row) {
			if ($scope.levelsLocked(row)) {
				row.level2_description = row.level3_description = row.level4_description = row.level1_description;
			}
		}
		
		$scope.levelsLocked = function (row) {
			return !(row.level2_description || row.level3_description || row.level4_description);
		}
		
  });
