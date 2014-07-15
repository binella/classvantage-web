angular.module('classvantageApp').
  filter('fromNow', function() {
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
    return function(dateString) {
			var first = new Date(dateString);
			var today = new Date();
      // Copy date parts of the timestamps, discarding the time parts.
	    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
	    var two = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	    // Do the math.
	    var millisBetween = one.getTime() - two.getTime();
	    var days = millisBetween / millisecondsPerDay;

	    var daysDiff = Math.floor(days);
	
			if (daysDiff < 2) { return "Tomorrow"};
			if (daysDiff < 10) { return daysDiff + " days"};
			
			return first.toDateString().substr(4,6);
    };
  });