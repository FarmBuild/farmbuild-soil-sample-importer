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

});