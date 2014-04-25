'use strict';

angular.module('classvantageApp')
  .controller('AdminCurrCtrl', function ($scope, Subject, Strand) {
		
		$scope.newSubject = function () {
			var subject = Subject.new({ created_at: (new Date()).toISOString() });
			$scope.curriculum.subjects.$insert(subject);
			setTimeout(function () {window.scrollTo(0, document.body.scrollHeight);}, 5);
		}
		
		$scope.save = function (obj) { obj.$save(); };
		$scope.cancel = function (obj) { if (!obj.id) { $scope.curriculum.subjects.$remove(obj); } };
		$scope.remove = function (obj) {
			var confirmRemove = confirm("Are you sure you want to delete this subject? All strands within it will also be deleted.");
			if (confirmRemove) {
				$scope.curriculum.subjects.$remove(obj);
				$scope.curriculum.$save();
			};
			
		};
		
		
		$scope.newStrand = function(subject) {
			var strand = Strand.new({ created_at: (new Date()).toISOString() });
			subject.strands.$insert(strand);
		}
		
		$scope.saveStrand = function (obj) { obj.$save(); };
		$scope.cancelStrand = function (subject, obj) { if (!obj.id) { subject.strands.$remove(obj); } };
		$scope.removeStrand = function (subject, obj) {
			var confirmRemove = confirm("Are you sure you want to delete this strand? All its units will also be deleted.");
			if (confirmRemove) {
				subject.strands.$remove(obj);
				subject.$save();
			};
			
		};
		
	/*
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
		*/
  });
