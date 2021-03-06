/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
 */
'use strict';
/**
 * soilSampleImporter/soilSampleConverter
 * @module soilSampleImporter/soilSampleConverter
 */
angular.module('farmbuild.soilSampleImporter')
  .factory('soilSampleConverter', function ($log, farmdata, validations, soilSampleValidator, soilSampleImporterSession,importField ) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      soilSampleConverter = {};

    /**
     * Create default intermediate object for storing CSV data before converting to FarmData block
     * @method createDefault
     * @returns {object} having a structure of {{dateLastUpdated: Date, results: {columnHeaders: Array, rows: Array}, importFieldDictionary: {}, paddockRowDictionary: {}, paddockNameColumn: undefined}}
     * @public
     */
    function createDefault(){
      return{
        dateLastUpdated: new Date(),
        results:{
          columnHeaders :[],
          rows:[]
        },
        importFieldDictionary :{},

        paddockRowDictionary : 	{},
        paddockNameColumn: undefined

      };

    }
    soilSampleConverter.createDefault = createDefault;



    /**
     * Add the loaded CSV information in to FarmData.
     * The CSV information should be held in the predefined intermediate object, {@link module:soilSampleImporter/soilSampleConverter~createDefault|createDefault},
     * This predefined object will be added to the FardData object as soil sampleResults block. This method will remove any previously loaded soil sampleResults blocks in FarmData and add new soil sampleResults.
     * @method toFarmData
     * @param {!object} FarmData Valid FarmData with paddocks (need not contain a soil sampleResults block)
     * @param {!object} newSampleResults Predefined intermediate object, {@link module:soilSampleImporter/soilSampleConverter~createDefault|createDefault}
     * @returns FarmData with soils sampleResults block
     * @public
     */
    function toFarmData(farmData , newSampleResults){

      if(!_isDefined(farmData)){
        $log.error('Invalid farmdata for soilSamplConverter.toFarmData');
        return undefined;
      }
      if(!_isDefined(newSampleResults)){
        $log.error('Invalid newSampleResults for soilSamplConverter.toFarmData');
        return undefined;
      }

      if(!soilSampleValidator.isValidSoilSampleResult(newSampleResults)){
        $log.error('Invalid newSampleResults for soilSamplConverter.toFarmData');
        return undefined;
      }

      var currentSoils={};
      if(_isDefined(farmData.soils)){currentSoils=farmData.soils;}

      var currentPaddocks=farmData.paddocks;
      if(!_isDefined(currentPaddocks)){
        $log.error('Invalid FarmData for soilSamplConverter.toFarmData');
        return undefined;
      }

      var farmDataSampleResults = {};
      var newResults = newSampleResults.results;
      var newImportFieldDictionary = newSampleResults.importFieldDictionary;
      var importFieldNames =[];
      importFieldNames = Object.keys(newImportFieldDictionary);
      farmDataSampleResults.dateLastUpdated = newSampleResults.dateLastUpdated;
      farmDataSampleResults.importFieldNames = importFieldNames;
      currentSoils.sampleResults = farmDataSampleResults;
      var rows = newResults.rows ;

      //Set up data for the info for each paddock
      var paddockRowDictionary = newSampleResults.paddockRowDictionary;
      for(var i=0;i<currentPaddocks.length;i++){
        var singlePaddock = currentPaddocks[i];
        var paddockRows = paddockRowDictionary[singlePaddock.name];

        //If no paddockRows delete existing in sampleresults in paddock (ie: no new samples are there for the paddock, remove old soil samples)
        if(!_isDefined(paddockRows) || paddockRows.length==0){
          singlePaddock.soils=setSoilSamplResult(singlePaddock.soils,undefined);
          currentPaddocks[i]=singlePaddock;
          continue;
        }

        var singlePaddockSoils=[];
        for(var k=0;k<paddockRows.length;k++){

          var rowValues = rows[paddockRows[k]];
          var sampleValue = {};
          for(var j=0;j<importFieldNames.length;j++){
            var temp = { } ;
            var indexOfValue =newImportFieldDictionary[importFieldNames[j]];
            var rowFieldValue =rowValues[indexOfValue];

            if(importField.hasAverage(importFieldNames[j])){
              if(!(_isEmpty(rowFieldValue) ) || !(isNaN(rowFieldValue)) || !(rowFieldValue==null)){
                rowFieldValue=parseFloat(rowFieldValue);
              }
            }
            sampleValue[importFieldNames[j]] = rowFieldValue;
          }
          singlePaddockSoils.push(sampleValue);
        }
        var singlePaddockSoil ={};

        singlePaddock.soils=setSoilSamplResult(singlePaddock.soils,singlePaddockSoils);
        currentPaddocks[i]=singlePaddock;
      }



      farmData.dateLastUpdated = newSampleResults.dateLastUpdated;

      farmData.soils = currentSoils;
      farmData.paddocks = currentPaddocks;
      return farmData;
    };
    soilSampleConverter.toFarmData = toFarmData;


    var setSoilSamplResult = function(currentPaddockSoil,singlePaddockSoilValue){
      var paddockSoil ={};
      if(_isDefined(currentPaddockSoil)){
        paddockSoil=currentPaddockSoil;
      }
      paddockSoil.sampleResults = singlePaddockSoilValue;
      return paddockSoil;
    }

    return soilSampleConverter;
  });