'use strict';

angular.module('classvantageApp')
  .factory('Mark', function (Store) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store({
			type: 'mark',
			url: _baseURL + 'marks',
			relations: [
				{
					name: 'assessment',
					type: 'assessment',
					inverse: 'marks'
				},
				{
					name: 'row',
					type: 'row'//,
					//inverse: 'assessments' // DOES THIS EXIST?
				}
			]
		});
		
		Object.defineProperty(resource.resourcePrototype, '$value', {
			get: function () {
				if (this.value === 0) { return 'R' };
				var value = (this.value + 1) / 3,
						whole = Math.round(value),
						sign = (value - whole) > 0 ? '+' : null,
						sign = sign || ( (value - whole) < 0 ? '-' : '' );
				
				return whole + sign;
			},
			set: function (newValue) {
				
			}
		});

		return resource;
  })
	.run(function(Mark) {
		
	});
