'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $location, $modal, $filter, Page, Rubric, currentPage, pages) {
		
		// We are promissed currentPage here
		$scope.page = currentPage;

		$scope.gridHeight = (95 + (currentPage.students ? currentPage.students.length * 50 : 0)) + 'px';		
		
		// New Rubric
		$scope.newRubric = function () {
			// TOOD: find a good way to set page_id vs. page
			Rubric.create({page_id: $scope.page.id, page: $scope.page}).$promise.then(function (rubric) {
				$location.path('/rubrics/' + rubric.id);
			}, function () { alert('Error creating rubric'); });

		};
		
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
		
		$scope.saveAndAssess = function (assessment) {
			assessment.$save().then(function (assessment) {
				$location.path('/assessments/' + assessment.id);
			});
		}
		
  });

