/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */
'use strict';

/**
 * soilSampleImporter/paddockGoupValidator
 * @module soilSampleImporter/paddockGoupValidator
 */
angular.module('farmbuild.soilSampleImporter')
  .factory('paddockGoupValidator', function ($log, farmdata, validations) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      paddockGoupValidator = {};

    /**
     * Returns true if the given FarmData block has paddockGroups defined in it
     * @method farmDataHasPaddockGroups
     * @param {object} FarmData Valid FarmData object
     * @returns {boolean} will return false if the given FarmData is of invalid structure
     */
    paddockGoupValidator.farmDataHasPaddockGroups = function(farmData){
      if (!_isDefined(farmData)) {
        return false;
      }
      if (!_isDefined(farmData.paddockGroups)) {
        return false;
      }
      var paddockGoups = farmData.paddockGroups;
      $log.info('paddockGroups length '+paddockGoups.length);
      if (!(paddockGoups.length>0)) {
        return false;
      }

      return true;
    }

    return paddockGoupValidator;
  });