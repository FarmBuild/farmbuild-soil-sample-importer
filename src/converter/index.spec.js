describe('farmbuild.soilSampleImporter module: soilSampleConverter', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('src/unit-test-data')
  });


  //define soil sample result converter
  var $log, soilSampleConverter, farmdataWithSoilSamples,
    soilImportResults,
    fileFarmData ='farmdata-susan-with-sample-import.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json';


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




    it('soilSampleConverter createDefault() should have a structure with empty values', inject(function () {
      var loadedFarmData = fixture.load(fileFarmData);
      expect(loadedFarmData).toBeDefined();
      var emptySoilImportResults = soilSampleConverter.createDefault(loadedFarmData);
      expect(emptySoilImportResults).toBeDefined();

      var results = emptySoilImportResults.results;
      expect(results).toBeDefined();
      expect(results.columnHeaders).toBeDefined();
      expect(results.rows).toBeDefined();
      expect(emptySoilImportResults.paddockRowDictionary).toBeDefined();

    }));


/*    it('soilSampleConverter toSoilSampleResults(): should have specific structure with valid values', inject(function () {
      var loadedFarmData = fixture.load(fileFarmDataWithNewSoilSamples);
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
      expect(soilImportResults.paddockRowDictionary).toBeDefined();
      $log.info('soilImportResults.paddocks '+soilImportResults);
    }));
*/

    it('soilSampleConverter resulting toFarmData(farmData,soilSampleResults) output, farmdata, should have the soil sample values included', inject(function () {
      var farmDataWithoutSoilSample = fixture.load(fileFarmData);
      expect(farmDataWithoutSoilSample).toBeDefined();

      var soilSampleResults = fixture.load(fileSoilImports);
      expect(soilSampleResults).toBeDefined();

      var farmDataWithSoilSamples = soilSampleConverter.toFarmData(farmDataWithoutSoilSample,soilSampleResults);
     //$log.info('farmDataWithSoilSamples after conversion '+JSON.stringify(farmDataWithSoilSamples,null,'    '));
     expect(farmDataWithSoilSamples).toBeDefined();

      var soils = farmDataWithSoilSamples.soils;
      expect(soils).toBeDefined();

      var sampleResults = soils.sampleResults;
      expect(sampleResults).toBeDefined();

      var dateLastUpdated = sampleResults.dateLastUpdated;
      expect(dateLastUpdated).toBeDefined();

      var importFieldNames = sampleResults.importFieldNames;
      expect(importFieldNames).toBeDefined();

      var paddocks = farmDataWithSoilSamples.paddocks;
      expect(paddocks).toBeDefined();

      expect(paddocks.length).toBeGreaterThan(0);
      var singlePaddock, singlePaddockSoil ;
      var paddockP4,paddockP1;
      for(var i=0;i<paddocks.length;i++){
        singlePaddock = paddocks[i];

        singlePaddockName = singlePaddock.name;
        if(singlePaddockName == 'P1'){
          paddockP1=singlePaddock;
        }
        if(singlePaddockName == 'P4'){
          paddockP4=singlePaddock;
        }
      }

      var singleSoilP1 = paddockP1.soils;
      expect(singleSoilP1).toBeDefined();
      expect(singleSoilP1.sampleResults).toBeDefined();
      expect(singleSoilP1.sampleResults.length).toBe(2);

      var singleSoilP4 = paddockP4.soils;
      expect(singleSoilP4).toBeDefined();
      expect(singleSoilP4.sampleResults).toBeUndefined();


//      var resultsFromConvert =  soilSampleConverter.toSoilSampleResults(farmDataWithSoilSamples);
//      expect(resultsFromConvert).toBeDefined();
//
//      var results = resultsFromConvert.results;
//      expect(results).toBeDefined();
//      $log.info('results '+JSON.stringify(results,null,'    '));
//      expect(results.columnHeaders).toBeDefined();
//      expect(results.rows).toBeDefined();
//      $log.info('results.rows'+results.rows);
//      expect(resultsFromConvert.paddockRowDictionary).toBeDefined();
//      expect(resultsFromConvert.importFieldDictionary).toBeDefined();
//      $log.info('soilImportResults.paddocks '+resultsFromConvert);

    }));


  });


});