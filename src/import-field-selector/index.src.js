/**
 * @since 0.0.1
 * @copyright State of Victoria
 * @author State of Victoria
 * @version 1.0.0
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
         * @param {object} myFarmData FarmData object
         * @param {object} importFieldsSelection temporary object to hold data during soil import process
         * @return {object} FarmData updated FarmData
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
         * Given that the CSV file contains a column with the paddock names, link a paddock to a row in each CSV file.
         * @method autoLinkPaddock
         * @param {object} importFieldsSelection temporary object to hold data during soil import process
         * @param {obejct} linkColumnIndex index of the column in the CSV file containing the paddock name
         * @return {number} count total number of rows linked successfully
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
         * Associate the row in the CSV file with the selected index of a farm paddock
         * @method connectRow
         * @param {obejct} importFieldsSelection temporary object to hold data during soil import process
         * @param {object} paddock paddock object from FarmData
         * @param {number} rowIndex row index of the CSV
         *
         */
        importFieldSelector.connectRow =  function(importFieldsSelection, paddock, rowIndex) {
            if (!importFieldsSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
                importFieldsSelection.paddockRowDictionary[paddock.name]= [];
            }
            collections.add(importFieldsSelection.paddockRowDictionary[paddock.name], rowIndex);

        }

        /**
         * Remove association between the row identified by index of the paddock
         * @param {obejct} importFieldsSelection temporary object to hold data during soil import process
         * @param {object} paddock paddock object from FarmData
         */
        importFieldSelector.disconnectRow =  function(importFieldsSelection, paddock, index) {
            if (importFieldsSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
                collections.remove(importFieldsSelection.paddockRowDictionary[paddock.name], index);
            }
        }

        /**
         *  Remove all associations between rows and paddocks.
         *  @method resetPaddockRowDictionary
         * @param {object} importFieldsSelection temporary object to hold data during soil import process
         * @return {obejct} importFieldsSelection temporary object to hold data during soil import process, with the paddock associations removed
         */
        importFieldSelector.resetPaddockRowDictionary =  function(paddockSelection) {
            paddockSelection.paddockRowDictionary = {};

            return paddockSelection;
        }

        /**
         * Associate a column with a import field definition.
         * @method classifyColumn
         * @param {object} importFieldsSelection - temporary object to hold data during soil import process.
         * @param {object} importFieldDefinition {@link module:soilSampleImporter/importField~createDefault|createDefault}
         * @param {number} index Column index in the CSV to disconnect
         */
        importFieldSelector.classifyColumn =  function(importFieldsSelection, classificationType, index) {
            importFieldsSelection.importFieldDictionary[classificationType.name] = index;
        }

        /**
         * Remove classification for column with given index
         * @method declassifyColumn
         * @param {object} importFieldsSelection - temporary object to hold data during soil import process.
         * @param {object} importFieldDefinition {@link module:soilSampleImporter/importField~createDefault|createDefault}
         * @param {number} index Column index in the CSV to remove
         */
        importFieldSelector.declassifyColumn =  function(paddockSelection, classificationType, index) {
            delete paddockSelection.importFieldDictionary[classificationType.name];
        }

        /**
         * Read the deafult import field definition file and return a collection
         * <a href="https://raw.githubusercontent.com/FarmBuild/farmbuild-soil-sample-importer/master/src/import-field-definition/defaults.conf.src.js">
         *  import-field-definition>>default.conf.src.js</a>
         *  @method types
         *  @return {collection}  object Collection containing the default import field definitions
         */
        importFieldSelector.types = _types;

        /**
         * Refer to  <a href="https://github.com/FarmBuild/farmbuild-farmdata">FarmData</a>.
         */
        importFieldSelector.paddocks = _paddocks;

        return importFieldSelector;
    });
