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
    .factory('googleAnalyticsImporter',
    function ($log, validations, googleAnalytics) {

        var googleAnalyticsImporter = {}, api = 'farmbuild-dairy-nutrient-calculator',
            _isDefined = validations.isDefined;

        googleAnalyticsImporter.track = function(clientName) {
            $log.info('googleAnalyticsImporter.track clientName: %s', clientName);
            googleAnalytics.track(api, clientName)
        }



        return googleAnalyticsImporter;

    });
