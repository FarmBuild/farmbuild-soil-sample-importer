/**
 * Created by gota on 12/05/15.
 */
'use strict';

describe('farmbuild.soilSampleImporter module', function() {

    // instantiate service
    var googleAnalyticsSoilSampleImporter, $log;

    beforeEach(module('farmbuild.soilSampleImporter', function($provide) {
        $provide.value('$log', console);
    }));

    beforeEach(module('farmbuild.soilSampleImporter'));

    beforeEach(inject(function (_googleAnalyticsSoilSampleImporter_,_$log_) {
      googleAnalyticsSoilSampleImporter = _googleAnalyticsSoilSampleImporter_;
        $log = _$log_;
    }));

    describe('Track the soil sample import ', function(){
        it('googleAnalyticsImporter should be defined', inject(function() {
            expect(googleAnalyticsSoilSampleImporter).toBeDefined();
        }));

        it('googleAnalyticsImporter.track should create a track', inject(function() {
          googleAnalyticsSoilSampleImporter.trackSoilSampleImporter('AgSmart')
        }));
    });



});
