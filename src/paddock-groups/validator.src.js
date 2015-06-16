/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
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
     * @param FarmData
     * @returns {boolean}
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