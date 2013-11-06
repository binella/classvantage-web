'use strict';

angular.module('classvantageApp', ['env', 'ngResource', 'oauthService', 'monospaced.elastic', 'ui.bootstrap.modal', 'ui.router', 'ui.bootstrap.dropdownToggle', 'ngAnimate', 'data.store'])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, oauthProvider, ENV) {
		
		// Allow CORS
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		// OAuth config
		oauthProvider.setEndPoint(ENV.oAuth.endPoint);
		oauthProvider.setClientId(ENV.oAuth.clientId);
		oauthProvider.setClientSecret(ENV.oAuth.clientSecret);

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
							rubric.$resolveGradeAndSubject();
							return rubric;
						});
						rubric.$resolveGradeAndSubject();
						//rubric.unit = rubric.unit || {grade: rubric.page.grade, strand: {subject: {id: rubric.page.subject_id}}};
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
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				element.uniform({});
				scope.$watch(function() {return ngModel.$modelValue}, function() {
					$timeout(jQuery.uniform.update, 0);
				});
			}
		}
	}])
	
	.directive('cvPattern', function () {
		
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var regex = eval(attrs.cvPattern);
				// TODO: also do onChange
				element.bind('keypress', function (event) {
					var value = element.val() + String.fromCharCode(event.which);
					if (!regex.test(value)) { event.preventDefault() };
				});
			}
		}
	})
	
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
