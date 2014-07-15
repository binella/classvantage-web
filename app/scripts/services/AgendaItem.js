'use strict';

angular.module('classvantageApp')
  .factory('AgendaItem', function (Store, ENV, $analytics) {
		var resource = Store({
			type: 'agenda_item',
			url: ENV.baseURL + 'agenda_items',
			relations: [
				{
					name: 'page',
					type: 'page',
					inverse: 'agenda_items'
				}
			]
		});
		
		// Callbacks
		resource.afterSave = function (instance, isNew) {
			if (isNew) { $analytics.eventTrack('agenda_item.create'); };
		};
		
		
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
		
		Object.defineProperty(resource.resourcePrototype, '$colorCode', {
			get: function () {
				if (!this.due_date) { return "silver" };

				var first = new Date(this.due_date);
				var today = new Date();
	      // Copy date parts of the timestamps, discarding the time parts.
		    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
		    var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		    // Do the math.
		    var millisBetween = one.getTime() - two.getTime();
		    var days = millisBetween / millisecondsPerDay;

		    var daysDiff = Math.floor(days);

				if (daysDiff < 2) { return "red" };
				if (daysDiff < 10) { return "yellow" };
				return "green";
			}
		});
		
		Object.defineProperty(resource.resourcePrototype, '$hexCode', {
			get: function () {
				if (!this.due_date) { return "silver" };

				var first = new Date(this.due_date);
				var today = new Date();
	      // Copy date parts of the timestamps, discarding the time parts.
		    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
		    var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		    // Do the math.
		    var millisBetween = one.getTime() - two.getTime();
		    var days = millisBetween / millisecondsPerDay;

		    var daysDiff = Math.floor(days);

				if (daysDiff < 2) { return "#ff4626" };
				if (daysDiff < 10) { return "#f1af3b" };
				return "#00a573";
			}
		});
		
		Object.defineProperty(resource.resourcePrototype, '$shouldOmit', {
			get: function () {
				if (this.$omit) { return true };
				return false;
			},
			set: function () {
				this.$omit = true;
			}
		})

		return resource;
  })
	.run(function(AgendaItem) {});