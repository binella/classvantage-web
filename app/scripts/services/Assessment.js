'use strict';

angular.module('classvantageApp')
  .factory('Assessment', function (Store, ENV, $analytics) {
		//var resource = $resource(_baseURL + 'pages/:id', {id: "@id"}, {update: {method: 'PUT'}});
		var resource = Store({
			type: 'assessment',
			url: ENV.baseURL + 'assessments',
			relations: [
				{
					name: 'student',
					type: 'student',
					inverse: 'assessments'
				},
				//{
				//	name: 'rubric',
				//	type: 'rubric',
				//	inverse: 'assessments' // DOES THIS EXIST?
				//},
				{
					name: 'assessable',
					type: 'assessable',
					inverse: 'assessments',
					polymorphic: true
				},
				{
					name: 'marks',
					type: 'mark',
					inverse: 'assessment',
					isArray: true
				}
			]
		});
		
		// Callbacks
		
		resource.afterSave = function (data, isNew) {
			if (isNew) { $analytics.eventTrack('assessment.create'); };
		}
		
		// Calculated Properties
		
		Object.defineProperty(resource.resourcePrototype, '$isAutoGrade', {
			get: function () {
				return this.value === null && !this.$shouldAutoGrade;
			},
			set: function (newVal) {
				this.$shouldAutoGrade = newVal ? false : true;
			}
		})
		
		Object.defineProperty(resource.resourcePrototype, '$status', {
			get: function () {
				if (!this.id) { return 'not_started'; };
				if (this.value !== null) { return 'marked'; };
				if (this.$shouldAutoGrade && (this.value === null || this.value === '')) { return 'incomplete'; };
				
				if (this.assessable_type === 'Rubric') {
					if (this.marks.length < this.assessable.rows.length || this.assessable.rows.length === 0) { return 'incomplete'; }
				}
				
				for (var i=0,l=this.marks.length; i<l; i++) {
					if (this.marks[i].value === null) { return 'incomplete'; };
				}
				return 'marked';
			}
		})
		
		Object.defineProperty(resource.resourcePrototype, '$averageGrade', {
			get: function () {
				var avg;
				if (this.$shouldAutoGrade && (this.value === '' || this.value === null)) {
					return '';
				}
				if (this.value || this.$shouldAutoGrade) { 
					avg = this.value; 
				} else {
					var count = 0;
					var sum = 0;
					for (var i=0,l=this.marks.length; i<l; i++) {
						if (this.marks[i].value !== null) {
							sum += this.marks[i].value;
							count++;
						};
					}
					avg = sum/count;
				}
				
				if (isNaN(avg)) { return null; };
				
				if (avg === 0) { return 'R'; };
				var value = (avg + 1) / 3,
						whole = Math.round(value),
						sign = (value - whole) > 0 ? '+' : null,
						sign = sign || ( (value - whole) < 0 ? '-' : '' );
				
				return whole + sign;
				
			},
			set: function (newValue) {
				if (newValue === 'R' || newValue === 'r') {
					this.value = 0;
					return;
				};
				var	whole = parseInt(newValue.substr(0,1)),
						value = (whole * 3) - 1,
						sign = newValue.substr(1,1),
						adjust = (sign === '+' ? 1 : (sign === '-' ? -1 : 0)),
						value = value + adjust;
				this.value = value;
			}
		})
		
		Object.defineProperty(resource.resourcePrototype, '$assignmentAverage', {
			get: function () {
				if (!this.value || this.value == '') { return 0; };
				if (this.value < 60) { return 1;};
				if (this.value < 70) { return 2;};
				if (this.value < 80) { return 3;};
				return 4;
			}
		})
		
		// Collection methods
		
		resource.collectionPrototype.$firstForRubric = function (rubric) {
			// TODO: merge these two methods
			for (var i=0,l=this.length; i<l; i++) {
				if (this[i].assessable.id === rubric.id && this[i].assessable.$type === rubric.$type) { return this[i]; };
			}
			var newInstance = resource.new({assessable: rubric});
			this.$insert(newInstance);
			return newInstance;
		};
		
		resource.collectionPrototype.$firstForAssignment = function (assignment) {
			for (var i=0,l=this.length; i<l; i++) {
				if (this[i].assessable.id === assignment.id && this[i].assessable.$type === assignment.$type) {
					return this[i];
				}
			}
			var newInstance = resource.new({assessable: assignment});
			this.$insert(newInstance);
			return newInstance;
		};

		return resource;
  })
	.run(function(Assessment) {
		
	});
