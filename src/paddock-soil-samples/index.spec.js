describe('farmbuild.soilSampleImporter module: paddockSoilSampleRetriever', function () {




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
  beforeEach(inject(function (_$log_, _paddockSoilSampleRetriever_) {
    $log = _$log_,
      paddockSoilSampleRetriever = _paddockSoilSampleRetriever_;
  }));

  describe('paddockSoilSampleRetriever factory', function () {

    it('paddockSoilSampleRetriever factory should be defined', inject(function () {
      expect(paddockSoilSampleRetriever).toBeDefined();
    }));

  });


});
