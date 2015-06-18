/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */

'use strict';

/**
 * soilSampleImporter/googleAnalyticsImporter singleton
 * @private-module soilSampleImporter/googleAnalyticsImporter
 */
angular.module('farmbuild.soilSampleImporter')
  .factory('googleAnalyticsSoilSampleImporter',
  function ($log, validations, googleAnalytics) {

    var googleAnalyticsSoilSampleImporter = {},
      api = 'farmbuild-soil-sample-importer',
      _isDefined = validations.isDefined;

    /**
     * Sends API usage statistics to Google analytics
     * @param clientName
     * @public
     * @static
     */
    googleAnalyticsSoilSampleImporter.trackSoilSampleImporter = function(clientName) {
      if (!_isDefined(clientName)) {
        $log.error('client name is not specified');
        return;
      }
      $log.info('googleAnalyticsImporter.track clientName: %s', clientName);
      googleAnalytics.track(api, clientName)
    }



    return googleAnalyticsSoilSampleImporter;

  });
