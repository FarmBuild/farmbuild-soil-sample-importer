/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';


angular.module('farmbuild.soilSampleImporter')
  .factory('mangementZones', function ($log, farmdata, validations, mangementZoneValidator) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      mangementZones = {};

    var paddocksInManagementZone = function(farmData, managementZoneName){
      var paddockList = [];

      if(!mangementZoneValidator.farmDataHasManagementZones(farmData)){
        return undefined;
      }

      var managementZones = farmData.managementZones;

      for(var i=0;i<managementZones.length;i++){
          var singleZone = managementZones[i];
           if(singleZone.name == managementZoneName){
             paddockList = singleZone.paddocks;
             break;
           }

      }
      $log.info('paddockList '+paddockList);
      return paddockList;
    }

    mangementZones.paddocksInManagementZone = paddocksInManagementZone ;

    return mangementZones;
  });