'use strict';

angular.module('classvantageApp')
  .controller('RubricCtrl', function ($scope, $routeParams, Rubric) {
	
		$scope.rubric = Rubric.currentRubric || {};
			Rubric.get({id: $routeParams.id}, function (rubric, responseHeaders){
				angular.extend($scope.rubric, rubric);
			}, function (httpResponse){
				// Error getting rubric
			});
		
		$scope.updateModel = function() {
			Rubric.update({id: $scope.rubric.id}, {rubric: $scope.rubric}, function (){/* success */}, function (){/* error */});
		};
		
		$scope.displayDesc = false;
		
		$scope.hey = function() {
			alert('hey');
		}
		
  });
