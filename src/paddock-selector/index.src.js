/**
 * @since 0.0.1
 * @copyright 2015 Spatial Vision, Inc. http://spatialvision.com.au
 * @license The MIT License
 * @author Spatial Vision
 * @version 0.1.0
 */

'use strict';

angular.module('farmbuild.soilSampleImporter')
    .factory('paddockSelector',
    function ($log, farmdata, soilSampleImporter, soilClassificationTypes,
              collections, soilSampleConverter, paddockSelectionValidator) {
        $log.info("paddockSelector ");

        var paddockSelector = {},
            _paddocks = [],
            _types = soilClassificationTypes.toArray();


        paddockSelector.createNew = function(myFarmData, columnHeaders, rows, paddockColumnIndex) {

            if(!paddockSelectionValidator.validateCreateNew(columnHeaders, rows)) {
                return undefined;
            }

            _paddocks = myFarmData.paddocks;
            paddockSelector.paddocks = _paddocks;

            var result= {
                "dateLastUpdated": new Date(),
                "results": {
                    "columnHeaders": columnHeaders,
                    "rows": rows
                },
                "selected": [],
                "classificationColumnDictionary": {},
                "paddockRowDictionary": {},
                "paddockNameColumn":paddockColumnIndex
            };
            return result;
        }


        /*paddockSelector.load = function() {
            var test= {
                "dateLastUpdated": "2015-05-25T02:23:51",
                "columnHeaders" : [
                    "Paddock",
                    "SampleId",
                    "SampleName",
                    "Ph",
                    "Saturation"
                ],
                "rows" : [
                    ['P1','123', 'Front Barn', 1,2,3,4,5,6,7],
                    ['P2','456', 'Left Barn', 1,2,3,4,5,6,7]
                ],
                "classificationColumnDictionary": {},
                "paddockRowDictionary": {},
                "paddockColumnIndex":0
            };
            return test;
        }*/

        paddockSelector.save = function(myFarmData, paddockSelection) {
            $log.info(JSON.stringify(paddockSelection));

            if (!paddockSelectionValidator.validatePaddockSelection(paddockSelection)) {
                return undefined;
            }

            return soilSampleConverter.toFarmData(myFarmData, paddockSelection);

        }

        /**
         *
         * @param paddockSelection
         * @param paddock
         * @param rowIndex
         */
        paddockSelector.connectRow =  function(paddockSelection, paddock, rowIndex) {
            if (!paddockSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
                paddockSelection.paddockRowDictionary[paddock.name]= [];
            }
            collections.add(paddockSelection.paddockRowDictionary[paddock.name], rowIndex);

        }

        paddockSelector.disconnectRow =  function(paddockSelection, paddock, index) {
            if (paddockSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
                collections.remove(paddockSelection.paddockRowDictionary[paddock.name], index);
            }
        }

        paddockSelector.resetPaddockRowDictionary =  function(paddockSelection) {
            paddockSelection.paddockRowDictionary = {};

            return paddockSelection;
        }

        paddockSelector.selectColumn =  function(paddockSelection, value) {
            collections.add(paddockSelection.selected, value);
        }

        paddockSelector.deselectColumn =  function(paddockSelection, value) {
            collections.remove(paddockSelection.selected, value)
        }

        /**
         * Add classification for column with given index
         * @param paddockSelection
         * @param classificationType
         * @param index
         */
        paddockSelector.classifyColumn =  function(paddockSelection, classificationType, index) {
            paddockSelection.classificationColumnDictionary[classificationType.name] = index;
            $log.info("paddockSelection "+JSON.stringify(paddockSelection));
            this.selectColumn(paddockSelection, index);
        }

        /**
         * remove classification for column with given index
         * @param paddockSelection
         * @param classificationType
         * @param index
         */
        paddockSelector.declassifyColumn =  function(paddockSelection, classificationType, index) {
            this.deselectColumn(paddockSelection, index);
            delete paddockSelection.classificationColumnDictionary[classificationType.name];
        }


        paddockSelector.types = _types;
        paddockSelector.paddocks = _paddocks;

        return paddockSelector;
    });
