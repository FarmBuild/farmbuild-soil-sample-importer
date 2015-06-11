describe('farmbuild.soilSampleImporter module: soilSampleValidator', function () {



  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample validator
  var $log, soilSampleValidator, farmdataWithSoilSamples,
    fileFarmData ='farmdata-susan.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json' ;



  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));


  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _soilSampleValidator_) {
      $log = _$log_,
      soilSampleValidator = _soilSampleValidator_;
  }));

  describe('soilSampleValidator factory', function () {

    it('soilSampleValidator factory should be defined', inject(function () {
      expect(soilSampleValidator).toBeDefined();
    }));

    it('soilSampleValidator isValidSoilSampleResult', inject(function () {
      var soilSampleResults = fixture.load(fileSoilImports);
      expect(soilSampleResults).toBeDefined();

      var isValidSampleResult = soilSampleValidator.isValidSoilSampleResult(soilSampleResults);
      expect(isValidSampleResult).toBeTruthy();



    }));

    it('soilSampleValidator isValidFarmDataWithSoilSample', inject(function () {
      var soilSampleResults = fixture.load(fileFarmDataWithSoilSamples);
      expect(soilSampleResults).toBeDefined();

      var isValidSampleResult = soilSampleValidator.isValidFarmDataWithSoilSample(soilSampleResults);
      expect(isValidSampleResult).toBeTruthy();



    }));


  });

});
