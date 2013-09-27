'use strict';

describe('Service: Rubric', function () {

  // load the service's module
  beforeEach(module('classvantageApp'));

  // instantiate service
  var Rubric;
  beforeEach(inject(function (_Rubric_) {
    Rubric = _Rubric_;
  }));

  it('should do something', function () {
    expect(!!Rubric).toBe(true);
  });

});
