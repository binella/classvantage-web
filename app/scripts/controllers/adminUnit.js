'use strict';

angular.module('classvantageApp')
  .controller('AdminUnitCtrl', function ($scope, unit, OverallExpectation, SpecificExpectation) {
	
		$scope.unit = unit;
		$scope.$parent.selectedUnit = unit;
	
		$scope.newOverall = function () {
			var overall = OverallExpectation.new({ created_at: (new Date()).toISOString() });
			$scope.unit.overall_expectations.$insert(overall);
		}
	
		$scope.save = function (obj) { obj.$save(); };
		$scope.cancel = function (obj) { if (!obj.id) { $scope.unit.overall_expectations.$remove(obj); } };
		$scope.remove = function (obj) {
			var confirmRemove = confirm("Are you sure you want to delete this overall expectation? All specific expectations within it will also be deleted.");
			if (confirmRemove) {
				$scope.unit.overall_expectations.$remove(obj);
				$scope.unit.$save();
			};
			
		};
		
		
		
		$scope.newSpecific = function(overall) {
			var specific = SpecificExpectation.new({ created_at: (new Date()).toISOString() });
			overall.specific_expectations.$insert(specific);
		}
		
		$scope.saveSpecific = function (obj) { obj.$save(); };
		$scope.cancelSpecific = function (overall, obj) { if (!obj.id) { overall.specific_expectations.$remove(obj); } };
		$scope.removeSpecific = function (overall, obj) {
			var confirmRemove = confirm("Are you sure you want to delete this specific expectation?");
			if (confirmRemove) {
				overall.specific_expectations.$remove(obj);
				overall.$save();
			};
			
		};
		
  })
/*
 *	These directives are for use only on the admin page (for now at least)
 *
 */
	.directive('editInPlace', function () {
		return {
			restrict: 'E',
			transclude: true,
			template: '<div class="editable-container" ng-transclude></div>'+
								'<div class="editable-controls">' +
									'<div ng-hide="view.editorEnabled">' +
										'<a ng-click="edit()">Edit</a><a ng-click="_remove()">Remove</a>' +
									'</div>' +
									'<div ng-show="view.editorEnabled">' +
										'<a ng-click="_save()" ng-class="{disabled: (!modelCopy[requiredField] || modelCopy[requiredField] === \'\')}">Save</a><a ng-click="_cancel()">Cancel</a>' +
									'</div>' +
								'</div>' +
								'<div style="clear:both;"></div>',
			scope: {
				save: '&',
				cancel: '&',
				remove: '&',
				model: '=',
				requiredField: '@'
			},
			controller: function ($scope) {
				var view = $scope.view = this.view = {editorEnabled: !$scope.model.id};
				var self = this;
				self.model = $scope.model;
				self.modelCopy = $scope.modelCopy = {};
				
				$scope.edit = function () { angular.extend(self.modelCopy, self.model); view.editorEnabled = true; };
				$scope._cancel = function () { view.editorEnabled = false; if (!self.model.id) { $scope.cancel(); } };
				$scope._remove = function () { $scope.remove(); };
				$scope._save = function () { if (self.modelCopy[$scope.requiredField] && self.modelCopy[$scope.requiredField] !== '') { angular.extend(self.model, self.modelCopy); $scope.save(); view.editorEnabled = false; } };
				
			}
		}
	})
	.directive('editableInput', function () {
		return {
			restrict: 'E',
			require: '^editInPlace',
			template: '<div class="{{class}}">' +
									'<label ng-hide="view.editorEnabled" class="{{class}}">{{model[field]}}</label>' +
									'<input ng-show="view.editorEnabled" ng-model="modelCopy[field]" class="{{class}}" placeholder="{{placeholder}}"></input>' +
								'</div>',
			replace: true,
			scope: {
				class: '@class',
				field: '@field',
				placeholder: '@placeholder'
			},
			link: function (scope, element, attrs, editInPlaceCtrl) {
				scope.model = editInPlaceCtrl.model;
				scope.modelCopy = editInPlaceCtrl.modelCopy;
				scope.view = editInPlaceCtrl.view;
			}
		}
	})
	.directive('editableTextarea', function () {
		return {
			restrict: 'E',
			require: '^editInPlace',
			template: '<div class="{{class}}">' +
									'<label ng-hide="view.editorEnabled" class="{{class}}">{{model[field]}}</label>' +
									'<textarea ng-show="view.editorEnabled" ng-model="modelCopy[field]" class="{{class}}" placeholder="{{placeholder}}"></textarea>' +
								'</div>',
			replace: true,
			scope: {
				class: '@class',
				field: '@field',
				placeholder: '@placeholder'
			},
			link: function (scope, element, attrs, editInPlaceCtrl) {
				scope.model = editInPlaceCtrl.model;
				scope.modelCopy = editInPlaceCtrl.modelCopy;
				scope.view = editInPlaceCtrl.view;
			}
		}
	});