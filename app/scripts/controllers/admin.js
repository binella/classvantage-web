'use strict';

angular.module('classvantageApp')
  .controller('AdminCtrl', function ($scope, units) {
	
		$scope.units = units;
		$scope.unit = {};
		$scope.objs = [{val: 'HELLO', val2: 'WORLD', val3: 'LOTS OF TEXT'}, {val: 'HELLO2', val2: 'WORLD2', val3: 'LOTS OF TEXT2'}];
	
		$scope.save = function (obj) { console.log(obj); };
		
		// TODO: make a global fix for this + file an issue on github
		$scope.filterUnits = function (unit) {
			return unit.grade == $scope.selectedGrade && unit.strand.subject.id == $scope.selectedSubjectId;
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
										'<a ng-click="edit()">Edit</a><a ng-click="remove()">Remove</a>' +
									'</div>' +
									'<div ng-show="view.editorEnabled">' +
										'<a ng-click="_save()">Save</a><a ng-click="cancel()">Cancel</a>' +
									'</div>' +
								'</div>' +
								'<div style="clear:both;"></div>',
			scope: {
				save: '&save',
				model: '='
			},
			controller: function ($scope) {
				var view = $scope.view = this.view = {editorEnabled: false};
				var self = this;
				self.model = $scope.model;
				self.modelCopy = {};
				
				$scope.edit = function () { angular.extend(self.modelCopy, self.model); view.editorEnabled = true; };
				$scope.cancel = function () { view.editorEnabled = false; };
				$scope.remove = function () { };
				$scope._save = function () { angular.extend(self.model, self.modelCopy); $scope.cancel(); $scope.save(); };
				
			}
		}
	})
	.directive('editableInput', function () {
		return {
			restrict: 'E',
			require: '^editInPlace',
			template: '<div class="{{class}}">' +
									'<label ng-hide="view.editorEnabled" class="{{class}}">{{model[field]}}</label>' +
									'<input ng-show="view.editorEnabled" ng-model="modelCopy[field]" class={{class}}></input>' +
								'</div>',
			replace: true,
			scope: {
				class: '@class',
				field: '@field'
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
									'<textarea ng-show="view.editorEnabled" ng-model="modelCopy[field]" class="{{class}}"></textarea>' +
								'</div>',
			replace: true,
			scope: {
				class: '@class',
				field: '@field'
			},
			link: function (scope, element, attrs, editInPlaceCtrl) {
				scope.model = editInPlaceCtrl.model;
				scope.modelCopy = editInPlaceCtrl.modelCopy;
				scope.view = editInPlaceCtrl.view;
			},
			controller: function ($scope) {
				$scope.value = 'fdsfds';
			}
		}
	});
