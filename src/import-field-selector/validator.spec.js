describe('farmbuild.soilSampleImporter module: paddockSelectionValidator', function () {

    //access test data under data dir
    beforeEach(function () {
        fixture.setBase('examples/data')
    });

    var $log, paddockSelectionValidator;

    // inject farmbuild.soilSampleImporter module
    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console)
    }));

    afterEach(function() {
        fixture.cleanup();
    });

    // inject soilSampleImporter service
    beforeEach(inject(function (_$log_, _paddockSelectionValidator_) {
        $log = _$log_,
            paddockSelectionValidator = _paddockSelectionValidator_;
    }));


    describe('paddockSelectionValidator ', function(){
        it('paddockSelectionValidator should be created', inject(function() {
            expect(paddockSelectionValidator).toBeDefined();
        }));

    });

    describe('Valid paddock selection creation ', function(){
        it('paddockSelection should be created', inject(function() {
            var headers = [];
            var rows = [];
            expect(paddockSelectionValidator.validateCreateNew(headers, rows)).toBeFalsy();

            headers = ["Sample Id", "Sample Name", "pH", "Phosphor"];
            expect(paddockSelectionValidator.validateCreateNew(headers, rows)).toBeFalsy();

            rows = [
                ["123"]
            ];

            expect(paddockSelectionValidator.validateCreateNew(headers, rows)).toBeFalsy();

            rows = [
                ["123", "Test sample", "3.4", "6.4"]
            ];

            expect(paddockSelectionValidator.validateCreateNew(headers, rows)).toBeTruthy();
        }));

    });

});
