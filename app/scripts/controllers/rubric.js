'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $stateParams, Rubric, units) {
	
		$scope.units = units;
		
		$scope.rubric = Rubric.currentRubric || {};
		Rubric.get({id: $stateParams.id}, function (rubric, responseHeaders){
			angular.extend($scope.rubric, rubric);
		}, function (httpResponse){
			// Error getting rubric
		});
		
		
		// TODO: this needs to be DRYed out of here
		$scope.updateModel = function() {
			//console.log($scope.rubric);
			Rubric.update({id: $scope.rubric.id}, {rubric: $scope.rubric}, function (){/* success */}, function (){/* error */});
		};
		
		$scope.displayDesc = false;
		
  });
