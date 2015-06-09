/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';

angular.module('farmbuild.soilSampleImporter')
    .factory('importFieldSelectionValidator', function ($log, validations) {
        var importFieldSelectionValidator = {};

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

        importFieldSelectionValidator.validatePaddockSelection = function(paddockSelection) {
            return true;
        }

        return importFieldSelectionValidator;
    });
