/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
describe('farmbuild.soilSampleImporter module: paddockGoupValidator', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample result converter
  var $log, paddockGoupValidator,
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json';

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _paddockGoupValidator_) {
    $log = _$log_,
      paddockGoupValidator = _paddockGoupValidator_;
  }));

  describe('paddockGoupValidator factory', function () {

    it('paddockGoupValidator factory should be defined', inject(function () {
      expect(paddockGoupValidator).toBeDefined();
    }));

    it('paddockGoupValidator farmDataHasPaddockGroups', inject(function () {
      var loadedFarmData = fixture.load(fileFarmDataWithSoilSamples);
      expect(loadedFarmData).toBeDefined();
      var hasPaddockGroups = paddockGoupValidator.farmDataHasPaddockGroups(loadedFarmData);
      expect(hasPaddockGroups).toBeTruthy();
    }));

  });


});