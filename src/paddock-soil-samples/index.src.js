/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';


angular.module('farmbuild.soilSampleImporter')
  .factory('paddockSoilSampleRetriever', function ($log, validations) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      paddockSoilSampleRetriever = {};


    var soilSamplesInPaddock = function(farmData, paddockName){


      if (!_isDefined(farmData)) {
        return undefined;
      }
      if (!_isDefined(farmData.managementZones)) {
        return undefined;
      }

      var paddock = farmData.paddocks;
      for(var i=0;i<paddock.length;i++){
        var singlePaddock = paddock[i];
        if(singlePaddock.name == paddockName){
          break;
        }
      }
      var paddockSoil = singlePaddock.soils;
      $log.info('paddockSoil '+paddockSoil);
      if(!_isDefined(paddockSoil) || !_isDefined(paddockSoil.sampleResults)){
        return undefined;
      }
      return paddockSoil.sampleResults;

    }
    paddockSoilSampleRetriever.soilSamplesInPaddock = soilSamplesInPaddock;

    return paddockSoilSampleRetriever;
  });
