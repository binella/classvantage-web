'use strict';

angular.module('classvantageApp')
  .controller('PageCtrl', function ($scope, $location, $modal, Page, Rubric, currentPage) {
		
		// We are promissed currentPage here
		$scope.page = currentPage;
		
		//$scope.addRubricCaption = 'Add your first rubric';
		//$scope.addRubricMargin = '34px';
		//$scope.addRubricWidth = '265px';

		//if (currentPage.rubrics && currentPage.rubrics.length > 0) {
			//$scope.addRubricCaption = '';
			//$scope.addRubricWidth = '113px';
			//$scope.addRubricMargin = '40px';
		//} 

		$scope.gridHeight = (95 + (currentPage.students ? currentPage.students.length * 50 : 0)) + 'px';
		
		
		
		// New Rubric
		$scope.newRubric = function () {
			// TOOD: find a good way to set page_id vs. page
			Rubric.create({page_id: $scope.page.id, page: $scope.page}).$promise.then(function (rubric) {
				$location.path('/rubrics/' + rubric.id);
			}, function () { alert('Error creating rubric'); });
			/*
			Rubric.save({},{rubric: {page_id: $scope.page.id}}, function(rubric, postResponseHeader) {
				// Success
				Rubric.currentRubric = rubric;
				$location.path('/rubrics/' + rubric.id);
			}, function () {	alert('Error creating rubric'); });
			*/
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
						// TODO: just update the model and it should take care of the ajax call and what not
						/*
						Page.update({id: currentPage.id}, {page: {students_attributes: [{full_name: $scope.student.full_name}]}}, function (newPage, responseHeaders) {
							$scope.cancel();
							angular.extend(currentPage, newPage);
						}, function () { alert('Error adding student'); });
						*/
						currentPage.students.$insert({full_name: $scope.student.full_name});
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
				/*
				// TODO: This should all happen on the model side
				var studentIndex = $scope.page.students.indexOf(student);
				if (studentIndex > -1) {
					$scope.page.students.splice(studentIndex, 1);
				};
				Page.update({id: $scope.page.id}, {page: {students_attributes: [{id: student.id, _destroy: true}]}}, function (page, responseHeaders) {
					
				}, function () { alert('Error deleting student'); });
				*/
				$scope.page.students.$remove(student);
			};
		};
		
  });

