/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */

'use strict';
angular.module('farmbuild.soilSampleImporter')
    .factory('importField',
    function ($log, importFieldTypes, validations) {
        $log.info("importField ");
        var importField = {};

        importField.hasClassification = function (importFieldName) {
            var fieldType = importFieldTypes.byName(importFieldName);
            if (fieldType && fieldType.soilClassificationName) {
                return true;
            }
            return false;
        };

        importField.hasAverage = function (importFieldName) {
            var fieldType = importFieldTypes.byName(importFieldName);
            if (fieldType && fieldType.hasAverage) {
                return true;
            }
            return false;
        };

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
