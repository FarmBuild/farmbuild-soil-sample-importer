/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @license The MIT License
 * @author State of Victoria
 * @version 0.1.0
 */
'use strict';

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

        importFieldSelectionValidator.validateImportFieldsDefinition = function(importFieldsDefinition) {

            //Ensure at least 1 paddock is associated to a csv row.
            if (validations.isEmpty(importFieldsDefinition.paddockRowDictionary) ||
                    _isEmptyObject(importFieldsDefinition.paddockRowDictionary)) {
                return false;
            }

            $log.info('importFieldTypes ', JSON.stringify(importFieldTypes.toArray()));
            if (importFieldTypes.toArray().length != Object.keys(importFieldsDefinition.importFieldDictionary).length) {
                return false;
            }

            return true;
        }

        return importFieldSelectionValidator;
    });
