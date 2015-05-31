describe('farmbuild.soilSampleImporter module: soilSampleConverter', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample result converter
  var $log, soilSampleConverter, farmdataWithSoilSamples,
    soilImportResults,
    fileFarmData ='farmdata-susan.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json' ;

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _soilSampleConverter_) {
      $log = _$log_,
      soilSampleConverter = _soilSampleConverter_;
  }));

  describe('soilSampleConverter factory', function () {

//    it('soilSampleConverter factory should be defined', inject(function () {
//      expect(soilSampleConverter).toBeDefined();
//    }));
//
//    it('soilSampleConverter toSoilSampleResults should have a structure with empty values', inject(function () {
//      var loadedFarmData = fixture.load(fileFarmData);
//      expect(loadedFarmData).toBeDefined();
//      var emptySoilImportResults = soilSampleConverter.toSoilSampleResults(loadedFarmData);
//      expect(emptySoilImportResults).toBeDefined();
//
//      var results = emptySoilImportResults.results;
//      expect(results).toBeDefined();
//      expect(results.columnHeaders).toBeDefined();
//      expect(results.rows).toBeDefined();
//      expect(emptySoilImportResults.paddockRowDictionary).toBeDefined();
//
//    }));
//
//    it('soilSampleConverter toSoilSampleResults should have specific structure with valid values', inject(function () {
//      var loadedFarmData = fixture.load(fileFarmDataWithSoilSamples);
//      expect(loadedFarmData).toBeDefined();
//
//
//      var soilImportResults = soilSampleConverter.toSoilSampleResults(loadedFarmData);
//      $log.info('soilImportResults '+JSON.stringify(soilImportResults,null,'    '));
//      expect(soilImportResults).toBeDefined();
//
//
//      expect(soilImportResults).toBeDefined();
//
//      var results = soilImportResults.results;
//      expect(results).toBeDefined();
//      expect(results.columnHeaders).toBeDefined();
//      expect(results.rows).toBeDefined();
//      $log.info('results.rows'+results.rows);
//      expect(soilImportResults.paddockRowDictionary).toBeDefined();
//      $log.info('soilImportResults.paddocks '+soilImportResults);
//    }));


    it('soilSampleConverter resulting toFarmData output, farmdata, should have the toSoilSampleResults included', inject(function () {
      var farmDataWithoutSoilSample = fixture.load(fileFarmData);
      expect(farmDataWithoutSoilSample).toBeDefined();

      var soilSampleResults = fixture.load(fileSoilImports);
      expect(soilSampleResults).toBeDefined();

      var farmDataWithSoilSamples = soilSampleConverter.toFarmData(farmDataWithoutSoilSample,soilSampleResults);
      $log.info('farmDataWithSoilSamples after conversion '+JSON.stringify(farmDataWithSoilSamples,null,'    '));
      expect(farmDataWithSoilSamples).toBeDefined();

      var soils = farmDataWithSoilSamples.soils;
      expect(soils).toBeDefined();

      var sampleResults = soils.sampleResults;
      expect(sampleResults).toBeDefined();

      var sampleResults = sampleResults.columnHeaders;
      expect(sampleResults).toBeDefined();

      var paddocks = farmDataWithSoilSamples.paddocks;
      expect(paddocks).toBeDefined();

//      var soils = sampleResults.soils;
//      expect(soils).toBeDefined();

    }));

  });


});