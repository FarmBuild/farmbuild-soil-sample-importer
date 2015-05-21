'use strict';

describe('farmbuild.soilSampleImporter module', function() {

 // define soilSampleImporter service
  var soilSampleImporter;

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter'));

  // inject soilSampleImporter service
  beforeEach(inject(function (_soilSampleImporter_) {
    soilSampleImporter = _soilSampleImporter_;
  }));

  describe('soilSampleImporter factory', function(){

    it('soilSampleImporter factory should be defined', inject(function() {
      expect(soilSampleImporter).toBeDefined();
    }));

  });

});
