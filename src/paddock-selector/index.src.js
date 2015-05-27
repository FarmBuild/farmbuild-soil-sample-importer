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
    function ($log, farmdata, soilSampleImporterSession) {
        $log.info("paddockSelector ");
        var paddockSelector = {},
            _paddocks = [{"name":"Paddock one"}, {"name":"Paddock two"}],
            _types = [
                {"label":"Olsen Phosphorus (mg/kg)"},
                {"label":"Colwell Potassium (mg/kg)"}
            ];

        paddockSelector.createNew = function() {
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
                    [undefined,'123', 'Front Barn', 1.2,3.4],
                    [undefined,'456', 'Left Barn', 3.1,4.2]
                ],
                "paddockColumnIndex":0
            };
            return test;
        }

        paddockSelector.save = function(paddockSelection) {

        }

        paddockSelector.types = _types;
        paddockSelector.paddocks = _paddocks;

        return paddockSelector;
    });
