'use strict';

angular.module('classvantageApp')
  .controller('GradebookCtrl', function ($scope, $location, $modal, Rubric, Page, Gradebook, Unit, pages) {
	
		// We are promised 'pages' here
	
		$scope.gradebook = Gradebook.currentGradebook || {};
		$scope.pages = pages;// $scope.gradebook.pages || [];
		/*
		Page.query({}, function(pages, responseHeaders) {
			angular.extend($scope.gradebook, {pages: pages});
			$scope.pages = $scope.gradebook.pages;
		}, function (httpResponse) {
			// Error
			alert('Error fetching gradebook pages');
		});
		*/
	
    $scope.newRubric = function () {
			Rubric.save({},{}, function(rubric, postResponseHeader) {
				// Success
				Rubric.currentRubric = rubric;
				$location.path('/rubrics/' + rubric.id);
			}, function () {
				// Error
				alert('Error');
			})
		};
		
	
		$scope.openPageModal = function (currentPage) {
			var modalInstance = $modal.open({
	      templateUrl: 'views/pageForm.html',
				windowClass: 'new-page-modal',
				containerElement: '.hero .container',
	      controller: ['$scope', '$modalInstance', '$location', '$filter', 'units', 'Page', 'pages', function ($scope, $modalInstance, $location, $filter, units, Page, pages) {
					

					$scope.page = {};
					angular.copy(currentPage, $scope.page);
					$scope.page = $scope.page || {};
					//alert($scope.page.grade);
					//if (!currentPage) {
					//	$scope.page.
					//};
					
					$scope.pages = pages;
					$scope.units = units;

					$scope.buttonCaption = $scope.page.id ? 'Save changes' : 'Add page';
					
				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					
					$scope.submitForm = function () {
						// Can we handle this on the backend?
						angular.extend($scope.page, {subject_id: $scope.page.subject.id })
						if ($scope.page.id) {
							Page.update({id: $scope.page.id}, {page: $scope.page}, function (response, responseHeaders) {
								$scope.cancel();
								angular.extend(currentPage, $scope.page);
							}, function (httpResponse) {
								// Error
							});
						} else {
							Page.save({}, {page: $scope.page}, function (page, responseHeaders) {
								$scope.cancel();
								pages.push(page);
								$location.path('/gradebook/' + page.id);
							}, function (httpRespnse) {
								// Error
							});
						};
					}
					
				}],
	      resolve: {
	        pages: function () {
	          return $scope.pages;
	        },
					units: function () {
						return Unit.query({}, function (units, responseHeader) {
							if (!currentPage) {
								$scope.page.grade = $filter('unique')(units, 'grade')[0].grade;
								$scope.page.subject = $filter('filter')(units, function(u) { return u.grade === $scope.page.grade; })[0].strand.subject;
							};
							//$scope.page.grade = '1';//$filter('unique')(units ,'grade')[0];
							//$scope.page.subject = $scope.page.subject || $filter('{grade: '+$scope.page.grade+'}')[0];
						}, function (httpResponse) {/* Error */}).$promise;
					}
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      //$scope.selected = selectedItem;
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
		};
		
		
  });
