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
              collections, soilSampleConverter) {
        $log.info("paddockSelector ");

        var myFarmData = {
            "version": 1,
            "dateCreated": "2015-03-30T21:19:00",
            "dateLastUpdated": "2015-05-18T23:40:28.764Z",
            "name": "Susan's Farm",
            "geometry": {
                "type": "Polygon",
                "crs": "EPSG:4283",
                "coordinates": [
                    [
                        [
                            145.57368096419663,
                            -36.224879531701255
                        ],
                        [
                            145.5826132801325,
                            -36.22488327137526
                        ],
                        [
                            145.58260951039628,
                            -36.22801228957186
                        ],
                        [
                            145.57363088613704,
                            -36.22803939355771
                        ],
                        [
                            145.57368096419663,
                            -36.224879531701255
                        ]
                    ]
                ]
            },
            "area": 89.95,
            "areaUnit": "hectare",
            "paddocks": [
                {
                    "name": "P3",
                    "geometry": {
                        "type": "Polygon",
                        "crs": "EPSG:4283",
                        "coordinates": [
                            [
                                [
                                    145.58072144612308,
                                    -36.22500072918365
                                ],
                                [
                                    145.58007203644695,
                                    -36.224996785309635
                                ],
                                [
                                    145.58007068632003,
                                    -36.22579563889769
                                ],
                                [
                                    145.579975038195,
                                    -36.22579611106869
                                ],
                                [
                                    145.57997732422797,
                                    -36.22610013854838
                                ],
                                [
                                    145.58069096429173,
                                    -36.226090652211994
                                ],
                                [
                                    145.58072144612308,
                                    -36.22500072918365
                                ]
                            ]
                        ]
                    },
                    "area": 0.72
                },
                {
                    "name": "P1",
                    "geometry": {
                        "type": "Polygon",
                        "crs": "EPSG:4283",
                        "coordinates": [
                            [
                                [
                                    145.5820357180293,
                                    -36.224883050102875
                                ],
                                [
                                    145.58072609426455,
                                    -36.22488253784964
                                ],
                                [
                                    145.58070132605394,
                                    -36.225512331175615
                                ],
                                [
                                    145.58218018756546,
                                    -36.22550501283936
                                ],
                                [
                                    145.58211312173296,
                                    -36.225216285770216
                                ],
                                [
                                    145.5820357180293,
                                    -36.224883050102875
                                ]
                            ]
                        ]
                    },
                    "area": 0.87
                }
            ]
        }


        var paddockSelector = {},
            _paddocks = myFarmData.paddocks,
            _types = soilClassificationTypes.toArray();


        paddockSelector.createNew = function(columnHeaders, rows, paddockColumnIndex) {
            $log.info("col headers "+columnHeaders);
            $log.info("rows "+rows);
            var test= {
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

        paddockSelector.validateNew = function(paddockSelection) {

            return true;
        }

        paddockSelector.save = function(paddockSelection) {
            $log.info(JSON.stringify(paddockSelection));

            if (!this.validateNew(paddockSelection)) {
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

        paddockSelector.classifyColumn =  function(paddockSelection, classificationType, index) {
            paddockSelection.classificationColumnDictionary[classificationType.name] = index;
            collections.add(paddockSelection.selected, index);
        }

        paddockSelector.declassifyColumn =  function(paddockSelection, classificationType, index) {
            collections.remove(paddockSelection.selected, index);
            delete paddockSelection.classificationColumnDictionary[classificationType.name];
        }


        paddockSelector.types = _types;
        paddockSelector.paddocks = _paddocks;
        paddockSelector.farmData = myFarmData;

        return paddockSelector;
    });
