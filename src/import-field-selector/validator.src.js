/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */
'use strict';

/**
 * soilSampleImporter/importFieldSelectionValidator
 * @module soilSampleImporter/importFieldSelectionValidator
 */
angular.module('farmbuild.soilSampleImporter')
    .factory('importFieldSelectionValidator', function ($log, validations, importFieldTypes) {
        var importFieldSelectionValidator = {};

        function _isEmptyObject(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        }

        /**
         * Check if the csv data is acceptable for the soil sample import process
         * @param columnHeaders
         * @param rows
         * @returns {boolean}
         * @private
         */
        importFieldSelectionValidator.validateCreateNew = function(columnHeaders, rows) {
            if (!validations.isDefined(columnHeaders) || columnHeaders.length == 0) {
                $log.error("Soil import column headers must be a valid array");
                return false;
            }
            if (!validations.isDefined(rows) || rows.length == 0) {
                $log.error("Soil import data row must be a valid array");
                return false;
            }

            for(var i=0; i < rows.length; i++) {
                var aRow = rows[i];
                if (aRow.length != columnHeaders.length) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Check that the soil sample import process is ready to export to farm data
         * @param importFieldsSelection
         * @returns {boolean}
         */
        importFieldSelectionValidator.validateImportFieldsDefinition = function(importFieldsSelection) {

            //Ensure at least 1 paddock is associated to a csv row.
            if (validations.isEmpty(importFieldsSelection.paddockRowDictionary) ||
                    _isEmptyObject(importFieldsSelection.paddockRowDictionary)) {
                return false;
            }

            $log.info('importFieldTypes ', JSON.stringify(importFieldTypes.toArray()));
            if (importFieldTypes.toArray().length != Object.keys(importFieldsSelection.importFieldDictionary).length) {
                return false;
            }

            return true;
        }

        return importFieldSelectionValidator;
    });
