/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @license The MIT License
 * @author State of Victoria
 * @version 0.1.0
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
       * Returns true if the given import field has a soilClassificationName value to it,
       * based on the {@link importFieldDefaults}
       * @method hasClassification
       * @param importFieldName
       * @returns {boolean}
       */
        importField.hasClassification = function (importFieldName) {
            var fieldType = importFieldTypes.byName(importFieldName);
            if (fieldType && fieldType.soilClassificationName) {
                return true;
            }
            return false;
        };

      /**
       * Returns true if its possible to average the given import field
       * @method hasAverage
       * @param importFieldName
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
       *
       * @method getPaddockGroupFields
       * @returns {Array}
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
