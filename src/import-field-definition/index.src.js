/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */

'use strict';
/**
 * soilSampleImporter/importField
 * @module soilSampleImporter/importField
 */
angular.module('farmbuild.soilSampleImporter')
    .factory('importField',
    function ($log, importFieldTypes, validations) {
        $log.info("importField ");
        var importField = {};

      /**
       * Returns true if the given import field has a soilClassificationName value to it.
       * This soilClassificationName value should be present in soil-classification>>default.conf.src.js file and
       * be associated with the Key in the import-field-definition>>default.conf.src.js file
       * Refer following files for the associated defaults
       * <a href="https://raw.githubusercontent.com/FarmBuild/farmbuild-soil-sample-importer/master/src/import-field-definition/defaults.conf.src.js">
       *  import-field-definition>>default.conf.src.js</a>
       * <a href="https://raw.githubusercontent.com/FarmBuild/farmbuild-soil-sample-importer/master/src/soil-classification/defaults.conf.src.js">
       *   soil-classification>>default.conf.src.js</a>
       * @method hasClassification
       * @param {string} importFieldName String name of the import field
       * @returns {boolean} true a soilClassification String value is present in the import field definition
       */
        importField.hasClassification = function (importFieldName) {
            var fieldType = importFieldTypes.byName(importFieldName);
            if (fieldType && fieldType.soilClassificationName) {
                return true;
            }
            return false;
        };

      /**
       * Returns true if it is possible to average the soil samples across a paddock for the given import field.
       * Refer following files for the associated defaults
       * <a href="https://raw.githubusercontent.com/FarmBuild/farmbuild-soil-sample-importer/master/src/import-field-definition/defaults.conf.src.js">
       *  import-field-definition>>default.conf.src.js</a>
       * <a href="https://raw.githubusercontent.com/FarmBuild/farmbuild-soil-sample-importer/master/src/soil-classification/defaults.conf.src.js">
       *   soil-classification>>default.conf.src.js</a>
       * @method hasAverage
       * @param  {string} importFieldName String name of the import field as defined in the defaults file
       * @returns {boolean}
       */
        importField.hasAverage = function (importFieldName) {
            var fieldType = importFieldTypes.byName(importFieldName);
            if (fieldType && fieldType.hasAverage) {
                return true;
            }
            return false;
        };

      /**
       * Get all the import field names available for all paddock groups
       * @method getPaddockGroupFields
       * @returns  (Array.<string[]>>)  Array String array containg the import field names
       */
        importField.getPaddockGroupFields = function() {
            var result = [];
            var allImportFields = importFieldTypes.toArray();
            for(var i=0; i<allImportFields.length; i++) {
                if (allImportFields[i].hasAverage) {
                    result.push(allImportFields[i]);
                }
            }
            return result;
        }

        return importField;
    });
