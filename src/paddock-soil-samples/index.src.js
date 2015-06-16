/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';


angular.module('farmbuild.soilSampleImporter')
  .factory('paddockSoilSampleRetriever', function ($log, validations,importField) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      paddockSoilSampleRetriever = {};

    /**
     * Get all soil sampleResults for a given paddock name from the FarmData
     * @method soilSamplesInPaddock
     * @param FarmData
     * @param paddockName
     * @returns soil sampleResults array
     */
    paddockSoilSampleRetriever.soilSamplesInPaddock = function(farmData, paddockName){

      if (!_isDefined(farmData)) {
        $log.error('FarmData for soilSamplesInPaddock is invalid');
        return undefined;
      }

      var paddock = farmData.paddocks;
      $log.info('soilSamplesInPaddock main  '+paddock.length+' zzzzzz paddock '+JSON.stringify(paddock,null,"  "));
      var singlePaddock,  paddockSoil;
      for(var i=0;i<paddock.length;i++){
        singlePaddock = paddock[i];
        $log.info('singlePaddock name '+singlePaddock.name);
        if(singlePaddock.name == paddockName){
          paddockSoil = singlePaddock.soils;
          return paddockSoil.sampleResults;
        }
      }

      $log.info('paddockSoil '+paddockSoil);
      if(!_isDefined(paddockSoil) || !_isDefined(paddockSoil.sampleResults)){
        return undefined;
      }
//      $log.info('paddockSoil after '+paddockSoil.sampleResults[0]);
//      var singlesamples = paddockSoil.sampleResults[0];
//      $log.info('singlesamples '+singlesamples['Sample Id']);
//      return paddockSoil.sampleResults;

    }

    /**
     *
     * @method averagesForSoilSamples
     * @param importFieldNames
     * @param soilSamples
     * @returns {*}
     */
    paddockSoilSampleRetriever.averagesForSoilSamples = function(importFieldNames, soilSamples){
      if (!_isDefined(importFieldNames) || !(importFieldNames.length>0)) {
        return undefined;
      }
      if (!_isDefined(soilSamples) || !(soilSamples.length>0)) {
        return undefined;
      }

      /*
       * data structure of columnValues {
       *  "ph":{ sum: , count}
       *  "pb":{ sum: , count}
       * }
       * */
      var columnValues = {};
      for(var i=0;i<soilSamples.length;i++){
        var singelSoilSample = soilSamples[i];
        $log.info('singelSoilSample '+JSON.stringify(singelSoilSample,null,"  "));
        $log.info('importFieldNames '+JSON.stringify(importFieldNames,null,"  "));

        for(var j=0;j<importFieldNames.length;j++){

          var fieldValue = singelSoilSample[importFieldNames[j]];

          if(_isEmpty(fieldValue ) || (isNaN(fieldValue)) || (fieldValue==null)){
            continue;
          }


          var singleColumn = columnValues[importFieldNames[j]];
          if(!_isDefined(singleColumn)){
            singleColumn = {"sum": 0 , "count":0};
          }
          if(!importField.hasAverage(importFieldNames[j])){
            singleColumn = null
          }else{
            singleColumn.sum=singleColumn.sum+fieldValue;
            singleColumn.count=singleColumn.count+1;
          }

          columnValues[importFieldNames[j]]=singleColumn;

        }
      }
      var averageValues = {};
      for(var j=0;j<importFieldNames.length;j++){
        var singleColumn = columnValues[importFieldNames[j]];
        if(!_isDefined(singleColumn)){
          continue;
        }
        if(singleColumn==null){
          averageValues[importFieldNames[j]]=null;

        }else{
          averageValues[importFieldNames[j]]=singleColumn.sum/singleColumn.count;
        }
      }

      return averageValues;

    }


    paddockSoilSampleRetriever.averagesForPaddock = function(farmData, paddockName){
      $log.info("averagesForPaddock");
      var soilSamples = paddockSoilSampleRetriever.soilSamplesInPaddock(farmData, paddockName);
      $log.info("soilSamples "+soilSamples);
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
      $log.info("b4 ret");
      return paddockSoilSampleRetriever.averagesForSoilSamples(importFields,soilSamples);
    }

    return paddockSoilSampleRetriever;
  });
