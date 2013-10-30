'use strict';

angular.module('classvantageApp')
  .factory('Assessment', function (Store) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store({
			type: 'assessment',
			url: _baseURL + 'assessments',
			relations: [
				{
					name: 'student',
					type: 'student',
					inverse: 'assessments'
				},
				{
					name: 'rubric',
					type: 'rubric',
					inverse: 'assessments' // DOES THIS EXIST?
				},
				{
					name: 'marks',
					type: 'mark',
					inverse: 'assessment',
					isArray: true
				}
			]
		});
		
		// Calculated Properties
		
		Object.defineProperty(resource.resourcePrototype, '$averageGrade', {
			get: function () {
				var count = 0;
				var sum = 0;
				for (var i=0,l=this.marks.length; i<l; i++) {
					if (!!this.marks[i].value) {
						sum += this.marks[i].value;
						count++;
					};
				}
				return sum/count;
			},
			set: function (newValue) {
				
			}
		})
		
		
		// Custom Methods
		
		resource.resourcePrototype.$markForRow = function (row) {
			for (var i=0,l=this.marks.length;i<l;i++) {
				if (this.marks[i].row_id === row.id) {
					return this.marks[i];
				};
			}
			return null;
		};
		
		

		return resource;
  })
	.run(function(Assessment) {
		
	});
