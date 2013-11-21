'use strict';

angular.module('classvantageApp')
  .factory('Me', function (Store, ENV) {
	
		var resource = Store({
			type: 'me',
			url: ENV.baseURL + 'me'
		});

    return resource;
  })
	.run(function (Me) {});
