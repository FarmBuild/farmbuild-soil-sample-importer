describe('farmbuild.soilSampleImporter module: importFieldSelectionValidator', function () {

    //access test data under data dir
    beforeEach(function () {
        fixture.setBase('examples/data')
    });

    var $log, importFieldSelectionValidator;

    // inject farmbuild.soilSampleImporter module
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console)
    }));

    afterEach(function() {
        fixture.cleanup();
    });

    // inject soilSampleImporter service
    beforeEach(inject(function (_$log_, _importFieldSelectionValidator_) {
        $log = _$log_,
            importFieldSelectionValidator = _importFieldSelectionValidator_;
    }));


    describe('importFieldSelectionValidator ', function(){
        it('importFieldSelectionValidator should be created', inject(function() {
            expect(importFieldSelectionValidator).toBeDefined();
        }));

    });

    describe('Valid paddock selection creation ', function(){
        it('importFieldSelectionValidator should be created', inject(function() {
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

    });

});
