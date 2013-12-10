'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $stateParams, units, rubric, Row, $state, $analytics) {
	
		/*
		$scope.unitChanged = function(unit) {
			$scope.selection.unit = unit;
			$scope.selection.subject_id = unit.subject_id;
			if (unit.overall_expectations.length > 0)
				$scope.selection.overall = unit.overall_expectations[0];
		}
		*/
		
		$scope.units = units;
		$scope.rubric = rubric;
		$scope.selection = {subject_id: rubric.$subjectId};
		$scope.rubric.$promise.then(function (r) {
			//$scope.selection.unit = r.unit;
			//$scope.selection.subject_id = r.$subjectId;
			if (r.unit && r.unit.$reload) { 
				r.unit.$reload(); 
			}; // This should somehow be handled in data-store: {} is returned when there is no association
			r.$resolveGradeAndSubject();
			return r;
		});
		$scope.overallEnabled = {};
		$scope.displayDesc = false;
		
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			return unit.grade === $scope.rubric.$grade && unit.strand.subject.id === $scope.rubric.$subjectId;
		}
		
		$scope.updateRubricOveralls = function (overall, checked) {
			if (checked) { 
				$scope.rubric.overall_expectations.$insert(overall);
			} else {
				$scope.rubric.overall_expectations.$remove(overall);
			}
			$scope.rubric.$save();
		}
		
		$scope.$watch('rubric.custom_expectation', function (new_value, old_value) {
			if (new_value !== old_value && old_value !== undefined)
				$scope.rubric.custom_expectation_enabled = new_value !== '';
		});
		
		$scope.addRow = function (data) {
			var row = Row.new(data);
			$scope.rubric.rows.$insert(row);
			row.$save();
			$scope.showSpecificSelect = false;
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
			return unit.grade === $scope.rubric.$grade && unit.strand.subject.id === $scope.selection.subject_id;
		}
		
		
		$scope.selectionChanged = function (key, value) {
			$scope.selection[key] = value;
			if (key === 'unit' && value !== null)
				value.$reload();
		}
		
		$scope.showSpecificSelectBox = function () {
			$scope.selection.unit = $scope.rubric.unit;
			$scope.selection.subject_id = $scope.rubric.$subjectId;
			$scope.selection.overall = null;
			if ($scope.selection.unit && $scope.selection.unit.overall_expectations && $scope.selection.unit.overall_expectations.length > 0) {
				$scope.selection.overall = $scope.selection.unit.overall_expectations[0];
				var tmp = $scope.selection.overall.specific_expectations;
				$scope.selection.overall.specific_expectations = [];
				setTimeout(function() {$scope.$apply(function() {  $scope.selection.overall.specific_expectations = tmp;  })}, 1);
			}
			$scope.showSpecificSelect = true;
		}
		
		$scope.deleteRubric = function () {
			var confirmDelete = confirm("Are you sure you want to delete this rubric? All grades associated with this rubric will be deleted as well.");
			if (confirmDelete) {
				$state.go('gradebook.page', {page_id: $scope.rubric.page.id});
				$scope.rubric.$destroy();
				/* Analytics */
				$analytics.eventTrack('assignment.delete', {type: 'rubric'});
			};
		}
		
  });
