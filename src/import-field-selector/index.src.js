/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @license The MIT License
 * @author State of Victoria
 * @version 0.1.0
 */

'use strict';
/**
 * soilSampleImporter/importFieldSelector
 * @module soilSampleImporter/importFieldSelector
 */
angular.module('farmbuild.soilSampleImporter')
    .factory('importFieldSelector',
    function ($log, farmdata, soilSampleConverter, importFieldTypes,
              collections, importFieldSelectionValidator) {
        $log.info("importFieldSelector ");

        var importFieldSelector = {},
            _paddocks = [],
            _types = importFieldTypes.toArray();

        function _findPaddockWithName(paddocks, name) {
            for(var i=0; i<paddocks.length; i++) {
                if (name.trim().toUpperCase() == paddocks[i].name.toUpperCase()) {
                    return paddocks[i];
                }
            }
            return undefined;
        }

        /**
         * With the given new values create intermediate object
         * defined as in {@link module:soilSampleImporter/soilSampleConverter~createDefault|createDefault}.
         * @method createNew
         * @param (Object) FarmData - farm data object
         * @param (string[]) columnHeaders - array of column headers
         * @param (Array.<string[]>>) rows - nested array of CSV data with column values as the inner array
         * @param (number) paddockColumnIndex - column index to insert the farm paddock selection value.
         * @returns {object} importFieldsSelection - temporary object to hold data during soil import process.
         */
        importFieldSelector.createNew = function(myFarmData, columnHeaders, rows, paddockColumnIndex) {

            if(!importFieldSelectionValidator.validateCreateNew(columnHeaders, rows)) {
                return undefined;
            }
            if (paddockColumnIndex<0 || paddockColumnIndex>=columnHeaders.length) {
                return undefined;
            }

            // insert column for farm paddock name
            collections.add(columnHeaders, "Farm Paddock Name", paddockColumnIndex);

            for(var i=0; i<rows.length; i++) {
                collections.add(rows[i], "", paddockColumnIndex);
            }

            _paddocks = myFarmData.paddocks;
            importFieldSelector.paddocks = _paddocks;

            var result= {
                "dateLastUpdated": new Date(),
                "results": {
                    "columnHeaders": columnHeaders,
                    "rows": rows
                },
                "importFieldDictionary": {},
                "paddockRowDictionary": {},
                "paddockNameColumn":paddockColumnIndex
            };
            return result;
        }

        importFieldSelector.validate = importFieldSelectionValidator.validateImportFieldsDefinition;


        /**
         * Saves the soil sample data back into farm data object in session.  Internally will validate first.
         * @param myFarmData
         * @param importFieldsSelection
         */
        importFieldSelector.save = function(myFarmData, importFieldsSelection) {

            if (!importFieldSelectionValidator.validateImportFieldsDefinition(importFieldsSelection)) {
                return undefined;
            }

            for (var key in importFieldsSelection.paddockRowDictionary) {
                for(var i=0; i<importFieldsSelection.paddockRowDictionary[key].length; i++) {
                    var rowIndex = importFieldsSelection.paddockRowDictionary[key][i];
                    importFieldsSelection.results.rows[rowIndex][importFieldsSelection.paddockNameColumn] = key;
                }
            }
            return soilSampleConverter.toFarmData(myFarmData, importFieldsSelection);

        }



        /**
         * Given the column index of the CSV file, link the paddocks with the sample rows
         * @method autoLinkPaddock
         * @param importFieldsSelection
         * @param linkColumnIndex
         */
        importFieldSelector.autoLinkPaddock = function(importFieldsSelection, linkColumnIndex) {
            var linkedCount = 0;
            if (linkColumnIndex == importFieldsSelection.paddockNameColumn) {
                return;
            }
            var mappedPaddock = Object.keys(importFieldsSelection.paddockRowDictionary);
            var mappedRowIndex = [];

            for (var i=0; i<mappedPaddock.length; i++) {
                mappedRowIndex = mappedRowIndex.concat(importFieldsSelection.paddockRowDictionary[mappedPaddock[i]]);
            }

            for(var i=0; i<importFieldsSelection.results.rows.length; i++) {
                // If row is not yet mapped, map it
                if (mappedRowIndex.indexOf(i)<0 ) {
                    var paddock = _findPaddockWithName(_paddocks, importFieldsSelection.results.rows[i][linkColumnIndex]);

                    if (paddock) {
                        this.connectRow(importFieldsSelection, paddock, i);
                        linkedCount++;
                    }
                }
            }

            return linkedCount;
        }

        /**
         * Associate the row with the given index to a farm paddock
         * @method connectRow
         * @param importFieldsSelection
         * @param paddock
         * @param rowIndex
         */
        importFieldSelector.connectRow =  function(importFieldsSelection, paddock, rowIndex) {
            if (!importFieldsSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
                importFieldsSelection.paddockRowDictionary[paddock.name]= [];
            }
            collections.add(importFieldsSelection.paddockRowDictionary[paddock.name], rowIndex);

        }

        /**
         * Remove association between the row identified by index with the paddock
         * @param importFieldsSelection
         * @param paddock
         * @param index
         */
        importFieldSelector.disconnectRow =  function(importFieldsSelection, paddock, index) {
            if (importFieldsSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
                collections.remove(importFieldsSelection.paddockRowDictionary[paddock.name], index);
            }
        }

        importFieldSelector.resetPaddockRowDictionary =  function(paddockSelection) {
            paddockSelection.paddockRowDictionary = {};

            return paddockSelection;
        }

        /**
         * Add classification for column with given index
         * @method classifyColumn
         * @param importFieldsSelection
         * @param classificationType
         * @param index
         */
        importFieldSelector.classifyColumn =  function(importFieldsSelection, classificationType, index) {
            importFieldsSelection.importFieldDictionary[classificationType.name] = index;
            //$log.info("paddockSelection "+JSON.stringify(importFieldsSelection));
        }

        /**
         * Remove classification for column with given index
         * @method declassifyColumn
         * @param paddockSelection
         * @param classificationType
         * @param index
         */
        importFieldSelector.declassifyColumn =  function(paddockSelection, classificationType, index) {
            delete paddockSelection.importFieldDictionary[classificationType.name];
        }


        importFieldSelector.types = _types;
        importFieldSelector.paddocks = _paddocks;

        return importFieldSelector;
    });
