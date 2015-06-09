'use strict';

describe('farmbuild.soilSampleImporter.paddockSelector module', function() {
    beforeEach(function() {
        fixture.setBase('examples/data')
    })

    // instantiate service
    var paddockSelector, farmdata,
        $log;

    beforeEach(module('farmbuild.farmdata', function($provide) {
        $provide.value('$log', console)
    }));
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console);
    }));

    beforeEach(inject(function (_$log_, _paddockSelector_) {
        $log = _$log_;
        paddockSelector = _paddockSelector_;
    }))

    afterEach(function() {
        fixture.cleanup();
    });

    describe('Paddock selector ', function(){
        it('paddock selection should be created', inject(function() {
            expect(paddockSelector).toBeDefined();
        }));

    });

    describe('Paddock selector dictionary selection', function(){
        var test = {};
        test.paddockRowDictionary=[];
        var paddock = {};
        paddock.name="Test P1";
        it('paddock selection should be added', inject(function() {
            paddockSelector.connectRow(test, paddock, 1);
            expect(test.paddockRowDictionary[paddock.name]).toBeDefined();
            expect(test.paddockRowDictionary[paddock.name].length).toEqual(1);
            paddockSelector.disconnectRow(test, paddock, 1);
            expect(test.paddockRowDictionary[paddock.name]).toBeDefined();
            expect(test.paddockRowDictionary[paddock.name].length).toEqual(0);
        }));

        it('paddock selection should be removed', inject(function() {
            paddockSelector.disconnectRow(test, paddock, 1);
            expect(test.paddockRowDictionary[paddock.name]).toBeDefined();
            expect(test.paddockRowDictionary[paddock.name].length).toEqual(0);
        }));

    });
    describe('Soil Classification selector dictionary selection', function(){
        var test = {};
        test.classificationColumnDictionary=[];
        test.selected=[];
        var classType = {};
        classType.name="H2O";
        it('classification selection should be added', inject(function() {
            paddockSelector.classifyColumn(test, classType, 1);
            expect(test.classificationColumnDictionary[classType.name]).toBeDefined();
            expect(test.classificationColumnDictionary[classType.name]).toEqual(1);
        }));
        it('classification selection should be removed', inject(function() {
            paddockSelector.declassifyColumn(test, classType);
            expect(test.classificationColumnDictionary[classType.name]).toBeUndefined();
        }));

    });


});