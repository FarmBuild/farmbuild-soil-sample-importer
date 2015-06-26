'use strict';

describe('farmbuild.soilSampleImporter module', function() {
  beforeEach(function() {
    fixture.setBase('src/unit-test-data')
  })

  // instantiate service
  var soilSampleImporterSession, soilSampleImporter,
    milkSold, fertilizersPurchased,
    susanFarmJson = 'farmdata-susan.json',
    $log;

  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console);
  }));

  afterEach(function() {
    fixture.cleanup()
  });

});
