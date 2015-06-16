/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';

angular.module('farmbuild.soilSampleImporter')
  .factory('soilSampleValidator', function ($log, farmdata, validations) {
    var soilSampleValidator={},
      _isDefined = validations.isDefined,
      _isArray = validations.isArray;

    /**
     * Validate if FarmData has valid soil sampleResult data in it
     * @method isValidFarmDataWithSoilSample
     * @param FarmData
     * @returns {boolean}
     * @public
     * @static
     */
    soilSampleValidator.isValidFarmDataWithSoilSample = function(farmData){
      var soils = farmData.soils;

      if (!_isDefined(soils)) {
        return false;
      }
      var soilSampleResults = soils.sampleResults;
      if (!_isDefined(soilSampleResults)) {
        return false;
      }
      var dateLastUpdated = soilSampleResults.dateLastUpdated;
      if (!_isDefined(dateLastUpdated)) {
        return false;
      }
      var importFieldNames = soilSampleResults.importFieldNames;
      if (!_isDefined(importFieldNames)) {
        return false;
      }
      if (!_isDefined(farmData.paddocks)) {
        return false;
      }
      var paddocks = farmData.paddocks[0];
      if(!_isDefined(paddocks.soils)){
        return false;
      }

      return true;
    };


    /**
     * Validate if the intermediate object containing the CSV data is or valid format
     * @method isValidSoilSampleResult
     * @param predefined intermediate object, (@see {@link soilSampleConverter.createDefault})
     * @returns {boolean}
     * @public
     * @static
     */
    soilSampleValidator.isValidSoilSampleResult = function(soilSampleResult){

      var results = soilSampleResult.results;
      if (!_isDefined(results)) {
        return false;
      }
      var columnHeaders = results.columnHeaders;
      if (!_isDefined(columnHeaders)) {
        return false;
      }
      var rowsData = results.rows;
      if (!_isDefined(rowsData)) {
        return false;
      }
      if (!_isDefined(soilSampleResult.importFieldDictionary)) {
        return false;
      }
      if (!_isDefined(soilSampleResult.paddockRowDictionary)) {
        return false;
      }

      var numberOfPaddocks =  Object.keys(soilSampleResult.paddockRowDictionary).length;
      $log.info("numberOfPaddocks "+numberOfPaddocks);
      if(!(numberOfPaddocks>0)){
        return false;
      }


      var totalCSVColumns = columnHeaders.length;
      $log.info('Columns in the column headers key '+totalCSVColumns);
      for(var i=0;i<rowsData.length;i++){
        var singleRow = rowsData[i];
        if(singleRow.length!=totalCSVColumns){
          $log.error('The '+i+' row with paddick name '+singleRow[0] +' doesn\'t have required number of columns');
          return false;
        }
      };

      return true;
    };


    return soilSampleValidator;


  });