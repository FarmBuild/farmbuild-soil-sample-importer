/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';


angular.module('farmbuild.soilSampleImporter')
  .factory('mangementZoneValidator', function ($log, farmdata, validations) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      mangementZoneValidator = {};


    mangementZoneValidator.farmDataHasManagementZones = function(farmData){
      if (!_isDefined(farmData)) {
        return false;
      }
      if (!_isDefined(farmData.managementZones)) {
        return false;
      }
      var managementZones = farmData.managementZones;
      $log.info('managementZones length '+managementZones.length);
      if (!(managementZones.length>0)) {
        return false;
      }

      return true;
    }

    return mangementZoneValidator;
  });