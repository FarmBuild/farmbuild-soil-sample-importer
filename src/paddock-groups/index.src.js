/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */
'use strict';
/**
 * soilSampleImporter/paddockGroups
 * @module soilSampleImporter/paddockGroups
 */

angular.module('farmbuild.soilSampleImporter')
  .factory('paddockGroups', function ($log, farmdata, validations, paddockGoupValidator, paddockSoilSampleRetriever) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      paddockGroups = {};

    /**
     * Check paddockGroups block and get paddocks for the given paddockGroups name. Undefined if no paddocks found or if FarmData is undefined.
     * @method paddocksInPaddockGroup
     *  @param {!object} FarmData valid FarrmData object
     * @param {string} paddockGroupName name of the paddock group in the paddockGroups block in FarmData
     * @returns {array} Array of paddock names
     * @public
     */
    var paddocksInPaddockGroup = function(farmData, paddockGroupName){
      var paddockList = [];

      if(!paddockGoupValidator.farmDataHasPaddockGroups(farmData)){
        return undefined;
      }

      var paddockGroups = farmData.paddockGroups;

      for(var i=0;i<paddockGroups.length;i++){
          var singleGroup = paddockGroups[i];
           if(singleGroup.name == paddockGroupName){
             paddockList = singleGroup.paddocks;
             break;
           }

      }
      if(paddockList.length==0){return undefined;}
      return paddockList;
    }
    paddockGroups.paddocksInPaddockGroup = paddocksInPaddockGroup ;


    /**
     * Average over paddock soil sampleResults for the given paddock group name
     * @method averageForPaddockGroup
     * @param {!object} FarmData Valid FarrmData object
     * @param {!string} paddockGroupName Name of the paddock group in the paddockGroups block in FarmData
     * @returns {float} Average value of soil sampleResults over the given paddock group
     */
    var averageForPaddockGroup = function(farmData, paddockGroupName){
      var groupPaddocks =  paddockGroups.paddocksInPaddockGroup(farmData, paddockGroupName);
      if(!_isDefined(groupPaddocks) || !(groupPaddocks.length>0)){
        return undefined;
      }
      var allPaddockSoils = [];
      for(var i=0;i<groupPaddocks.length;i++){
        var soilsSamples = paddockSoilSampleRetriever.soilSamplesInPaddock(farmData,groupPaddocks[i]);

        if(!_isDefined(soilsSamples)){
          continue;
        }
        allPaddockSoils = allPaddockSoils.concat(soilsSamples);
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

      var averageGroup = paddockSoilSampleRetriever.averagesForSoilSamples(importFields,allPaddockSoils);
      $log.info('allPaddockSoils '+ +JSON.stringify(averageGroup,null,"  "));
      return averageGroup;
    }
    paddockGroups.averageForPaddockGroup=averageForPaddockGroup;

    return paddockGroups;
  });