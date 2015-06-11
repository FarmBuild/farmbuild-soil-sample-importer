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
            soilSampleConverter,
            soilSampleValidator,
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
		soilSampleImporter.load = function (inputFarmData) {
      var loaded = farmdata.load(inputFarmData);
      $log.info('loaded '+JSON.stringify(loaded,null,"  "));
			if (!_isDefined(loaded)) {
				return undefined;
			}


      if(!loaded.hasOwnProperty('soils')){
        loaded.soils = {};
      }
      if(!loaded.soils.hasOwnProperty('sampleResults')){
          loaded.soils.sampleResults =  soilSampleImporter.createDefault();
          loaded = farmdata.update(loaded);

      }
			return loaded;
		};


    soilSampleImporter.export = soilSampleImporterSession.export;
//    soilSampleImporter.toSoilSampleResult = soilSampleConverter.toSoilSampleResults;
    soilSampleImporter.toFarmData = soilSampleConverter.toFarmData;
    soilSampleImporter.createDefault = soilSampleConverter.createDefault;
    soilSampleImporter.isValidFarmDataWithSoilSample = soilSampleValidator.isValidFarmDataWithSoilSample;


		if (typeof window.farmbuild === 'undefined') {
			window.farmbuild = {
        soilSampleImporter: soilSampleImporter
			};
		} else {
			window.farmbuild.soilSampleImporter = soilSampleImporter;
		}

		return soilSampleImporter;
	});