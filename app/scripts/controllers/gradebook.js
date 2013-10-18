'use strict';

angular.module('classvantageApp')
  .controller('GradebookCtrl', function ($scope, $location, $modal, $filter, Rubric, Page, Gradebook, Unit, pages) {
	
		$scope.gradebook = Gradebook.currentGradebook || {};
		$scope.pages = pages; // We are promised 'pages' here

		$scope.openPageModal = function (currentPage) {
			var modalInstance = $modal.open({
	      templateUrl: 'views/pageForm.html',
				windowClass: 'new-page-modal' + ($scope.pages.length > 0 && !currentPage ? ' wider-modal' : ''),
				containerElement: '.hero .container',
	      controller: ['$scope', '$modalInstance', '$location', 'units', 'Page', 'pages', function ($scope, $modalInstance, $location, units, Page, pages) {
		
					$scope.page = {};
					angular.copy(currentPage, $scope.page);
					$scope.page = $scope.page || {}; // Is this needed?
					
					$scope.pages = pages;
					$scope.units = units;
					
					if (!currentPage) {
						$scope.page.grade = $filter('unique')(units, 'grade')[0].grade;
						$scope.page.subject = $filter('filter')(units, function(u) { return u.grade === $scope.page.grade; })[0].strand.subject;
					}

					$scope.buttonCaption = $scope.page.id ? 'Save changes' : 'Add page';
					
					$scope.$subjectId = function(item) {
						if (item) {
							if (item.grade) { // Cheat!
								// Type: Unit
								return item.strand.subject.id;
							} else {
								// Type: Subject
								return item.id;
							}
						} else {
							return null;
						}
					}
					
				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
					
					$scope.submitForm = function () {
						// Can we handle this on the backend?
						angular.extend($scope.page, {subject_id: $scope.page.subject.id })
						
						if ($scope.page.id) {
							/*
							Page.update({id: $scope.page.id}, {page: $scope.page}, function (response, responseHeaders) {
								$scope.cancel();
								angular.extend(currentPage, $scope.page);
							}, function (httpResponse) {
								// Error
							});
							*/

							angular.extend(currentPage, $scope.page);
							currentPage.$save();
						} else {
							Page.save({}, {page: $scope.page}, function (page, responseHeaders) {
								$scope.cancel();
								pages.unshift(page);
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
						return Unit.query().$promise;
					}
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
				// submiting form should really happen here
	      //$scope.selected = selectedItem;
				console.log(selectedItem);
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
		};
		
		
  });
