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


    paddockSoilSampleRetriever.soilSamplesInPaddock = function(farmData, paddockName){
      $log.info('paddockSoilSampleRetriever.soilSamplesInPaddock');

      if (!_isDefined(farmData)) {
        return undefined;
      }
      if (!_isDefined(farmData.managementZones)) {
        return undefined;
      }


      var paddock = farmData.paddocks;
      $log.info('soilSamplesInPaddock main  '+paddock.length);
      var singlePaddock,  paddockSoil;
      for(var i=0;i<paddock.length;i++){
        singlePaddock = paddock[i];
        $log.info('singlePaddock name '+singlePaddock.name);
        if(singlePaddock.name == paddockName){
          break;
        }
      }
      paddockSoil = singlePaddock.soils;
      $log.info('paddockSoil '+paddockSoil);
      if(!_isDefined(paddockSoil) || !_isDefined(paddockSoil.sampleResults)){
        return undefined;
      }
//      $log.info('paddockSoil after '+paddockSoil.sampleResults[0]);
//      var singlesamples = paddockSoil.sampleResults[0];
//      $log.info('singlesamples '+singlesamples['Sample Id']);
      return paddockSoil.sampleResults;

    }


    return paddockSoilSampleRetriever;
  });
