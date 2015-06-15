/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */
'use strict';

angular.module('farmbuild.soilSampleImporter')
  .factory('soilSampleConverter', function ($log, farmdata, validations, soilSampleValidator, soilSampleImporterSession,importField ) {

    var _isDefined = validations.isDefined,
      _isArray = validations.isArray,
      _isEmpty = validations.isEmpty,
      soilSampleConverter = {};

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
     * Generate the intermediate object soilSampleResult from farmdata
     * @param farmData
     * @returns {*}
     */
/*    function toSoilSampleResults(farmData){
      $log.info('soilSampleConverter.toSoilSampleResults ');
      if(!soilSampleValidator.isValidFarmDataWithSoilSample(farmData)){
        $log.info('soilSampleValidator.isValidFarmDataWithSoilSample');
        return soilSampleConverter.createDefault();
      }


      var soils =farmData.soils;
      var sampleResults = soils.sampleResults;

      var updatedDate =  sampleResults.dateLastUpdated;
      if (!_isDefined(updatedDate)) {
        updatedDate = new Date();
      }

      var importFieldNames = sampleResults.importFieldNames;
      $log.info('soilSampleConverter.toSoilSampleResults>>importFieldNames '+importFieldNames);

      importFieldNames.splice(0,0,"Paddock Name");
      var paddockNameColumn=undefined;
      if(_isDefined(sampleResults.paddockNameColumn)){
        paddockNameColumn = sampleResults.paddockNameColumn;
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

        paddockRows[paddickName]=singlePaddockRow;
        $log.info('soilSampleConverter.toSoilSampleResults>>singlePaddockRow ',singlePaddockRow);

      }

      return{
        dateLastUpdated: new Date(),
        results:{
          columnHeaders :importFieldNames,
          rows:rows
        },
        importFieldDictionary :importFieldNames,

        paddockRowDictionary : 	paddockRows,
        paddockNameColumn: paddockNameColumn

      };

    };

    soilSampleConverter.toSoilSampleResults = toSoilSampleResults;

*/

    /**
     * Will remove any soil sample info already in farm data and add the new soil sample info
     * @param farmData with or without the soil sample results
     * @param sampleResults soil sample results soilSampleConverter.toSoilSampleResults output
     * @returns {*}
     */
    function toFarmData(farmData , newSampleResults){
      $log.info('newSampleResults '+JSON.stringify(newSampleResults,null,"  "));

        if(!_isDefined(farmData)){
          return undefined;
        };
      if(!_isDefined(newSampleResults)){
        return undefined;
      };

      if(!soilSampleValidator.isValidSoilSampleResult(newSampleResults)){
        return undefined;
      };

      var currentSoils={};
      if(_isDefined(farmData.soils)){currentSoils=farmData.soils;}

      var currentPaddocks=farmData.paddocks;
      if(!_isDefined(currentPaddocks)){
        return undefined;
      }
      $log.info('before loop');

      var farmDataSampleResults = {};


      var newResults = newSampleResults.results;
      //Set up data for the info in soils{ sampleResults:{}}


      var newImportFieldDictionary = newSampleResults.importFieldDictionary;
      var importFieldNames =[];
      importFieldNames = Object.keys(newImportFieldDictionary);



      farmDataSampleResults.dateLastUpdated = newSampleResults.dateLastUpdated;
      farmDataSampleResults.importFieldNames = importFieldNames;

      currentSoils.sampleResults = farmDataSampleResults;


      //Set up data for the info for each paddock
      var rows = newResults.rows ;

      var paddockRowDictionary = newSampleResults.paddockRowDictionary;
      for(var i=0;i<currentPaddocks.length;i++){
        var singlePaddock = currentPaddocks[i];



        var paddockRows = paddockRowDictionary[singlePaddock.name];
        $log.info('paddockRows '+JSON.stringify(paddockRows,null,"  "));


        //If no paddockRows delete existing in sampleresults in paddock (ie: nothing new is there for the paddock)
        if(!_isDefined(paddockRows) || paddockRows.length==0){
          $log.info('paddock rows is empty');
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




      farmData.soils = currentSoils;
      farmData.paddocks = currentPaddocks;
      $log.info('farmData ',JSON.stringify(farmData,null,'   '));
      return farmData;
    };
    soilSampleConverter.toFarmData = toFarmData;


    var setSoilSamplResult = function(currentPaddockSoil,singlePaddockSoilValue){
      $log.info("setSoilSamplResult");
      var paddockSoil ={};
      if(_isDefined(currentPaddockSoil)){
        paddockSoil=currentPaddockSoil;
      }
      paddockSoil.sampleResults = singlePaddockSoilValue;
      $log.info("paddockSoil last"+paddockSoil);
      return paddockSoil;
    }
    return soilSampleConverter;
  });