'use strict';

angular.module('classvantageApp')
	.filter('slice', function () {
	  return function(arr, start, end) {
	    return arr.slice(start, end);
	  };
	});