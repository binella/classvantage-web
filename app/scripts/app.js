'use strict';

angular.module('classvantageApp', ['env', 'oauthService', 'monospaced.elastic', 'ui.bootstrap.modal', 'ui.router', 'ui.bootstrap.dropdownToggle', 'ngAnimate', 'data.store', 'angulartics', 'angulartics.mixpanel'])

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, oauthProvider, ENV) {
		
		// Allow CORS
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		// OAuth config
		oauthProvider.setEndPoint(ENV.oAuth.endPoint);
		oauthProvider.setClientId(ENV.oAuth.clientId);
		oauthProvider.setClientSecret(ENV.oAuth.clientSecret);

		// Routes
		$urlRouterProvider.otherwise("/gradebook");
		$stateProvider
			/*
			.state('home', {
				url: "/",
				templateUrl: "views/main.html",
				access: 1
			})
			*/
			.state('signup', {
				url: "/signup",
				templateUrl: "views/signup.html",
				controller: "LoginCtrl",
				access: 0
			})
			.state('signin', {
				url: "/signin",
				templateUrl: "views/signin.html",
				controller: "LoginCtrl",
				access: 0
			})
			.state('changePassword', {
				url: "/change_password",
				templateUrl: "views/changePassword.html",
				controller: "MainCtrl",
				access: 1
			})
			.state('resetPassword', {
				url: "/reset_password?token",
				templateUrl: "views/changePassword.html",
				controller: "LoginCtrl",
				access: 0
			})
			.state('gradebook', {
				url: "/gradebook",
				templateUrl: "views/gradebook.html",
				controller: 'GradebookCtrl',
				access: 1,
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
				access: 1,
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
				access: 1,
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
				access: 1,
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
				access: 2,
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
				access: 2,
				resolve: {
					unit: ['$stateParams', 'Unit', function ($stateParams, Unit) {
						return Unit.fetchOne($stateParams.unit_id);
					}]
				}
			});
  })
/*
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
	*/
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
						event.stopPropagation();
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
					var value;
					if (element.context.selectionStart !== element.context.selectionEnd)
						value = element.val().substr(0,element.context.selectionStart) + String.fromCharCode(event.which) + element.val().substr(element.context.selectionEnd);
					else
						value = element.val() + String.fromCharCode(event.which);
					
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
		var isFirefox = typeof InstallTrigger !== 'undefined';
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
								if (!isFirefox) bubble.css('margin-left', newLeft - 102 - bubble.width());
								else bubble.css('margin-left', '-355px');
								bubble.addClass('right');
							} else {
								if (!isFirefox) bubble.css('margin-left', newLeft);
								else bubble.css('margin-left','');
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
	
	.directive('gainsFocus', function () {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				setTimeout(function () {
					element.focus();
				}, 100);
			}
		}
	})
	
	.directive('bubbleToggle', ['$document', '$timeout', function ($document, $timeout) {
		var	openBubble = null,
				closeBubble = angular.noop,
				isFirefox = typeof InstallTrigger !== 'undefined';
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
						var bubble = element.parent().parent().parent().children('.bubble');
						var newLeft = 106-$('#grid-scrollbar').scrollLeft();
						var widthRequired = (element.parent().offset().left + element.parent().parent().parent().width() + bubble.width());
						//console.log(newLeft);
						if (widthRequired > window.innerWidth) {
							if (!isFirefox) bubble.css('margin-left', newLeft - 102 - bubble.width());
							else bubble.css('margin-left', '-355px');
							bubble.addClass('right');
						} else {
							if (!isFirefox) bubble.css('margin-left', newLeft);
							else bubble.css('margin-left','');
							bubble.removeClass('right');
						}

						element.parent().parent().parent().addClass('open-bubble');
						if (attrs.bubbleToggle === 'click')
							element.parent().parent().parent().children('.bubble').children('textarea').focus();
	          openBubble = element;
	          closeBubble = function (event) {
	            if (event) {
								if (event.target.nodeName === '#document' || ( (event.target.className.indexOf('bubble') != -1 || 
										event.target.className.indexOf('editable-text') != -1)) ||
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
	
	.directive('adjustCellHeight', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				scope.$watch(function () {
					return element.innerHeight();
				}, function () {
					element.find('.mark').height(element.height());
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
			};
			
			/*
			scope.reloadMe = function () {
				if(!scope.$$phase) {
				  scope.$apply(function () {
						scope.me = Me.fetchOne('');
					});
				} else {
					scope.me = Me.fetchOne('');
				}
			}
			*/
			/*
			scope.$on('event:auth-loginConfirmed', function( event ) {
				scope.reloadMe();
      });
			*/
			
			scope.$state = state;
			scope.$stateParams = stateParams;
			
			//scope.reloadMe();
			
	  }
	]);
