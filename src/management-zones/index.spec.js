describe('farmbuild.soilSampleImporter module: soilSampleMangementZones', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample result converter
  var $log, mangementZones,
    fileFarmData ='farmdata-susan.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json';

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _mangementZones_) {
    $log = _$log_,
      mangementZones = _mangementZones_;
  }));

  describe('soilSampleMangementZones factory', function () {

    it('soilSampleMangementZones factory should be defined', inject(function () {
      expect(mangementZones).toBeDefined();
    }));
  });


});