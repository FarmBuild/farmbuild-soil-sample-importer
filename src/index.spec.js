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

//    it('soilSampleImporter factory should be defined', inject(function() {
//      expect(soilSampleImporter).toBeDefined();
//    }));


//    it('soilSampleImporter create default should have a soilSamples section defined', inject(function() {
//      var farmData = {name: 'Susan\'s farm'};
//      var farmDataWithSoilSamples = soilSampleImporter.load(farmData);
//      expect(farmDataWithSoilSamples.soils).toBeDefined();
//
//      var soilsInfo = farmDataWithSoilSamples.soils;
//      expect(soilsInfo.soilSamples).toBeDefined();
//    }));
//
//
  });




});
