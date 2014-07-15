'use strict';

angular.module('classvantageApp')
  .controller('StudentsCtrl', function ($scope, students) {
		$scope.students = students;
	});