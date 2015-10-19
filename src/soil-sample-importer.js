/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */

'use strict';

/**
 * soilSampleImporter
 * @module soilSampleImporter
 */
angular.module('farmbuild.soilSampleImporter', ['farmbuild.core', 'farmbuild.farmdata'])
    .factory('soilSampleImporter',
    function (soilSampleImporterSession,
              soilSampleConverter,
              importField,
              soilSampleValidator,
              soilClassification,
              paddockSoilSampleRetriever,
              paddockGroups,
              importFieldSelector,
              farmdata,
              validations,
              googleAnalyticsSoilSampleImporter,
              $log) {
        var soilSampleImporter = {
                farmdata: farmdata
            },
            _isPositiveNumber = validations.isPositiveNumber,
            _isDefined = validations.isDefined;

        soilSampleImporter.version = '0.1.0';
        soilSampleImporter.ga = googleAnalyticsSoilSampleImporter;
        soilSampleImporter.session = soilSampleImporterSession;

        $log.info('Welcome to Soil Sample Importer... ' +
        'this should only be initialised once! why we see twice in the example?');

        /**
         * Finds the farmData from the session.
         * @method find
         * @returns {object} the FarmData stored in session, undefined if the FarmData is not found in session
         * @public
         * @static
         */
        soilSampleImporter.find = function () {
            return soilSampleImporterSession.find();
        };

        /**
         * Loads the farmData into the session.
         * If the farmData has no soilSampleImporter section, then will append one
         * @method load
         * @param {object} FarmData -
         * @returns {object} the FarmData stored in session, undefined if the FarmData is invalid
         * @public
         * @static
         */
        soilSampleImporter.load = function (inputFarmData) {
            var loaded = farmdata.load(inputFarmData);
            $log.info('loaded ' + JSON.stringify(loaded, null, "  "));
            if (!_isDefined(loaded)) {
                return undefined;
            }


            if (!loaded.hasOwnProperty('soils')) {
                loaded.soils = {};
            }
            if (!loaded.soils.hasOwnProperty('sampleResults')) {
                loaded.soils.sampleResults = soilSampleImporter.soilSampleConverter.createDefault();
                loaded = farmdata.update(loaded);

            }
            return loaded;
        };

      /**
       * Saves and exports the farmData.json with a file name: farmdata-NAME_OF_FILE-yyyyMMddHHmmss.json
       * It creates an element with 'download' attribute, the data is attached to href
       * and invoke click() function so the user gets the file save dialogue or something equivalent.
       * @method export
       * @param {object} document
       * @param {object} FarmData
       */
        soilSampleImporter.export = soilSampleImporterSession.export;


        soilSampleImporter.soilSampleConverter = soilSampleConverter;
        soilSampleImporter.soilSampleValidator = soilSampleValidator;
        soilSampleImporter.soilClassification = soilClassification;
        soilSampleImporter.importField = importField;
        soilSampleImporter.importFieldSelector = importFieldSelector;
        soilSampleImporter.paddockSoilSampleRetriever = paddockSoilSampleRetriever;
        soilSampleImporter.paddockGroups = paddockGroups;


        if (typeof window.farmbuild === 'undefined') {
            window.farmbuild = {
                soilSampleImporter: soilSampleImporter
            };
        } else {
            window.farmbuild.soilSampleImporter = soilSampleImporter;
        }

        return soilSampleImporter;
    });