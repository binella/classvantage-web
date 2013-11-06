'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $location, $modal, $filter, Page, Rubric, currentPage, pages) {
		
		// We are promissed currentPage here
		$scope.page = currentPage;	
		$scope.rubrics = $scope.page.rubrics;

		//console.log(temp);
		// New Rubric
		$scope.newRubric = function () {
			//console.log(temp);
			//console.log(temp === $scope.page.rubrics);
			// TOOD: find a good way to set page_id vs. page
			//Rubric.create({page_id: $scope.page.id, page: $scope.page}).$promise.then(function (rubric) {
			//	$location.path('/rubrics/' + rubric.id);
			//}, function () { alert('Error creating rubric'); });
			
			$scope.page.$reload();
			//var temp = $scope.page.rubrics[0];
			//$scope.page.rubrics[0] = $scope.page.rubrics[1];
			//$scope.page.rubrics[1] = temp;
		};
		
		//$scope.$watchCollection('page.rubrics', function(){
		//	console.log('WATCH');
		//});
		
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
		
		$scope.studentId = function (student) {
			//console.log(student);
			return '_' + Math.random().toString(36).substr(2, 9);
		}
		
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
			
  });

