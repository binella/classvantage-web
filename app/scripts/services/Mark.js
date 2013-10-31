'use strict';

angular.module('classvantageApp')
  .factory('Mark', function (Store) {

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
		
		Object.defineProperty(resource.resourcePrototype, '$wholeValue', {
			get: function () { 
				if (this.value === null) { return null; };
				return Math.round((this.value + 1) / 3); 
			}
		});
		
		Object.defineProperty(resource.resourcePrototype, '$value', {
			get: function () {
				if (this.value === null) { return null; };
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
		
		resource.collectionPrototype.$firstForRow = function (row) {
			for (var i=0,l=this.length; i<l; i++) {
				if (this[i].row_id === row.id) { return this[i]; };
			}
			var newInstance = resource.new({row: row, value: null});
			this.$insert(newInstance);
			newInstance.$save();
			return newInstance;
		};

		return resource;
  })
	.run(function(Mark) {
		
	});
