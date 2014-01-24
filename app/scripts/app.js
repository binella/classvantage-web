'use strict';

angular.module('classvantageApp', ['env', 'oauthService', 'monospaced.elastic', 'ui.bootstrap.modal', 'ui.router', 'ui.bootstrap.dropdownToggle', 'ngAnimate', 'data.store', 'angulartics', 'angulartics.mixpanel'])
	/*
	.provider('indicator', function () {
		var elem = null, iCounter = 0;
		var reqInt = function (config) {
			if (config.method !== 'GET') {
				iCounter++;
				if (iCounter === 1)
					elem.animate({right:'20px'},500);
			}
			return config;
		}, resInt = function (response) {
			if (response.config.method !== 'GET') {
				setTimeout(function() {
					iCounter--;
					if (iCounter === 0)
						elem.animate({right:'-50px'},500);
				}, 1000);
			}
			return response
		};
		this.interceptors = function () {
			return {
				'request': reqInt,
				'response': resInt
			}
		};
		this.$get = function () {
			return {
				setElement: function (element) {
					//element.hide();
					elem = element;
				}
			};
		}
	})*/
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, oauthProvider, ENV) {
		
		// Allow CORS
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		// OAuth config
		oauthProvider.setEndPoint(ENV.oAuth.endPoint);
		oauthProvider.setClientId(ENV.oAuth.clientId);
		oauthProvider.setClientSecret(ENV.oAuth.clientSecret);
		
		// Loading Indicator
		//$httpProvider.interceptors.push(indicatorProvider.interceptors);

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
						// TODO: this can def be done better
						var rubric = Rubric.fetchOne($stateParams.id);
						rubric.$promise.then(function (rubric) {
							rubric.$resolveGradeAndSubject();
							return rubric;
						});
						rubric.$resolveGradeAndSubject();
						return rubric;
					}],
					units: ['Unit', function (Unit) {
						return Unit.fetchAll();
					}]
				}
			})
			.state('checklist', {
				url: '/checklists/:id',
				templateUrl: 'views/rubric.html',
				controller: 'ChecklistCtrl',
				access: 1,
				resolve: {
					// TODO: DRY this out properly
					rubric: ['$stateParams', 'Checklist', function ($stateParams, Checklist) {
						var checklist = Checklist.fetchOne($stateParams.id);
						checklist.$promise.then(function (checklist) {
							checklist.$resolveGradeAndSubject();
							return checklist;
						});
						checklist.$resolveGradeAndSubject();
						return checklist;
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
			.state('print', {
				url: '/print/:type/:id?ungraded',
				templateUrl: 'views/print.html',
				access: 1,
				controller: ['$scope', 'assignment', 'ungraded', 'Student', function ($scope, assignment, ungraded, Student) {
					$scope.assignment = assignment;
					if (ungraded) {
						$scope.ungraded = true;
						$scope.students = [Student.new()];
					} else {
						$scope.students = assignment.page.students;
					}
					assignment.page.$reload();
				}],
				resolve: {
					assignment: ['$stateParams', 'Rubric', 'Checklist', function ($stateParams, Rubric, Checklist) {
						return eval($stateParams.type.capitalize()).fetchOne($stateParams.id).$promise;
					}],
					ungraded: ['$stateParams', function ($stateParams) {
						return $stateParams.ungraded;
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
	
	.directive('ngEnter', function (){
		return {
			restric: 'A',
			link: function(scope, element, attrs) {
				element.bind('keypress', function (event) {
					if (event.which === 13) {
						event.preventDefault();
						event.stopPropagation();
						scope.$eval(attrs.ngEnter);
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
	/*
	.directive('loadingIndicator', ['indicator', function (indicator) {
		return {
			restrict: 'CA',
			link: function(scope, element, attrs) {
				indicator.setElement(element);
			}
		}
	}])
	*/
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
					
					if (!regex.test(value) && event.which !== 8 && event.which !== 0) { event.preventDefault() };
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
		    });
		    elm.scroll(function(){
		        target.scrollLeft(elm.scrollLeft());
		    });
			}
		}
	})
	
	.directive('bubbleDelays', ['$timeout', function ($timeout) {
		var bubbleTimer, fromMouseOver;
		var isFirefox = typeof InstallTrigger !== 'undefined';
		return {
			restrict: 'CA',
			scope:false,
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
							element.addClass('open-bubble');
							fromMouseOver = true;
						}, 500);
					
					}
				});
				element.bind('mouseleave', function (event) {
					clearTimeout(bubbleTimer);
					if (fromMouseOver) {
						element.removeClass('open-bubble');
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
	
	.directive('bubbleDelay', ['$document', '$timeout', '$compile', function ($document, $timeout, $compile) {
		var	gridScrollbar = angular.element('#grid-scrollbar'),
				bubble = angular.element('<div class="bubble" id="bubble"><textarea class="editable-text" style="height:43px;" msd-elastic="" placeholder="Type a comment" ng-blur="assessment.$save()" blurs-on-enter></textarea></div>'),
				currentScope = null,
				closeBubble = function (event) {
					if (event && (bubble.has(event.target).length > 0 || event.target.id === 'bubble'))
						return;
					
					if (currentScope) {
						currentScope.$destroy();
						currentScope = null;
					};
					
					forcedOpen = false;
					
					bubble.css('top', '-999px'); 
					bubble.hide();
					$document.unbind('click', closeBubble);
					bubble.unbind('mouseleave', closeBubble);
					
				};
				
		angular.element('body').append(bubble);
		var	bubbleWidth = bubble.width(),
				bubbleMarginLeft = 106,
				bubbleTa = bubble.children('textarea'),
				bubbleTimer = null,
				fromMouseOver = false,
				forcedOpen = false;
		gridScrollbar.scroll(closeBubble);
		
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				var	cell = element;
				
				scope.openBubble = function (force) {
					closeBubble();
					
					if (force) {
						clearTimeout(bubbleTimer);
						fromMouseOver = false;
						forcedOpen = true;
					};
					
					// Position the bubble
					var position = cell.position(),
							absPosition = cell.offset();
					if (absPosition.left + bubbleWidth + bubbleMarginLeft > window.innerWidth) {
						bubble.addClass('right');
						bubble.css('left', position.left - bubbleWidth - bubbleMarginLeft + 2);
					} else {
						bubble.removeClass('right');
						bubble.css('left', position.left);
					}
					
					// Attach Model
					bubbleTa[0].setAttribute('ng-model', attrs.bubbleModel);
					currentScope = scope.$new();
					var clonedElement = $compile(bubbleTa)(currentScope, function(clonedElement, newScope) {
						bubble.html(clonedElement);
						bubble.appendTo(cell);
						bubble.css('top', position.top);
						bubble.show();
					});
					
					// Bind close events
					$timeout(function () {
						$document.bind('click', closeBubble);
					}, 100);
				};
				
				// Mouse action
				element.bind('mouseenter', function (event) {
					clearTimeout(bubbleTimer);
					if (scope.$eval(attrs.bubbleDelay) && !forcedOpen) {
						
						bubbleTimer = setTimeout(function() {
							fromMouseOver = true;
							scope.openBubble();
						}, 500);
					
					}
				});
				
				element.bind('mouseleave', function (event) {
					clearTimeout(bubbleTimer);
					if (fromMouseOver) {
						if (event.toElement === bubble[0]) {
							bubble.bind('mouseleave', function () { closeBubble(); }); // LEAK
							return;
						};
						closeBubble();
						fromMouseOver = false;
					};
				});
				
			}
		}
	}])
	
	.directive('bubbleToggle', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs, bubbleCtrl) {
				// Toggle Action
				element.bind(attrs.bubbleToggle, function (event) {
					scope.openBubble(true);
				});
			}
		}
	})
	
	.directive('bubbleToggles', ['$document', '$timeout', function ($document, $timeout) {
		var	openBubble = null,
				closeBubble = angular.noop,
				isFirefox = typeof InstallTrigger !== 'undefined',
				bubble = angular.element('#bubble');
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
						//var bubble = element.parent().parent().parent().children('.bubble');
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

						//element.parent().parent().parent().addClass('open-bubble');
						bubble.show();
						
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
					setTimeout(function () {
						element.find('.mark').height(element.height());
					}, 100);
				});
			}
		}
	})
	
	.directive('prints', function ($document) {
		var iFrame = angular.element('<iframe name="printFrame" style="width:0px;height:0px;"></iframe>');
		angular.element(document.body).append(iFrame);
		
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind('click', function (event) {
					iFrame.attr('src', '');
					setTimeout(function () {
						iFrame.attr('src', attrs.prints);
					}, 200);
				});
			}
		}
	})
	
	.directive('resolveController', ['$controller', function($controller) {
    return {
      scope: true,
      link: function(scope, elem, attrs) {
        var resolve = scope.$eval(attrs.resolve);
        angular.extend(resolve, {$scope: scope});
        $controller(attrs.resolveController, resolve);
      }
    };
  }])
	
	.directive('ngAutoExpand', ['$window', function($window) {
    return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				var minHeight = element.height();
				var ta = element[0];
				// listen
				/*
        if ('onpropertychange' in ta && 'oninput' in ta) {
          // IE9
          ta['oninput'] = ta.onkeyup = adjust;
        } else {
          ta['oninput'] = function () {
						console.log('ONINPUT');
					};
        }
				*/
				scope.$watch(function () {
					return ngModel.$modelValue;
				}, function () {
					setTimeout(function () {
						element.height(0);
		         var height = ta.scrollHeight;
						console.log(height);
		         // 8 is for the padding
		         if (height < 20) {
		             height = minHeight || 28;
		         }
		         element.height(height+8);
					}, 0);
				})
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
