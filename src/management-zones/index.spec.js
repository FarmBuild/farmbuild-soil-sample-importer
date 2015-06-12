describe('farmbuild.soilSampleImporter module: paddockGroups', function () {




  //access test data under data dir
  beforeEach(function () {
    fixture.setBase('examples/data')
  });


  //define soil sample result converter
  var $log, paddockGroups,
    fileFarmData ='farmdata-susan.json',
    fileFarmDataWithSoilSamples = 'farmdata-susan-with-sample.json',
    fileSoilImports = 'soil-sample-import-result.json';

  // inject farmbuild.soilSampleImporter module
  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console)
  }));

  // inject soilSampleImporter service
  beforeEach(inject(function (_$log_, _paddockGroups_) {
      $log = _$log_,
        paddockGroups = _paddockGroups_;
  }));

  describe('paddockGroups factory', function () {

    it('paddockGroups factory should be defined', inject(function () {
      expect(paddockGroups).toBeDefined();
    }));



    it('paddockGroups paddocksInPaddockGroup should be defined', inject(function () {
      var loadedFarmData = fixture.load(fileFarmDataWithSoilSamples);
      expect(loadedFarmData).toBeDefined();
     var paddocksInGroup = paddockGroups.paddocksInPaddockGroup(loadedFarmData,"Zone One");
      expect(paddocksInGroup).toBeDefined();
      expect(paddocksInGroup.length).toBeGreaterThan(0);
    }));



    it('paddockGroups averageForPaddockGroup', inject(function () {
      var loadedFarmData = fixture.load(fileFarmDataWithSoilSamples);
      expect(loadedFarmData).toBeDefined();
      var zoneAverage = paddockGroups.averageForPaddockGroup(loadedFarmData,"Zone One");
      expect(zoneAverage).toBeDefined();

    }));


  });


});