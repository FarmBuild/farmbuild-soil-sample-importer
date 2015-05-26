/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';

angular.module('farmbuild.soilSampleImporter')
  .factory('soilSampleConverter', function ($log, farmdata, validations, soilSampleValidator, soilSampleImporterSession) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      soilSampleConverter = {};



    /**
     * Soil sample result from farmdata
     * @param farmData
     * @returns {*}
     */
    soilSampleConverter.toSoilSampleResults = function(farmData){

    if(!soilSampleValidator.isSoilSampleResultDefined(farmData)){
      $log.info('soilSampleValidator.isSoilSampleResultDefined');
      return{
        dateLastUpdated: new Date(),
        columns :[],
        paddockResults : 	[]
      };

    }

      var soils =farmData.soils;
      var soilSampleResults = soils.sampleResults;
      var updatedDate =  soilSampleResults.dateLastUpdated;
      if (!_isDefined(updatedDate)) {
        updatedDate = new Date();
      }

      var csvColumns = soilSampleResults.columns;
      $log.info('soilSampleConverter.toSoilSampleResults>>csvColumns '+csvColumns);

      var paddocks = farmData.paddocks;
      $log.info('soilSampleConverter.toSoilSampleResults>>paddocks '+paddocks);
      var paddockResult =[];

      for(var i=0;i<paddocks.length;i++){

        var singlePaddock = paddocks[i];

        var singleSampleResult ={};

        singleSampleResult.name = singlePaddock.name;
        singleSampleResult.results=[];

        if(_isDefined(singlePaddock.soils)){
            var paddickSoil=singlePaddock.soils;
             if(_isDefined(paddickSoil.sampleResults)){
                singleSampleResult.results = paddickSoil.sampleResults;
              }
        }

        paddockResult.push(singleSampleResult);

      }

      return {
        dateLastUpdated : new Date(),
        columns : csvColumns,
        paddockResults :paddockResult

      };

    };


    /**
     *
     * @param farmData with or without the soil sample results
     * @param sampleResults soil sample results soilSampleConverter.toSoilSampleResults output
     */
    soilSampleConverter.toFarmData = function(farmData , sampleResults){

    };

    return soilSampleConverter;
  });