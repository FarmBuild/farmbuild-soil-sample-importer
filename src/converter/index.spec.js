describe('farmbuild.soilSampleImporter module: soilSampleConverter', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  })


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

    it('soilSampleConverter factory should be defined', inject(function () {
      expect(soilSampleConverter).toBeDefined();
    }));

    it('soilSampleConverter toSoilSampleResults should have specific structure', inject(function () {
      var loadedFarmData = fixture.load(fileFarmData);
      expect(loadedFarmData).toBeDefined();
      var emptySoilImportResults = soilSampleConverter.toSoilSampleResults(loadedFarmData);
      expect(emptySoilImportResults).toBeDefined();

      var results = emptySoilImportResults.results;
      expect(results).toBeDefined();
      expect(results.columnHeaders).toBeDefined();
      expect(results.rows).toBeDefined();
      expect(emptySoilImportResults.paddocks).toBeDefined();

    }));

    it('soilSampleConverter toSoilSampleResults should have specific structure', inject(function () {
      var loadedFarmData = fixture.load(fileFarmDataWithSoilSamples);
      expect(loadedFarmData).toBeDefined();


      var soilImportResults = soilSampleConverter.toSoilSampleResults(loadedFarmData);
      $log.info('soilImportResults '+JSON.stringify(soilImportResults,null,'    '));
      expect(soilImportResults).toBeDefined();


      expect(soilImportResults).toBeDefined();

      var results = soilImportResults.results;
      expect(results).toBeDefined();
      expect(results.columnHeaders).toBeDefined();
      expect(results.rows).toBeDefined();
      $log.info('results.rows'+results.rows);
      expect(soilImportResults.paddocks).toBeDefined();
      $log.info('soilImportResults.paddocks '+soilImportResults.paddocks);




    }));


  });


});