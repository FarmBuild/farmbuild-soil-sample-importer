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


        function _isWithinRange(min, max, classificationValue) {
            //$log.info("range : "+ JSON.stringify(classificationRange));
            if (!(_isDefined(min)) && _isDefined(max) ) {
                return (classificationValue <= max);
            }
            else if (_isDefined(min) && _isDefined(max)) {
                return ((min < classificationValue) && (classificationValue <= max));
            }
            else if (_isDefined(min) && !(_isDefined(max))) {
                return (min < classificationValue);
            }
            return false;
        }

        function _findRangeIndex(minArray, maxArray, classificationValue) {
            for(var i=0 ; i<minArray.length; i++) {
                if (_isWithinRange(minArray[i], maxArray[i], classificationValue)) {
                    return i;
                }
            }
            return -1;
        }

        function _copyResult (classificationRange, index) {
            if (index>=0 && index < classificationRange.name.length) {
                var result = {};
                result.name = classificationRange.name[index];
                result.defaultColor = classificationRange.defaultColor[index];
                return result;
            }
            return undefined;
        }

        function _isValidType(anObject) {
            try {
                if (_isDefined(anObject) && _isDefined(anObject.name) && _isDefined(anObject.ranges)) {
                    return true;
                }
            }
            catch(err) {

            }
            return false;
        }

        /**
         * Find the range for a given classification type and value
         *
         * @param classificationType
         * @param classificationValue
         */
        soilClassification.findRange = function (classificationType, classificationValue) {
            
            if (!_isValidType(classificationType)) {
                return undefined;
            }

            for (var i=0; i<classificationType.ranges.length; i++) {
                var aRange = classificationType.ranges[i];

                var index = _findRangeIndex(aRange.min, aRange.max, classificationValue);
                if (index>=0) {

                    return _copyResult(aRange, index);
                }
            }
            return undefined;
        }

        /**
         * Find the range for a given classification type, value, and type dependency value
         *
         * @param classificationType
         * @param classificationValue
         * @param dependencyValue
         * @returns {*}
         */
        soilClassification.findRangeWithDependency = function (classificationType, classificationValue,
                                                 dependencyValue) {

            if (!_isValidType(classificationType)) {
                return undefined;
            }

            for (var i=0; i<classificationType.ranges.length; i++) {
                var aRange = classificationType.ranges[i];
                if (_findRangeIndex(aRange.dependencyRange.min, aRange.dependencyRange.max, dependencyValue) >= 0) {

                    var index = _findRangeIndex(aRange.min, aRange.max, classificationValue);
                    if (index>=0) {
                        return _copyResult(aRange, index);
                    }
                    return undefined;
                }
            }
            return undefined;
        }

        soilClassification.classifyResult = function (sampleResult, key) {

            var type = soilClassificationTypes.byName(key);

            if (!type) {
                return undefined;
            }

            if (type.dependencyRange) {
                return soilClassification.findRangeWithDependency(type, sampleResult[key],
                    sampleResult[type.dependencyRange.name]);
            }
            else {
                return soilClassification.findRange(type, sampleResult[key]);
            }
        }

        return soilClassification;
    });
