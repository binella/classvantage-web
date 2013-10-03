'use strict';

angular.module('classvantageApp')
  .controller('GradebookCtrl', function ($scope, $location, $modal, Rubric, Page, Gradebook) {
	
		$scope.gradebook = Gradebook.currentGradebook || {};
		$scope.pages = $scope.gradebook.pages || [];
		Page.query({}, function(pages, responseHeaders) {
			angular.extend($scope.gradebook, {pages: pages});
			$scope.pages = $scope.gradebook.pages;
		}, function (httpResponse) {
			// Error
			alert('Error fetching gradebook pages');
		});
		
	
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
		
	
		$scope.newPage = function () {
			var modalInstance = $modal.open({
	      templateUrl: 'views/newPageModal.html',
				windowClass: 'new-page-modal',
				containerElement: '.hero .container',
	      controller: function ($scope, $modalInstance, Unit, Page, pages) {
					
					$scope.page = {};
					$scope.pages = pages;
					$scope.units = Unit.query();

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
				
					$scope.newPage = function () {
						Page.save({}, {page: $scope.page}, function (page, responseHeaders) {
							$scope.cancel();
							pages.push(page);
						}, function (httpRespnse) {
							// Error
						});
					};
				},
	      resolve: {
	        pages: function () {
	          return $scope.pages;
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      //$scope.selected = selectedItem;
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
		};
		
		$scope.switchToPage
		
  });
