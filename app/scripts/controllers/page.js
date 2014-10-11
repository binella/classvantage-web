'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $location, $modal, $filter, Page, Rubric, Assignment, Checklist, currentPage, pages, $analytics, AgendaItem) {
	
		$scope.page = currentPage;	
		$scope.rubrics = $scope.page.rubrics;
		
		$scope.newRubric = function () {
			var rubric = Rubric.new();
			$scope.page.rubrics.$insert(rubric);
			rubric.$save().then(function (r) {
				$location.path('/rubrics/' + r.id);
			});
		};
		
		$scope.newChecklist = function () {
			var checklist = Checklist.new();
			$scope.page.checklists.$insert(checklist);
			checklist.$save().then(function (c) {
				$location.path('/checklists/' + c.id);
			});
		};
		
		$scope.newAssignment = function (data) {
			var assignment = Assignment.new(data);
			$scope.page.assignments.$insert(assignment);
			assignment.$save();
		};
		
		$scope.newOutOf = function () {
			$modal.open({
				templateUrl: 'views/outofForm.html',
				windowClass: 'new-student-modal assignment-total',
				containerElement: '.container',
				controller: ['$scope', '$modalInstance', 'page', function ($scope, $modalInstance, page) {
					$scope.assignment = Assignment.new({assignment_type: 'outof'});
					$scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					$scope.submitForm = function () {
						page.assignments.$insert($scope.assignment);
						$scope.assignment.$save();
						$scope.cancel();
					}
				}],
				resolve: {
					page: function () {
						return $scope.page;
					}
				}
			});
		};
		
		$scope.reUse = function () {
			$modal.open({
				templateUrl: 'views/reuse.html',
				windowClass: 'reuse-modal',
				//containerElement: '.container',
				controller: ['$scope', '$modalInstance', 'page', 'rubrics', 'checklists', function ($scope, $modalInstance, page, rubrics, checklists) {
					$scope.checklists = checklists;
					$scope.rubrics = rubrics;
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
					$scope.copyAssignment = function (assignment) {
						var ass = eval(assignment.$type.capitalize()).new({copy_from_id: assignment.id, page: page});
						eval('page.'+assignment.$type+'s').$insert(ass);
						ass.$save().then(function(a) {
							$scope.cancel();
							$location.path('/'+assignment.$type+'s/' + a.id);
						});
					}
				}],
				resolve: {
					page: function () {
						return $scope.page;
					},
					rubrics: function () {
						return Rubric.fetchAll().$promise;
					},
					checklists: function () {
						return Checklist.fetchAll().$promise;
					}
				}
			})
		}
		
		$scope.removeAssignment = function (assignment) {
			var confirmRemove = confirm("Are you sure you want to delete this column?");
			if (confirmRemove) {
				if (assignment.$type === 'rubric') {
					$scope.page.rubrics.$remove(assignment);
					/* Analytics */
					$analytics.eventTrack('assignment.delete', {type: 'rubric'});
				} else if (assignment.$type === 'checklist') {
					$scope.page.checklists.$remove(assignment);
					/* Analytics */
					$analytics.eventTrack('assignment.delete', {type: 'checklist'});
				} else {
					$scope.page.assignments.$remove(assignment);
					/* Analytics */
					$analytics.eventTrack('assignment.delete', {type: assignment.assignment_type});
				}
				$scope.page.$save();

			};
		}
		
		// New Agenda
		$scope.newAgenda = function (agenda_item) {
			var clonedAgendaItem;
			if (agenda_item) {
				clonedAgendaItem = AgendaItem.new({title: agenda_item.title, description: agenda_item.description, due_date: agenda_item.due_date});
				clonedAgendaItem.id = agenda_item.id;
			};
			$modal.open({
				templateUrl: 'views/agendaForm.html',
				windowClass: 'new-agenda-modal',
				containerElement: '.container',
				controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
					$scope.cancel = function () { $modalInstance.dismiss('cancel'); };
					$scope.today = function() {
				    $scope.dt = new Date();
				  };
				  $scope.today();
					$scope.dateOptions = {
					    formatYear: 'yy',
					    startingDay: 1,
              showWeeks: false
					  };

					  $scope.initDate = new Date('2016-15-20');
					  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
					  $scope.format = $scope.formats[0];
						// Disable weekend selection
						  $scope.disabled = function(date, mode) {
						    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
						  };
							$scope.toggleMin = function() {
                  var now = new Date(),
                      min = now.setDate(now.getDate() + 1);
							    $scope.minDate = $scope.minDate ? null : min;
							  };
							  $scope.toggleMin();
				  $scope.clear = function () {
				    $scope.dt = null;
				  };
					$scope.date = {open: false};
					$scope.open = function($event) {
				    $event.preventDefault();
				    $event.stopPropagation();
				    $scope.date.opened = true;
				  };
					$scope.agenda_item = clonedAgendaItem || AgendaItem.new();
					$scope.submitForm = function () {
						if ($scope.agenda_item.id) {
							agenda_item.title = $scope.agenda_item.title;
							agenda_item.description = $scope.agenda_item.description;
							agenda_item.due_date = $scope.agenda_item.due_date;
							agenda_item.$save();
							$scope.cancel();
						} else {
							currentPage.agenda_items.$insert($scope.agenda_item);
							$scope.agenda_item.$save();
							$scope.cancel();
						}
					}
				}]
			});
		}
		
		// New Student
		var allStudents = $scope.students;
		$scope.newStudent = function (student) {
			var modalInstance = $modal.open({
	      templateUrl: 'views/studentForm.html',
				windowClass: 'new-student-modal',
				containerElement: '.container',
	      controller: ['$scope', '$modalInstance', 'Student','page', function ($scope, $modalInstance, Student, page) {
					
					$scope.students = allStudents;
					$scope.student = student || Student.new();
					
				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					
					$scope.submitForm = function () {
						if ($scope.student.id) {
							currentPage.students.$insert($scope.student);
							currentPage.$save();
							$scope.student = Student.new()
						} else {
							var student = Student.new({full_name: $scope.student.full_name, parent_emails: $scope.student.parent_emails});
							currentPage.students.$insert(student);
							student.$save().then(function (s) {
								if (s.status === 300) {
									currentPage.students.$remove(student);
									$modal.open({
											templateUrl: 'views/existing_students.html',
											windowClass: 'existing-student-modal',
											controller: ['$scope', '$modalInstance', function($innerScope, $modalInstance) {
												$innerScope.students = s.data.existing_students;
												$innerScope.isInPage = function (st) {
													return st.page_ids.indexOf(currentPage.id) !== -1;
												};
												$innerScope.close = function () { $modalInstance.dismiss('cancel') };
												$innerScope.differentStudent = function () {
													currentPage.students.$insert(student);
													student.force = true;
													student.$save();
													$innerScope.close();
												};
												$innerScope.addStudent = function (st) {
													st.pages = [currentPage]; // Reverse relation needed cuz object is temporary
													currentPage.students.$insert(st);
													currentPage.$save();
													$innerScope.close();
												};
											}]
										});
									}
							});
							$scope.student = Student.new();
						}
					}
					
					$scope.typeAheadSelect = function (item, model, label) {
						$scope.student = item;
					}
					
				}],
				resolve: {
					page: function () {
						return $scope.page;
					}
				}
	    });
		};
		
		
		// Delete Student
		$scope.deleteStudent = function (student) {
			var confirmDelete = confirm('Are you sure you want to remove ' + student.full_name + ' and all his/her marks form the ' + $scope.page.title + ' page?');
			if (confirmDelete) {
				$scope.page.students.$remove(student);
				$scope.page.$save();
			};
		};
		
		// Delete Agenda
		$scope.deleteAgenda = function (agenda_item) {
			var confirmDelete = confirm('Are you sure you want to remove ' + agenda_item.title + ' from this page?');
			if (confirmDelete) {
				$scope.page.agenda_items.$remove(agenda_item);
				$scope.page.$save();
			};
		}
		
		
		$scope.editStudent = function (student) {
			$scope.newStudent(student);
		};
		
		// Assessments
		$scope.saveAndAssess = function (assessment) {
			assessment.$save().then(function (assessment) {
				$location.path('/assessments/' + assessment.id);
			});
		}
		
		$scope.markAssessment = function (assessment, value) {
			assessment.value = value;
			assessment.$save();
		}
		
		$scope.sendAgenda = function () {
			currentPage.$includeInAgenda = true;
			$modal.open({
				templateUrl: 'views/sendAgenda.html',
				windowClass: 'send-agenda-modal',
				containerElement: '.container',
				controller: ['$scope', '$modalInstance', '$filter', 'ENV', '$http', function ($scope, $modalInstance, $filter, ENV, $http) {
					$scope.pages = pages;
					$scope.allAgendas = AgendaItem.fetchAll();
					$scope.cancel = function () {$modalInstance.dismiss('cancel');}
					$scope.personalNote = '';
					$scope.limits = [{value: 'week', caption: '1 week'},
													 {value: '2 weeks', caption: '2 weeks'},
													 {value: '3 weeks', caption: '3 weeks'},
													 {value: '4 weeks', caption: '4 weeks'},
													 {value: '5 weeks', caption: '5 weeks'}];
					$scope.span = 'week';
					$scope.spanDate = new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000);
					$scope.calcNumPages = function () {
						var num = 0;
						for (var i=0,l=pages.length; i<l; i++) {
							if (pages[i].$includeInAgenda) { num++; };
						}
						$scope.numberOfPagesIncluded = num;
					};
					$scope.selectAll = function () {
						for (var i=0,l=pages.length; i < l; i++) {
							pages[i].$includeInAgenda = true;
						};
						$scope.refreshAgendas();
					}
					$scope.deselectAll = function () {
						$scope.agendas = [];
						for (var i=0,l=pages.length; i < l; i++) {
							pages[i].$includeInAgenda = false;
						};
						
						$scope.calcNumPages();
					}
					$scope.refreshAgendas = function () {
						var agendas = [];
						for (var i=0,l=pages.length; i < l; i++) {
							if (pages[i].$includeInAgenda)
								agendas = agendas.concat($filter('filter')($scope.allAgendas, {page_id: pages[i].id}));
						};
						$scope.agendas = [];
						for (var i=0,l=agendas.length; i<l; i++) {
							if ($scope.spanDate - (new Date(agendas[i].due_date)) > 0) {
								$scope.agendas.push(agendas[i]);
							};
						}
						$scope.calcNumPages();
					}
					$scope.refreshAgendas();
					$scope.anyOmits = function() {
						return $filter('filter')($scope.agendas, {$shouldOmit:true}).length > 0;
					};
					$scope.sendAgendas = function () {
						var agendaIds = [];
						for (var i=0,l=$scope.agendas.length; i<l; i++) {
							if (!$scope.agendas[i].$omit || $scope.agendas[i].$omit === undefined)
								agendaIds.push($scope.agendas[i].id);
						}
						$http.post(ENV.baseURL + 'send_agendas', {agenda_item_ids: agendaIds, note: $scope.$$childTail.personalNote, span: $scope.$$childTail.span}).success(function (data) {
							alert('Emails were sent.');
              $modalInstance.close(data);
						});
					};
					$scope.sendMail = function () {};
					$scope.preview = function () {
						var agendaIds = [];
						for (var i=0,l=$scope.agendas.length; i<l; i++) {
							if (!$scope.agendas[i].$omit || $scope.agendas[i].$omit === undefined)
								agendaIds.push($scope.agendas[i].id);
						}
						window.open("#/agenda_preview?agenda_items="+agendaIds.join(',')+"&note="+$scope.$$childTail.personalNote+"&span="+$scope.$$childTail.span, "_blank", "location=no,height=670,width=1050,scrollbars=yes,status=no");
					};

					$scope.calcNumPages();
					$scope.changeLimit = function () {
						switch($scope.$$childTail.span) {
							case "week":
								$scope.spanDate = new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000);
								break;
							case "2 weeks":
								$scope.spanDate = new Date((new Date()).getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
								break;
							case "3 weeks":
								$scope.spanDate = new Date((new Date()).getTime() + 3 * 7 * 24 * 60 * 60 * 1000);
								break;
							case "4 weeks":
								$scope.spanDate = new Date((new Date()).getTime() + 4 * 7 * 24 * 60 * 60 * 1000);
								break;
							case "5 weeks":
								$scope.spanDate = new Date((new Date()).getTime() + 5 * 7 * 24 * 60 * 60 * 1000);
								break;
						}
						$scope.refreshAgendas();
					};
				}]
			});
		}
		
		// TEST
		$scope.log = function(a) {
			console.log('VALUE: ' + a.$value + '.......' + a.value);
		}
		
  });

