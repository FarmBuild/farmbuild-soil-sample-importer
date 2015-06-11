/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';


angular.module('farmbuild.soilSampleImporter')
  .factory('paddockSoilSampleRetriever', function ($log, farmdata, validations) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      paddockSoilSampleRetriever = {};


    var soilSamplesInPaddock = function(){

    }
    paddockSoilSampleRetriever.soilSamplesInPaddock = soilSamplesInPaddock;

    return paddockSoilSampleRetriever;
  });
