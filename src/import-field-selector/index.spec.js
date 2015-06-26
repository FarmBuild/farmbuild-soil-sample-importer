'use strict';

describe('farmbuild.soilSampleImporter.paddockSelector module', function() {
    beforeEach(function() {
        fixture.setBase('src/unit-test-data')
    })

    // instantiate service
    var importFieldSelector, farmdata,
        $log;

    beforeEach(module('farmbuild.farmdata', function($provide) {
        $provide.value('$log', console)
    }));
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console);
    }));

    beforeEach(inject(function (_$log_, _importFieldSelector_) {
        $log = _$log_;
        importFieldSelector = _importFieldSelector_;
    }))

    afterEach(function() {
        fixture.cleanup();
    });

    describe('Paddock selector ', function(){
        it('paddock selection should be created', inject(function() {
            expect(importFieldSelector).toBeDefined();
        }));

    });

    describe('Paddock selector dictionary selection', function(){
        var test = {};
        test.paddockRowDictionary=[];
        var paddock = {};
        paddock.name="Test P1";
        it('paddock selection should be added', inject(function() {
            importFieldSelector.connectRow(test, paddock, 1);
            expect(test.paddockRowDictionary[paddock.name]).toBeDefined();
            expect(test.paddockRowDictionary[paddock.name].length).toEqual(1);
            importFieldSelector.disconnectRow(test, paddock, 1);
            expect(test.paddockRowDictionary[paddock.name]).toBeDefined();
            expect(test.paddockRowDictionary[paddock.name].length).toEqual(0);
        }));

        it('paddock selection should be removed', inject(function() {
            importFieldSelector.disconnectRow(test, paddock, 1);
            expect(test.paddockRowDictionary[paddock.name]).toBeDefined();
            expect(test.paddockRowDictionary[paddock.name].length).toEqual(0);
        }));

    });
    describe('Soil Classification selector dictionary selection', function(){
        var test = {};
        test.importFieldDictionary=[];
        test.selected=[];
        var classType = {};
        classType.name="H2O";
        it('classification selection should be added', inject(function() {
            importFieldSelector.classifyColumn(test, classType, 1);
            expect(test.importFieldDictionary[classType.name]).toBeDefined();
            expect(test.importFieldDictionary[classType.name]).toEqual(1);
        }));
        it('classification selection should be removed', inject(function() {
            importFieldSelector.declassifyColumn(test, classType);
            expect(test.importFieldDictionary[classType.name]).toBeUndefined();
        }));

    });

    describe('Import auto linking', function(){
        var testFarmData = {};
        testFarmData.paddocks = [
            {"name": "Test P1"},
            {"name": "Test P2"},
        ];

        var headers = ["P Name 1", "P Name 2"];
        var rows = [
            ["Test P1", "Bla"],
            ["Bla", "Test P2"],
            ["Blurb", "Test P2"]
        ];

        it('test auto link', inject(function() {

            var result = importFieldSelector.createNew(testFarmData, headers, rows, 0);

            //$log.info("Result "+JSON.stringify(result));

            expect(importFieldSelector.autoLinkPaddock(result, 1)).toEqual(1);
            //$log.info("Result1 "+JSON.stringify(result));
            expect(result.paddockRowDictionary["Test P1"].length).toEqual(1);

            expect(importFieldSelector.autoLinkPaddock(result, 2)).toEqual(2);
            expect(result.paddockRowDictionary["Test P2"].length).toEqual(2);
        }));


    });

});