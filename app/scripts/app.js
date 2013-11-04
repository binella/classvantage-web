'use strict';

var _oauthEndPoint = 'http://localhost\:3000/oauth/token'
var _baseURL = 'http://localhost\:3000/v1/';

//var _oauthEndPoint = 'http://com-classvantage-test.herokuapp.com/oauth/token'
//var _baseURL = 'http://com-classvantage-test.herokuapp.com/v1/';

//var _oauthEndPoint = 'http://com-classvantage-staging.herokuapp.com/oauth/token'
//var _baseURL = 'http://com-classvantage-staging.herokuapp.com/v1/';

angular.module('classvantageApp', ['ngResource', 'oauthService', 'monospaced.elastic', 'ui.bootstrap.modal', 'ui.router', 'ui.bootstrap.dropdownToggle', 'ngAnimate', 'data.store'])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, oauthProvider) {
		
		// Allow CORS
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		// OAuth config
		oauthProvider.setEndPoint(_oauthEndPoint);
		oauthProvider.setClientId('20100c70466699968233062227f148840238540ecf511a92e8d5d6748f0149de');
		oauthProvider.setClientSecret('9a13e2fd0a71494c87681b462213d416a3b8b503ca6ed13690bfe3de4ce0ee29');

		// Routes
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state('home', {
				url: "/",
				templateUrl: "views/main.html"
			})
			.state('gradebook', {
				url: "/gradebook",
				templateUrl: "views/gradebook.html",
				controller: 'GradebookCtrl',
				resolve: {
					pages: ['Page', function (Page) {
						return Page.fetchAll().$promise;
					}]
				}
			})
			.state('gradebook.page', {
				url: "/:page_id",
				templateUrl: "views/page.html",
				controller: 'PageCtrl',
				resolve: {
					currentPage: ['$stateParams', '$filter', 'Page', 'pages', function ($stateParams, $filter, Page, pages) {
						var page = Page.fetchOne($stateParams.page_id);
						return page;
					}]
				}
			})
			.state('rubric', {
				url: '/rubrics/:id',
				templateUrl: 'views/rubric.html',
				controller: 'RubricCtrl',
				resolve: {
					rubric: ['$stateParams', 'Rubric', function ($stateParams, Rubric) {
						var rubric = Rubric.fetchOne($stateParams.id);
						rubric.$promise.then(function (rubric) {
							if (!rubric.unit.grade)
								rubric.unit = {grade: rubric.page.grade, strand: {subject: {id: rubric.page.subject_id}}};
							return rubric;
						});
						rubric.unit = rubric.unit || {grade: rubric.page.grade, strand: {subject: {id: rubric.page.subject_id}}};
						return rubric;
					}],
					units: ['Unit', function (Unit) {
						return Unit.fetchAll();
					}]
				}
			})
			.state('assessment', {
				url: '/assessments/:id',
				templateUrl: 'views/assessment.html',
				controller: 'AssessmentCtrl',
				resolve: {
					assessment: ['$stateParams', 'Assessment', function ($stateParams, Assessment) {
						return Assessment.fetchOne($stateParams.id);
					}]
				}
			})
			.state('admin', {
				url: '/admin',
				templateUrl: 'views/admin.html',
				controller: 'AdminCtrl',
				resolve: {
					units: ['Unit', function (Unit) {
						return Unit.fetchAll().$promise;
					}]
				}
			})
			.state('admin.unit', {
				url: '/:unit_id',
				templateUrl: 'views/adminUnit.html',
				controller: 'AdminUnitCtrl',
				resolve: {
					unit: ['$stateParams', 'Unit', function ($stateParams, Unit) {
						return Unit.fetchOne($stateParams.unit_id);
					}]
				}
			});
  })

	.directive('login', function() {
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs) {

	      scope.$on('event:auth-loginRequired', function( event ) {
					scope.username = '';
					scope.password = '';
	        scope.show = true;

	      });

	      scope.$on('event:auth-loginConfirmed', function( event ) {
	        scope.show = false;
	      });
	

	      var button = angular.element(element.find('button'));
	      button.bind('click', function(){
	        scope.$emit('event:authenticate', scope.username, scope.password)

	      });
	    }
	  }
	})

	.directive('cvInput', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('blur', function(e) {
					if (scope.updateModel) {
						scope.updateModel();
					};
				});
			}
		}
	})
	
	.directive('blursOnEnter', function (){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind("keypress", function (event) {
					if (event.which == 13) {
						element.blur();
						event.preventDefault();
					};
				})
			}
		}
	})

	.directive('focusWhen', function (){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focusWhen, function(value) {
					if (value) { element.focus(); };
				});
			}
		}
	})
	
	/* This isnt needed in new version of angular */
	/*
	.directive('ngBlur', ['$parse', function($parse) {
	  return function(scope, element, attr) {
	    var fn = $parse(attr['ngBlur']);
	    element.bind('blur', function(event) {
	      scope.$apply(function() {
	        fn(scope, {$event:event});
	      });
	    });
	  }
	}])
	*/
	/*
	.directive('cvInit', function () {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var expression = attrs.ngRepeat;
				var match = expression.match(/^\s*(.+)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
				var rhs = match[2];
				scope.$watchCollection('page.students', function () {
					console.log(attrs.cvInit);
					scope.$eval(attrs.cvInit);
				});
			}
		}
	})
	*/
	.directive('cvStyledSelect', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				element.uniform({});
				scope.$watch(function() {return ngModel.$modelValue}, function() {
					$timeout(jQuery.uniform.update, 0);
				})
			}
		}
	}])
	
	.directive('cvStyledCheckbox', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.uniform({});
			}
		}
	}])
	
	.directive('scrollWith', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var elm = $(element), target = $(attrs.scrollWith);
				target.scroll(function(){
		        elm
		            .scrollLeft(target.scrollLeft());
		    });
		    elm.scroll(function(){
		        target
		            .scrollLeft(elm.scrollLeft());
		    });
			}
		}
	})
	
	.run(['$rootScope', 'Me', '$state', '$stateParams', '$location',
	  function( scope, Me, state, stateParams, $location) {
	
			scope.$on('event:auth-forbidden', function( event ) {
        history.back();
				alert('Access Denied');
      })
			
			scope.logOut = function () {
				scope.me = {};
				scope.$emit('event:auth-signout');
				$location.path('/');
			};
			
			scope.$on('event:auth-loginConfirmed', function( event ) {
        scope.me = Me.get();
      });
			
			scope.$state = state;
			scope.$stateParams = stateParams;
			

			scope.me = Me.get();
			
	  }
	]);
