'use strict';

describe('Controller: RubricCtrl', function () {

  // load the controller's module
  beforeEach(module('classvantageApp'));

  var RubricCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RubricCtrl = $controller('RubricCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
