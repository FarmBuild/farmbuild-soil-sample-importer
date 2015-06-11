/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
describe('farmbuild.soilSampleImporter module: mangementZoneValidator', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample result converter
  var $log, mangementZoneValidator,
    fileFarmData ='farmdata-susan.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json';

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _mangementZoneValidator_) {
    $log = _$log_,
      mangementZoneValidator = _mangementZoneValidator_;
  }));

  describe('soilSampleMangementZones factory', function () {

    it('soilSampleMangementZones factory should be defined', inject(function () {
      expect(mangementZoneValidator).toBeDefined();
    }));
  });


});