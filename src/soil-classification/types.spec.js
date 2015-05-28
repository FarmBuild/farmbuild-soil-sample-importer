'use strict';

describe('farmbuild.soilSampleImporter module', function() {

    // instantiate service
    var $log;
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console)
    }));
    var soilClassificationTypes, h2O = 'pH H2O (Water)', collections;

    beforeEach(inject(function (_$log_, _soilClassificationTypes_, _collections_) {
        $log = _$log_;
        soilClassificationTypes = _soilClassificationTypes_;
        collections = _collections_;
    }));

    describe('soilClassificationTypes factory', function(){
        it('soilClassificationTypes should be defined', inject(function() {
            expect(soilClassificationTypes).toBeDefined();
        }));
    });

    describe('types.byName', function(){
        it('byName should find ' + h2O, inject(function() {
            var found = soilClassificationTypes.byName(h2O);

            expect(found.name).toEqual(h2O);
        }));
    });
});
