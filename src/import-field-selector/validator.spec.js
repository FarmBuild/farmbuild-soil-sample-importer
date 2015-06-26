describe('farmbuild.soilSampleImporter module: importFieldSelectionValidator', function () {

    //access test data under data dir
    beforeEach(function () {
        fixture.setBase('src/unit-test-data')
    });

    var $log, importFieldSelectionValidator, importFieldTypes;

    // inject farmbuild.soilSampleImporter module
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console)
    }));

    afterEach(function() {
        fixture.cleanup();
    });

    // inject soilSampleImporter service
    beforeEach(inject(function (_$log_, _importFieldSelectionValidator_, _importFieldTypes_) {
        $log = _$log_,
            importFieldSelectionValidator = _importFieldSelectionValidator_,
            importFieldTypes = _importFieldTypes_;
    }));


    describe('importFieldSelectionValidator ', function(){
        it('importFieldSelectionValidator should be created', inject(function() {
            expect(importFieldSelectionValidator).toBeDefined();
        }));

    });

    describe('Valid paddock selection creation ', function(){
        it('CSV data should be valid', inject(function() {
            var headers = [];
            var rows = [];
            expect(importFieldSelectionValidator.validateCreateNew(headers, rows)).toBeFalsy();

            headers = ["Sample Id", "Sample Name", "pH", "Phosphor"];
            expect(importFieldSelectionValidator.validateCreateNew(headers, rows)).toBeFalsy();

            rows = [
                ["123"]
            ];

            expect(importFieldSelectionValidator.validateCreateNew(headers, rows)).toBeFalsy();

            rows = [
                ["123", "Test sample", "3.4", "6.4"]
            ];

            expect(importFieldSelectionValidator.validateCreateNew(headers, rows)).toBeTruthy();
        }));

        it('Saving valid import field definition', inject(function() {
            var testImportFieldsDefinition = {};
            testImportFieldsDefinition.importFieldDictionary = {};
            var knownTypes = importFieldTypes.toArray();



            expect(importFieldSelectionValidator.validateImportFieldsDefinition(testImportFieldsDefinition)).toBeFalsy();

            testImportFieldsDefinition.paddockRowDictionary = {};
            expect(importFieldSelectionValidator.validateImportFieldsDefinition(testImportFieldsDefinition)).toBeFalsy();

            testImportFieldsDefinition.paddockRowDictionary = {
                "Paddock one": [0]
            };

            expect(importFieldSelectionValidator.validateImportFieldsDefinition(testImportFieldsDefinition)).toBeFalsy();


            for (var i=0; i<knownTypes.length; i++) {
                testImportFieldsDefinition.importFieldDictionary[knownTypes[i].name]= 0;
            }

            expect(importFieldSelectionValidator.validateImportFieldsDefinition(testImportFieldsDefinition)).toBeTruthy();
        }));

    });

});
