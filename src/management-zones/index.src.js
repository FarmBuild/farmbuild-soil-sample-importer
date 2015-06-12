/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';


angular.module('farmbuild.soilSampleImporter')
  .factory('mangementZones', function ($log, farmdata, validations, mangementZoneValidator, paddockSoilSampleRetriever) {

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


    var averageForManagementZone = function(farmData, managementZoneName){
      $log.info("averageForManagementZone");
      var zonePaddocks =  mangementZones.paddocksInManagementZone(farmData, managementZoneName);
      if(!_isDefined(zonePaddocks) || !(zonePaddocks.length>0)){
        return undefined;
      }
      $log.info(" zonePaddocks "+zonePaddocks);
      var allPaddockSoils = [];
      for(var i=0;i<zonePaddocks.length;i++){
        var soilsSamples = paddockSoilSampleRetriever.soilSamplesInPaddock(farmData,zonePaddocks[i]);

        if(!_isDefined(soilsSamples)){
          continue;
        }
        $log.info('soils samples for ' +zonePaddocks[i] +' is below \n'+soilsSamples);
        allPaddockSoils = allPaddockSoils.concat(soilsSamples);
        $log.info('paddocks in zony '+allPaddockSoils);
      }



      var soils= farmData.soils;
      if(!_isDefined(soils)){
        return undefined;
      }
      var sampleResults=soils.sampleResults;
      if(!_isDefined(sampleResults)){
        return undefined;
      }
      var importFields =sampleResults.importFieldNames;
      if(!_isDefined(importFields)){
        return undefined;
      }

      var averageZone = paddockSoilSampleRetriever.averagesForSoilSamples(importFields,allPaddockSoils);
      $log.info('allPaddockSoils '+ +JSON.stringify(averageZone,null,"  "));
      return averageZone;
    }
    mangementZones.averageForManagementZone=averageForManagementZone;

    return mangementZones;
  });