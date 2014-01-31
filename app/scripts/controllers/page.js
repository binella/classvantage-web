'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $location, $modal, $filter, Page, Rubric, Assignment, Checklist, currentPage, pages, $analytics) {

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
				containerElement: '.container',
				controller: ['$scope', '$modalInstance', 'page', 'rubrics', 'checklists', function ($scope, $modalInstance, page, rubrics, checklists) {
					$scope.checklists = checklists;
					$scope.rubrics = rubrics;
					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
					$scope.copyAssignment = function (assignment) {
						var ass = eval(assignment.$type.capitalize()).new({copy_from_id: assignment.id});
						eval('page.'+assignment.$type+'s').$insert(ass);
						ass.$save().then(function(a) {
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
		
		// New Student
		$scope.newStudent = function (student) {
			var modalInstance = $modal.open({
	      templateUrl: 'views/studentForm.html',
				windowClass: 'new-student-modal',
				containerElement: '.container',
	      controller: ['$scope', '$modalInstance', 'Student','page', function ($scope, $modalInstance, Student, page) {

					$scope.student = student || Student.new();
					
				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					
					$scope.submitForm = function () {
						if ($scope.student.id) {
							$scope.student.$save();
							$scope.cancel();
						} else {
							var student = Student.new({full_name: $scope.student.full_name});
							currentPage.students.$insert(student);
							student.$save();
							$scope.student = Student.new();
						}
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
		
		// TEST
		$scope.log = function(a) {
			console.log('VALUE: ' + a.$value + '.......' + a.value);
		}
		
  });

