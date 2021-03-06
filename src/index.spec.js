'use strict';

describe('farmbuild.soilSampleImporter module', function() {


  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('src/unit-test-data')
  });


  // define soilSampleImporter service
  var soilSampleImporter, $log, fileFarmData ='farmdata-susan.json';

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _soilSampleImporter_) {
    $log = _$log_,
    soilSampleImporter = _soilSampleImporter_;
  }));

  describe('soilSampleImporter factory', function(){

    it('soilSampleImporter factory should be defined', inject(function() {
      expect(soilSampleImporter).toBeDefined();
    }));


    it('soilSampleImporter create default should have a soilSamples section defined', inject(function() {
      var farmData = fixture.load(fileFarmData);
      var farmDataWithSoilSamples = soilSampleImporter.load(farmData);
      $log.info('farmDataWithSoilSamples '+farmDataWithSoilSamples);
      expect(farmDataWithSoilSamples.soils).toBeDefined();

      var soilsInfo = farmDataWithSoilSamples.soils;
      expect(soilsInfo.sampleResults).toBeDefined();
    }));


    it('soilSampleImporter check if find() returns farmdata from session', inject(function() {
      var farmData  = fixture.load(fileFarmData);
      var farmDataWithSoilSamples = soilSampleImporter.load(farmData);
      var sessionFarmData = soilSampleImporter.find();
      expect(sessionFarmData).toBeDefined();
    }));

  });




});
