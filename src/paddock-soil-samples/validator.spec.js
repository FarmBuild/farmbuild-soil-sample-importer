describe('farmbuild.soilSampleImporter module: paddockSoilSampleRetrieveValidator', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample result converter
  var $log, paddockSoilSampleRetriever,
    fileFarmData ='farmdata-susan.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json';

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _paddockSoilSampleRetrieveValidator_) {
    $log = _$log_,
      paddockSoilSampleRetrieveValidator = _paddockSoilSampleRetriever_;
  }));

  describe('paddockSoilSampleRetrieveValidator factory', function () {

    it('paddockSoilSampleRetrieveValidator factory should be defined', inject(function () {
      expect(paddockSoilSampleRetrieveValidator).toBeDefined();
    }));

  });


});
