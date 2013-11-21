'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $location, $modal, $filter, Page, Rubric, Assignment, currentPage, pages) {
		
		$scope.page = currentPage;	
		$scope.rubrics = $scope.page.rubrics;

		$scope.newRubric = function () {
			var rubric = Rubric.new();
			$scope.page.rubrics.$insert(rubric);
			rubric.$save().then(function (r) {
				$location.path('/rubrics/' + r.id);
			});
		};
		
		$scope.newAssignment = function (data) {
			var assignment = Assignment.new(data);
			$scope.page.assignments.$insert(assignment);
			assignment.$save();
		};
		
		$scope.removeAssignment = function (assignment) {
			var confirmRemove = confirm("Are you sure you want to delete this column?");
			if (confirmRemove) {
				$scope.page.assignments.$remove(assignment);
				$scope.page.$save();
			};
		}
		
		// New Student
		$scope.newStudent = function () {
			var modalInstance = $modal.open({
	      templateUrl: 'views/studentForm.html',
				windowClass: 'new-student-modal',
				containerElement: '.container',
	      controller: ['$scope', '$modalInstance', 'Student','page', function ($scope, $modalInstance, Student, page) {

					$scope.student = Student.new();
					
				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					
					$scope.submitForm = function () {
						var student = Student.new({full_name: $scope.student.full_name});
						currentPage.students.$insert(student);
						student.$save();
						
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
		
		
		// Delete Student
		$scope.deleteStudent = function (student) {
			var confirmDelete = confirm('Are you sure you want to remove ' + student.full_name + ' and all his/her marks form the ' + $scope.page.title + ' page?');
			if (confirmDelete) {
				$scope.page.students.$remove(student);
				$scope.page.$save();
			};
		};
		
		
		// Assessments
		/*
		$scope.assessments = {};
		
		$scope.assessmentFor = function (student, rubric) {
			console.log(student.id + ' : ' + rubric.id);
			var assessmentRow = $scope.assessments[student.id] = $scope.assessments[student.id] || {};
			var assessment = assessmentRow[rubric.id] = student.assessments.$firstForRubric(rubric);
			assessment.$cachedAverage = assessment.$averageGrade;
			// TODO: use .id when datastore is capable of generating ids for newly created objects
			return assessment.id || '_' + Math.random().toString(36).substr(2, 9);
		}
		*/
		
		$scope.saveAndAssess = function (assessment) {
			assessment.$save().then(function (assessment) {
				$location.path('/assessments/' + assessment.id);
			});
		}
		
		
		$scope.delayComment = function () {
			console.log('ata');
		}

		
  });

