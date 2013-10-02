'use strict';

angular.module('classvantageApp')
  .controller('GradebookCtrl', function ($scope, $location, Rubric, Gradebook) {
	
		
	
    $scope.newRubric = function () {
			Rubric.save({},{}, function(rubric, postResponseHeader) {
				// Success
				Rubric.currentRubric = rubric;
				$location.path('/rubrics/' + rubric.id);
			}, function () {
				// Error
				alert('Error');
			})
		};
		
		
  });
