'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $routeParams, Rubric, Unit) {
	
		$scope.units = Unit.query();
		
		$scope.rubric = Rubric.currentRubric || {};
		Rubric.get({id: $routeParams.id}, function (rubric, responseHeaders){
			angular.extend($scope.rubric, rubric);
		}, function (httpResponse){
			// Error getting rubric
		});
		
		
		// TODO: this needs to be DRYed out of here
		$scope.updateModel = function() {
			Rubric.update({id: $scope.rubric.id}, {rubric: $scope.rubric}, function (){/* success */}, function (){/* error */});
		};
		
		$scope.displayDesc = false;
		
  });
