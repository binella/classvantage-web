'use strict';

function swapArrayElements(array_object, index_a, index_b) {
    var temp = array_object[index_a];
    array_object[index_a] = array_object[index_b];
    array_object[index_b] = temp;
}

angular.module('classvantageApp')
	.filter('slice', function () {
	  return function(arr, start, end) {
	    return arr.slice(start, end);
	  };
	})
	// THIS CAN BE WAY MORE EFFICIENT
	.filter('swapForId', function () {
		return function(arr, index, data) {
			
			for (var i=0, l=arr.length; i<l; i++) {
				if (arr[i].id && arr[i].id == data) {
					var idx = arr.indexOf(arr[i]);
					if (idx > index) {
						swapArrayElements(arr, idx, index);
					}
				}
			}
			
			return arr;
		};
	});
