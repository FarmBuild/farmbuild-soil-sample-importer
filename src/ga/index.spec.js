/**
 * Created by gota on 12/05/15.
 */
'use strict';

describe('farmbuild.soilSampleImporter module', function() {

    // instantiate service
    var googleAnalyticsImporter, $log;

    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console);
    }));

    beforeEach(module('farmbuild.soilSampleImporter'));

    beforeEach(inject(function (_googleAnalyticsImporter_,_$log_) {
        googleAnalyticsImporter = _googleAnalyticsImporter_;
        $log = _$log_;
    }));

    describe('Track the calculate ', function(){
        it('googleAnalyticsImporter should be defined', inject(function() {
            expect(googleAnalyticsImporter).toBeDefined();
        }));

        it('googleAnalyticsImporter.track should create a track', inject(function() {
            googleAnalyticsImporter.trackCalculate('AgSmart')
        }));
    });



});
