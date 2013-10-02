'use strict';

describe('Service: Gradebook', function () {

  // load the service's module
  beforeEach(module('classvantageApp'));

  // instantiate service
  var Gradebook;
  beforeEach(inject(function (_Gradebook_) {
    Gradebook = _Gradebook_;
  }));

  it('should do something', function () {
    expect(!!Gradebook).toBe(true);
  });

});
