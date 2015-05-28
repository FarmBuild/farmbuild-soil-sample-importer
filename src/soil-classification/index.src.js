/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */

'use strict';
angular.module('farmbuild.soilSampleImporter')
    .factory('soilClassification',
    function ($log, soilClassificationTypes, validations) {
        $log.info("soilClassification ");
        var soilClassification = {},
            _isDefined = validations.isDefined;

        function _isWithinRange(classificationRange, classificationValue) {
            $log.info("range : "+ JSON.stringify(classificationRange));
            if (!(_isDefined(classificationRange.min)) && _isDefined(classificationRange.max) ) {
                return (classificationValue <= classificationRange.max);
            }
            else if (_isDefined(classificationRange.min) && _isDefined(classificationRange.max)) {
                return ((classificationRange.min < classificationValue) && (classificationValue <= classificationRange.max));
            }
            else if (_isDefined(classificationRange.min) && !(_isDefined(classificationRange.max))) {
                return (classificationRange.min < classificationValue);
            }
            return false;
        }

        /**
         * Find the range for a given classification type and value
         * @param classificationType
         * @param classificationValue
         */
        soilClassification.findRange = function (classificationType, classificationValue) {
            //var foundType = classificationType;

            /*if (!foundType) {
                return undefined;
            }*/

            for (var i=0; i<classificationType.ranges.length; i++) {
                var aRange = classificationType.ranges[i];

                if (_isWithinRange(aRange, classificationValue)) {
                    return aRange;
                }
            }
            return undefined;
        }

        return soilClassification;
    });
