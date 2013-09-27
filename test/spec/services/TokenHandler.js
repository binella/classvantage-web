'use strict';

describe('Service: TokenHandler', function () {

  // load the service's module
  beforeEach(module('classvantageApp'));

  // instantiate service
  var TokenHandler;
  beforeEach(inject(function (_TokenHandler_) {
    TokenHandler = _TokenHandler_;
  }));

  it('should do something', function () {
    expect(!!TokenHandler).toBe(true);
  });

});
