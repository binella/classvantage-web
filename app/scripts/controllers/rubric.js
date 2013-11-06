'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $stateParams, units, rubric, Row) {
	
		$scope.units = units;
		$scope.rubric = rubric;
		$scope.selection = {subject_id: rubric.$subjectId};
		$scope.rubric.$promise.then(function (r) {
			$scope.selection.unit = r.unit;
			$scope.selection.subject_id = r.$subjectId;
			if (r.unit) { r.unit.$reload(); };
		});
		$scope.displayDesc = false;
		
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			//if (!$scope.rubric.unit) {return false};
			return unit.grade === $scope.rubric.$grade && unit.strand.subject.id === $scope.rubric.$subjectId;
		}
		
		$scope.addRow = function (data) {
			var row = Row.new(data);
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
		
		// Specific Expectation Row
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnitsSpec = function (unit) {
			return unit.grade == $scope.rubric.$grade && unit.strand.subject.id == $scope.selection.subject_id;
		}
		
		
		$scope.selectionChanged = function (key, value) {
			$scope.selection[key] = value;
			if (key === 'unit' && value !== null) 
				value.$reload();
		}
		
  });
