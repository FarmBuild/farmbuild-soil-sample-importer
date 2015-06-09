'use strict';

describe('farmbuild.soilSampleImporter module', function() {

    // instantiate service
    var $log;
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console)
    }));
    var importFieldTypes, h2O = 'pH H2O (Water)', collections;

    beforeEach(inject(function (_$log_, _importFieldTypes_, _collections_) {
        $log = _$log_;
        importFieldTypes = _importFieldTypes_;
        collections = _collections_;
    }));

    describe('importFieldTypes factory', function(){
        it('importFieldTypes should be defined', inject(function() {
            expect(importFieldTypes).toBeDefined();
        }));
    });

    describe('types.byName', function(){
        it('byName should find ' + h2O, inject(function() {
            var found = importFieldTypes.byName(h2O);
            expect(found.name).toEqual(h2O);
        }));
    });
});