/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */

'use strict';

/**
 * soilSampleImporter
 * @module soilSampleImporter
 */
angular.module('farmbuild.soilSampleImporter', ['farmbuild.core','farmbuild.farmdata'])
	.factory('soilSampleImporter',
  function (soilSampleImporterSession,
            farmdata,
            validations,
            googleAnalyticsImporter,
            $log) {
		var soilSampleImporter = {
        farmdata:farmdata
      },
			_isPositiveNumber = validations.isPositiveNumber,
			_isDefined = validations.isDefined;

    soilSampleImporter.version = '0.1.0';
    soilSampleImporter.ga = googleAnalyticsImporter;
    soilSampleImporter.session = soilSampleImporterSession;

		$log.info('Welcome to Soil Sample Importer... ' +
      'this should only be initialised once! why we see twice in the example?');
    function createDefault() {
      $log.info('soil-sample-importer>>>>createDefault');
      return {
          dateLastUpdated :'',
          types:[]

      };
     }


    /**
     * Finds the farmData from the session.
     * @method find
     * @returns {object} the farmData stored in session, undefined if the farmData is found in session
     * @public
     * @static
     */
    soilSampleImporter.find = function () {
      return soilSampleImporterSession.find();
    }

		/**
		 * Loads the farmData into the session.
     * If the farmData has no soilSampleImporter section, then append one
		 * @method load
		 * @param {!object} farmData -
		 * @returns {object} the farmData stored in session, undefined if the farmData is invalid
		 * @public
		 * @static
		 */
		soilSampleImporter.load = function (farmData) {
      var loaded = farmdata.load(farmData);
      $log.info('soil-sample-importer>>>>load>>after farmdata.load');
			if (!_isDefined(loaded)) {
				return undefined;
			}

      $log.info('soil-sample-importer>>>>load>>check soils');

      if(!loaded.hasOwnProperty('soils')){
        $log.info('soil-sample-importer>>>>load>>no property soils');
        loaded.soils = {soils:{}};
      }
      if(!loaded.soils.hasOwnProperty('soilSamples')){
          $log.info('soil-sample-importer>>>>load>>no property paddocks');
          loaded.soils.soilSamples = createDefault();
          loaded = farmdata.update(loaded);

      }
      $log.info('soil-sample-importer>>>>load>'+loaded);
			return loaded;
		};


      soilSampleImporter.export = soilSampleImporterSession.export;

		if (typeof window.farmbuild === 'undefined') {
			window.farmbuild = {
				nutrientcalculator: soilSampleImporter
			};
		} else {
			window.farmbuild.nutrientcalculator = soilSampleImporter;
		}

		return soilSampleImporter;
	});