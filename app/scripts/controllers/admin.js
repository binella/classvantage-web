'use strict';

angular.module('classvantageApp')
  .controller('AdminCtrl', function ($scope, curriculums) {
		$scope.curriculums = curriculums;
  });