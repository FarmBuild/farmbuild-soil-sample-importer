'use strict';

describe('farmbuild.soilSampleImporter.importField module', function() {
    beforeEach(function () {
        fixture.setBase('examples/data')
    });

    beforeEach(module('farmbuild.farmdata', function($provide) {
        $provide.value('$log', console)
    }));
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console);
    }));

    afterEach(function() {
        fixture.cleanup();
    });

    var $log,importField, importFieldTypes, validations;

    beforeEach(inject(function (_$log_, _importField_, _importFieldTypes_,
                                _validations_
    ) {
        $log = _$log_;
        importField = _importField_;
        importFieldTypes = _importFieldTypes_;
        validations = _validations_;
    }))

    describe('importField ', function(){
        it('importField should be created', inject(function() {
            expect(importField).toBeDefined();
        }));

    });

});
