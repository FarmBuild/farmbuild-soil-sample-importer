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
    function ($log, farmdata, soilSampleImporterSession, soilClassificationTypes,
              collections) {
        $log.info("paddockSelector ");
        var paddockSelector = {},
            _paddocks = [{"name":"Paddock one"}, {"name":"Paddock two"}],
            _types = soilClassificationTypes.toArray();


        paddockSelector.createNew = function() {
            var test= {
                "dateLastUpdated": "2015-05-25T02:23:51",
                "columnHeaders" : [
                    "Paddock",
                    "SampleId",
                    "SampleName",
                    "Ph",
                    "Saturation",
                    "aaa",
                    "bbb",
                    "ccc",
                    "dd",
                    "ee"
                ],
                "rows" : [
                    [undefined,'123', 'Front Barn', 1,2,3,4,5,6,7],
                    [undefined,'456', 'Left Barn', 2,3,4,5,6,7,8],
                    [undefined,'789', 'Back Barn', 3,4,5,6,7,8,9]
                ],
                "classificationColumnDictionary": {},
                "paddockRowDictionary": {},
                "paddockColumnIndex":0
            };
            return test;
        }


        paddockSelector.load = function() {
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
        }

        paddockSelector.save = function(paddockSelection) {
            $log.info(JSON.stringify(paddockSelection));
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

        paddockSelector.classifyColumn =  function(paddockSelection, classificationType, index) {
            paddockSelection.classificationColumnDictionary[classificationType.name] = index;
        }

        paddockSelector.declassifyColumn =  function(paddockSelection, classificationType) {
            delete paddockSelection.classificationColumnDictionary[classificationType.name];
        }


        paddockSelector.types = _types;
        paddockSelector.paddocks = _paddocks;

        return paddockSelector;
    });
