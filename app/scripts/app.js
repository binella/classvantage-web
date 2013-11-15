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
						return Page.fetchAll();
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
	
	/*
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
	*/
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
		        elm.scrollLeft(target.scrollLeft());
						//$('.bubble').css('margin-left', 106-target.scrollLeft());
						$('.delay-bubble').removeClass('delay-bubble');
		    });
		    elm.scroll(function(){
		        target.scrollLeft(elm.scrollLeft());
						//$('.bubble').css('margin-left', 106-elm.scrollLeft());
		    });
			}
		}
	})
	
	.directive('bubbleDelay', ['$timeout', function ($timeout) {
		var bubbleTimer, fromMouseOver;
		return {
			restrict: 'CA',
			link: function(scope, element, attrs) {
				
				element.bind('mouseenter', function (event) {
					clearTimeout(bubbleTimer);
					if (scope.$eval(attrs.bubbleDelay)) {
						
						bubbleTimer = setTimeout(function() {
							// Collision

							var bubble = element.children('.bubble')
							var newLeft = 106-$('#grid-scrollbar').scrollLeft();
							var widthRequired = (element.offset().left + element.width() + bubble.width());
							if (widthRequired > window.innerWidth) {
								bubble.css('margin-left', newLeft - 102 - bubble.width());
								bubble.addClass('right');
							} else {
								bubble.css('margin-left', newLeft);
								bubble.removeClass('right');
							}
							element.addClass('delay-bubble');
							fromMouseOver = true;
						}, 500);
					
					}
				});
				element.bind('mouseleave', function (event) {
					clearTimeout(bubbleTimer);
					if (fromMouseOver) {
						element.removeClass('delay-bubble');
						fromMouseOver = false;
					}
				});
			}
		}
	}])
	
	.directive('bubbleToggle', ['$document', '$timeout', function ($document, $timeout) {
		var	openBubble = null,
				closeBubble = angular.noop;
		return {
			restrict: 'CA',
			link: function(scope, element, attrs) {
	
				//scope.$watch('$location.path', function() { closeBubble(); });
	      //element.parent().parent().parent().bind('click', function() { closeBubble(); });
				$('#grid-scrollbar').scroll(function() { closeBubble(); });
	      element.bind(attrs.bubbleToggle, function (event) {
		      var bubbleWasOpen = (element === openBubble);
		
	        event.preventDefault();
	        event.stopPropagation();

	        if (!!openBubble) {
						if (attrs.bubbleToggle === 'focus' && event.target === openBubble.context) { return; }
	          closeBubble();
	        }

	        if (!bubbleWasOpen) {

						// Collision
						var bubble = element.parent().parent().parent().children('.bubble')
						var newLeft = 106-$('#grid-scrollbar').scrollLeft();
						var widthRequired = (element.parent().offset().left + element.parent().parent().parent().width() + bubble.width());
						if (widthRequired > window.innerWidth) {
							bubble.css('margin-left', newLeft - 102 - bubble.width());
							bubble.addClass('right');
						} else {
							bubble.css('margin-left', newLeft);
							bubble.removeClass('right');
						}

						element.parent().parent().parent().addClass('open-bubble');
						if (attrs.bubbleToggle === 'click')
							element.parent().parent().parent().children('.bubble').children('textarea').focus();
	          openBubble = element;
	          closeBubble = function (event) {
	            if (event) {
								if (event.target.className.indexOf('bubble') != -1 || 
										event.target.className.indexOf('editable-text') != -1 ||
										event.target === element.context) { return; };
	              event.preventDefault();
	              event.stopPropagation();
	            }
	            $document.unbind('click', closeBubble);
							element.parent().parent().parent().children('.bubble').children('textarea').unbind('keypress');
	            element.parent().parent().parent().removeClass('open-bubble');
	            closeBubble = angular.noop;
	            openBubble = null;
	          };
						$timeout(function() {
	          		$document.bind('click', closeBubble);
								element.parent().parent().parent().children('.bubble').children('textarea').bind('keypress', function(event) {
									if (event.which == 13) {
										event.preventDefault();
										closeBubble();
									};
								})
	        	}, 100);
					}
				});
				
				// Hijack tab
				element.bind('keydown', function (event) {
					if (event.which === 9) {
						event.preventDefault();
						event.stopPropagation();
						var bubbleText = element.parent().parent().parent().children('.bubble').children('textarea')
						bubbleText.focus();
					};
				});
			}
		}
	}])
	
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
