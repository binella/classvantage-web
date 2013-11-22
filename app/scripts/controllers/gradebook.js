'use strict';

angular.module('classvantageApp')
  .controller('GradebookCtrl', function ($scope, $location, $modal, $filter, Rubric, Page, Unit, pages, $state) {

		// Default to the first page
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if (toState.name === 'gradebook' && pages.length > 0) {
				event.preventDefault();
				$state.go('gradebook.page', {page_id: pages[0].id});
			};
		});

		//$scope.gradebook = Gradebook.currentGradebook || {};
		$scope.pages = pages; // We are promised 'pages' here
		
		$scope.newPage = function () {
			$scope.openPageModal(Page.new({ created_at: (new Date()).toISOString() }));
		}

		$scope.openPageModal = function (currentPage) {
			var isNew = !currentPage.id;
			var modalInstance = $modal.open({
	      templateUrl: 'views/pageForm.html',
				windowClass: 'new-page-modal' + ($scope.pages.length > 0 && isNew ? ' wider-modal' : ''),
				containerElement: '.hero .container',
	      controller: ['$scope', '$modalInstance', '$location', 'units', 'Page', 'pages', function ($scope, $modalInstance, $location, units, Page, pages) {
		
		
					$scope.page = {};
					angular.extend( $scope.page, currentPage);
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
	
						angular.extend(currentPage, $scope.page);
						if (isNew) {
							currentPage.$save().then(function (page) {
								// this should be done in the store,..needs scope.apply
								pages.unshift(page);
								$scope.cancel();
								$location.path('/gradebook/' + page.id);
							})
						} else {
							currentPage.$save().then(function (page) {}, function () { alert('Error creating page'); });
							$scope.cancel();
						}
					}
					
				}],
	      resolve: {
	        pages: function () {
	          return $scope.pages;
	        },
					units: function () {
						return Unit.fetchAll();
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
