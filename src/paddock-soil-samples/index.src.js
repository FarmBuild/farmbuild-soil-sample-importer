/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */
'use strict';
/**
 * soilSampleImporter/paddockSoilSampleRetriever
 * @module soilSampleImporter/paddockSoilSampleRetriever
 */
angular.module('farmbuild.soilSampleImporter')
  .factory('paddockSoilSampleRetriever', function ($log, validations,importField) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      paddockSoilSampleRetriever = {};

    /**
     * Get all soil sampleResults for a given paddock name from the FarmData
     * @method soilSamplesInPaddock
     * @param {object} FarmData valid FarmData object
     * @param {string} paddockName
     * @returns {array} soil sampleResults array
     * @public
     */
    paddockSoilSampleRetriever.soilSamplesInPaddock = function(farmData, paddockName){

      if (!_isDefined(farmData)) {
        $log.error('FarmData for soilSamplesInPaddock is invalid');
        return undefined;
      }

      var paddock = farmData.paddocks;
      $log.info('soilSamplesInPaddock main  '+paddock.length+'  paddock '+JSON.stringify(paddock,null,"  "));
      var singlePaddock,  paddockSoil;
      for(var i=0;i<paddock.length;i++){
        singlePaddock = paddock[i];
        if(singlePaddock.name == paddockName){
          paddockSoil = singlePaddock.soils;
          return paddockSoil.sampleResults;
        }
      }

      if(!_isDefined(paddockSoil) || !_isDefined(paddockSoil.sampleResults)){
        return undefined;
      }

    }

    /**
     * Average given soil sampleResult array values
     * @method averagesForSoilSamples
     * @param {array} importFieldNames Array of string values containing the field names which are to be imported
     * @param {array} soilSamples Object array containing values for each import field grouped by soil samples
     * @returns {array} Array of float values averaged over soil samples for each import field
     * @private
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


    /**
     * Get average sampleResult values for a given paddock name
     * @method averagesForPaddock
     * @param {object} FarmData FarmData object
     * @param {string} paddockName Name of the paddock which should be in the FarmData
     * @returns  {array} Array of float values averaged over soil samples for each import field for the given paddock
     * @public
     */
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
