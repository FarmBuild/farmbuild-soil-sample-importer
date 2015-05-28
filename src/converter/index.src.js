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
        results:{
          columnHeaders :[],
          rows:[]
        },
        classifications :{},
        selected :[],

        paddocks : 	[],
        paddockNameColumn: undefined

      };

    }

      var soils =farmData.soils;
      var sampleResults = soils.sampleResults;

      var updatedDate =  sampleResults.dateLastUpdated;
      if (!_isDefined(updatedDate)) {
        updatedDate = new Date();
      }

      var columnHeaders = sampleResults.columnHeaders;
      $log.info('soilSampleConverter.toSoilSampleResults>>columnHeaders '+columnHeaders);

      var classifications={};
      if(_isDefined(sampleResults.classifications)){
        classifications = sampleResults.classifications;
      };

      var paddockNameColumn=undefined;
      if(_isDefined(sampleResults.paddockNameColumn)){
        paddockNameColumn = sampleResults.paddockNameColumn;
      };

      var selectedColumns={};
      if(_isDefined(sampleResults.selected)){
        selectedColumns = sampleResults.selected;
      };

      var paddocks = farmData.paddocks;
      $log.info('soilSampleConverter.toSoilSampleResults>>paddocks '+paddocks);
      var rows =[], paddockRows={};
      var rowIndexCount=1;

      for(var i=0;i<paddocks.length;i++){

        var singlePaddock = paddocks[i];

        var paddickName = singlePaddock.name;
        $log.info('paddickName '+paddickName);
        if(!_isDefined(singlePaddock.soils)){ continue; };
        var singleSoil = singlePaddock.soils;

        if(!_isDefined(singleSoil.sampleResults)){ continue; };
        var singleSampleResult = singleSoil.sampleResults;
        $log.info('singleSampleResult '+singleSampleResult);

        var singlePaddockRow = [];
        $log.info('paddockRows[paddickName '+paddockRows[paddickName]);
        if(_isDefined(paddockRows[paddickName])){
          singlePaddockRow = paddockRows[paddickName];
        };



        for(var j=0;j<singleSampleResult.length;j++){
          rows.push(singleSampleResult[j]);
          singlePaddockRow.push(rowIndexCount++);

        };

        $log.info('rows '+rows);


        paddockRows[paddickName]=singlePaddockRow;
        $log.info('soilSampleConverter.toSoilSampleResults>>singlePaddockRow ',singlePaddockRow);


      }

      return{
        dateLastUpdated: new Date(),
        results:{
          columnHeaders :columnHeaders,
          rows:rows
        },
        classifications :classifications,
        selected :selectedColumns,

        paddocks : 	paddockRows,
        paddockNameColumn: paddockNameColumn

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