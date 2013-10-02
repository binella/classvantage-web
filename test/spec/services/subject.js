'use strict';

describe('Service: subject', function () {

  // load the service's module
  beforeEach(module('classvantageApp'));

  // instantiate service
  var subject;
  beforeEach(inject(function (_subject_) {
    subject = _subject_;
  }));

  it('should do something', function () {
    expect(!!subject).toBe(true);
  });

});
