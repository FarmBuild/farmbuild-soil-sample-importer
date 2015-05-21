'use strict';

describe('farmbuild.soilSampleImporter module', function() {
  beforeEach(function() {
    fixture.setBase('examples/data')
  })

  // instantiate service
  var soilSampleImporterSession, soilSampleImporter,
    milkSold, fertilizersPurchased,
    susanFarmJson = 'farmdata-susan.json',
    $log;

  beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(module('farmbuild.soilSampleImporter'));

  beforeEach(inject(function (_soilSampleImporterSession_, _soilSampleImporter_,
                              _milkSold_,
                              _fertilizersPurchased_,
                              _$log_) {
    soilSampleImporterSession = _soilSampleImporterSession_;
    soilSampleImporter = _soilSampleImporter_;
    milkSold = _milkSold_;
    fertilizersPurchased = _fertilizersPurchased_;
    $log = _$log_;
  }));

  describe('load an existing calclator from session', function(){
    it('soilSampleImporterSession should be defined', inject(function() {
      expect(soilSampleImporterSession).toBeDefined();
    }));
  });

  describe('load an existing farmdata from session', function(){
    it('farmdataSession.load should return null.', inject(function() {
      sessionStorage.setItem('farmdata', null);

      var data = soilSampleImporterSession.loadSection();

      expect(data).toBe(undefined);
    }));
  });

  describe('save an existing farmdata to session', function(){

    it('farmdataSession.load.', inject(function() {
      var loaded = fixture.load(susanFarmJson),
        typesSize = 30,
        section = 'fertilizersPurchased';

      loaded = soilSampleImporter.load(loaded)

      var found = soilSampleImporterSession.loadSection(section);

      expect(found).toBeDefined();
      expect(found.types).toBeDefined();
      expect(found.types.length).toBe(typesSize);
    }));
  });


  afterEach(function() {
    fixture.cleanup()
  });

});
