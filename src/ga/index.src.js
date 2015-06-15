/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */

'use strict';

/**
 * soilSampleImporter/googleAnalyticsImporter singleton
 * @private-module soilSampleImporter/googleAnalyticsImporter
 */
angular.module('farmbuild.soilSampleImporter')
    .factory('googleAnalyticsSoilSampleImporter',
    function ($log, validations, googleAnalytics) {

        var googleAnalyticsSoilSampleImporter = {}, api = 'farmbuild-soil-sample-importer',
            _isDefined = validations.isDefined;

      googleAnalyticsSoilSampleImporter.trackSoilSampleImporter = function(clientName) {
            $log.info('googleAnalyticsImporter.track clientName: %s', clientName);
            googleAnalytics.track(api, clientName)
        }



        return googleAnalyticsSoilSampleImporter;

    });
