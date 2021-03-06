'use strict';

describe('farmbuild.soilSampleImporter.soilClassification module', function() {
    beforeEach(function() {
        fixture.setBase('src/unit-test-data')
    })

    // instantiate service
    var soilClassification, soilClassificationTypes, validations,
        $log,
        h2O = 'pH H2O (Water)',
        colWellPhosphor = "Colwell Phosphorus (mg/kg)";

    beforeEach(module('farmbuild.farmdata', function($provide) {
        $provide.value('$log', console)
    }));
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console);
    }));

    beforeEach(inject(function (_$log_, _soilClassification_, _soilClassificationTypes_,
                                _validations_
                                ) {
        $log = _$log_;
        soilClassificationTypes = _soilClassificationTypes_;
        soilClassification = _soilClassification_;
        validations = _validations_;
    }))

    afterEach(function() {
        fixture.cleanup();
    });

    describe('soilClassification ', function(){
        it('soilClassification should be created', inject(function() {
            expect(soilClassification).toBeDefined();
        }));

    });

    describe('soilClassification H2O', function(){
        it('H2O classification should be correct', inject(function() {
            var found = soilClassificationTypes.byName(h2O);

            expect(found.name).toEqual(h2O);
            expect(soilClassification.findRange(found, 0).name).toEqual("Very Acidic");
            expect(soilClassification.findRange(found, 5.2).name).toEqual("Very Acidic");
            expect(soilClassification.findRange(found, 5.5).name).toEqual("Acidic");
            expect(soilClassification.findRange(found, 6).name).toEqual("Slightly Acidic");
            expect(soilClassification.findRange(found, 10).name).toEqual("Neutral");
        }));

    });

    describe('soilClassification Colwell Phosphorus', function(){
        it('Colwell Phosphorus classification should be correct', inject(function() {
            var found = soilClassificationTypes.byName(colWellPhosphor);

            expect(found.name).toEqual(colWellPhosphor);
            expect(soilClassification.findRangeWithDependency(found, 0, 15).name).toEqual("Deficient");
            expect(soilClassification.findRangeWithDependency(found, 16, 15).name).toEqual("Marginal");
            expect(soilClassification.findRangeWithDependency(found, 16, 16).name).toEqual("Deficient");
        }));

    });

});
