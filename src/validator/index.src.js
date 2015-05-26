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


    soilSampleValidator.isSoilSampleResultDefined = function(farmData){
      var soils = farmData.soils;

      if (!_isDefined(soils)) {
        return false;
      }

      var soilSampleResults = soils.sampleResults;
      if (!_isDefined(soilSampleResults)) {
        return false;
      }

      var csvColumns = soilSampleResults.columns;
      if (!_isDefined(csvColumns)) {
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

    return soilSampleValidator;


  });