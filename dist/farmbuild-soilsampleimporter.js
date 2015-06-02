"use strict";

angular.module("farmbuild.soilSampleImporter", [ "farmbuild.core", "farmbuild.farmdata" ]).factory("soilSampleImporter", function(soilSampleImporterSession, farmdata, validations, googleAnalyticsImporter, $log) {
    var soilSampleImporter = {
        farmdata: farmdata
    }, _isPositiveNumber = validations.isPositiveNumber, _isDefined = validations.isDefined;
    soilSampleImporter.version = "0.1.0";
    soilSampleImporter.ga = googleAnalyticsImporter;
    soilSampleImporter.session = soilSampleImporterSession;
    $log.info("Welcome to Soil Sample Importer... " + "this should only be initialised once! why we see twice in the example?");
    function createDefault() {
        $log.info("soil-sample-importer>>>>createDefault");
        return {
            dateLastUpdated: "",
            types: []
        };
    }
    soilSampleImporter.find = function() {
        return soilSampleImporterSession.find();
    };
    soilSampleImporter.load = function(farmData) {
        var loaded = farmdata.load(farmData);
        $log.info("soil-sample-importer>>>>load>>after farmdata.load");
        if (!_isDefined(loaded)) {
            return undefined;
        }
        $log.info("soil-sample-importer>>>>load>>check soils");
        if (!loaded.hasOwnProperty("soils")) {
            $log.info("soil-sample-importer>>>>load>>no property soils");
            loaded.soils = {
                soils: {}
            };
        }
        if (!loaded.soils.hasOwnProperty("soilSamples")) {
            $log.info("soil-sample-importer>>>>load>>no property paddocks");
            loaded.soils.soilSamples = createDefault();
            loaded = farmdata.update(loaded);
        }
        $log.info("soil-sample-importer>>>>load>" + loaded);
        return loaded;
    };
    if (typeof window.farmbuild === "undefined") {
        window.farmbuild = {
            nutrientcalculator: soilSampleImporter
        };
    } else {
        window.farmbuild.nutrientcalculator = soilSampleImporter;
    }
    return soilSampleImporter;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("soilSampleConverter", function($log, farmdata, validations, soilSampleValidator, soilSampleImporterSession) {
    var _isDefined = validations.isDefined, _isArray = validations.isArray, _isEmpty = validations.isEmpty, soilSampleConverter = {};
    soilSampleConverter.toSoilSampleResults = function(farmData) {
        if (!soilSampleValidator.isValidFarmDataWithSoilSample(farmData)) {
            $log.info("soilSampleValidator.isValidFarmDataWithSoilSample");
            return {
                dateLastUpdated: new Date(),
                results: {
                    columnHeaders: [],
                    rows: []
                },
                classificationColumnDictionary: {},
                selected: [],
                paddockRowDictionary: {},
                paddockNameColumn: undefined
            };
        }
        var soils = farmData.soils;
        var sampleResults = soils.sampleResults;
        var updatedDate = sampleResults.dateLastUpdated;
        if (!_isDefined(updatedDate)) {
            updatedDate = new Date();
        }
        var columnHeaders = sampleResults.columnHeaders;
        $log.info("soilSampleConverter.toSoilSampleResults>>columnHeaders " + columnHeaders);
        var classifications = {};
        if (_isDefined(sampleResults.classificationColumnDictionary)) {
            classifications = sampleResults.classificationColumnDictionary;
        }
        var paddockNameColumn = undefined;
        if (_isDefined(sampleResults.paddockNameColumn)) {
            paddockNameColumn = sampleResults.paddockNameColumn;
        }
        var selectedColumns = {};
        if (_isDefined(sampleResults.selected)) {
            selectedColumns = sampleResults.selected;
        }
        var paddocks = farmData.paddocks;
        $log.info("soilSampleConverter.toSoilSampleResults>>paddocks " + paddocks);
        var rows = [], paddockRows = {};
        var rowIndexCount = 1;
        for (var i = 0; i < paddocks.length; i++) {
            var singlePaddock = paddocks[i];
            var paddickName = singlePaddock.name;
            $log.info("paddickName " + paddickName);
            if (!_isDefined(singlePaddock.soils)) {
                continue;
            }
            var singleSoil = singlePaddock.soils;
            if (!_isDefined(singleSoil.sampleResults)) {
                continue;
            }
            var singleSampleResult = singleSoil.sampleResults;
            $log.info("singleSampleResult " + singleSampleResult);
            var singlePaddockRow = [];
            $log.info("paddockRows[paddickName " + paddockRows[paddickName]);
            if (_isDefined(paddockRows[paddickName])) {
                singlePaddockRow = paddockRows[paddickName];
            }
            for (var j = 0; j < singleSampleResult.length; j++) {
                rows.push(singleSampleResult[j]);
                singlePaddockRow.push(rowIndexCount++);
            }
            paddockRows[paddickName] = singlePaddockRow;
            $log.info("soilSampleConverter.toSoilSampleResults>>singlePaddockRow ", singlePaddockRow);
        }
        return {
            dateLastUpdated: new Date(),
            results: {
                columnHeaders: columnHeaders,
                rows: rows
            },
            classificationColumnDictionary: classifications,
            selected: selectedColumns,
            paddockRowDictionary: paddockRows,
            paddockNameColumn: paddockNameColumn
        };
    };
    soilSampleConverter.toFarmData = function(farmData, newSampleResults) {
        if (!_isDefined(farmData)) {
            return undefined;
        }
        if (!_isDefined(newSampleResults)) {
            return undefined;
        }
        if (!soilSampleValidator.isValidSoilSampleResult(newSampleResults)) {
            return undefined;
        }
        var currentSoils = {};
        if (_isDefined(farmData.soils)) {
            currentSoils = farmData.soils;
        }
        var currentPaddocks = farmData.paddocks;
        if (!_isDefined(currentPaddocks)) {
            return undefined;
        }
        $log.info("before loop");
        var currentSampleResults = {};
        if (_isDefined(currentSoils.sampleResults)) {
            currentSampleResults = currentSoils.sampleResults;
        }
        var newResults = newSampleResults.results;
        currentSampleResults.dateLastUpdated = newSampleResults.dateLastUpdated;
        currentSampleResults.columnHeaders = newResults.columnHeaders;
        currentSampleResults.classificationColumnDictionary = newSampleResults.classificationColumnDictionary;
        currentSampleResults.selected = newSampleResults.selected;
        currentSampleResults.paddockNameColumn = newSampleResults.paddockNameColumn;
        currentSoils.sampleResults = currentSampleResults;
        $log.info("modifiedSoils ", JSON.stringify(currentSoils, null, "   "));
        var rows = newResults.rows;
        var paddockRowDictionary = newSampleResults.paddockRowDictionary;
        for (var i = 0; i < currentPaddocks.length; i++) {
            var singlePaddock = currentPaddocks[i];
            var paddockRows = paddockRowDictionary[singlePaddock.name];
            if (!_isDefined(paddockRows) || !_isArray(paddockRows)) {
                continue;
            }
            var singlePaddockSoils = [];
            $log.info("singlePaddockSoils " + paddockRows);
            if (paddockRows.length == 0) {
                continue;
            }
            for (var k = 0; k < paddockRows.length; k++) {
                var paddockRowsIndex = paddockRows[k] - 1;
                singlePaddockSoils.push(rows[paddockRowsIndex]);
            }
            var singlePaddockSoil = {};
            if (_isDefined(singlePaddock.soils)) {
                singlePaddockSoil = singlePaddock.soils;
            }
            singlePaddockSoil.sampleResults = singlePaddockSoils;
            singlePaddock.soils = singlePaddockSoil;
            currentPaddocks[i] = singlePaddock;
        }
        farmData.soils = currentSoils;
        $log.info(" farmData.soils ", JSON.stringify(farmData.soils, null, "   "));
        farmData.paddocks = currentPaddocks;
        return farmData;
    };
    return soilSampleConverter;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("soilSampleValidator", function($log, farmdata, validations) {
    var soilSampleValidator = {}, _isDefined = validations.isDefined, _isArray = validations.isArray;
    soilSampleValidator.isValidFarmDataWithSoilSample = function(farmData) {
        var soils = farmData.soils;
        if (!_isDefined(soils)) {
            return false;
        }
        var soilSampleResults = soils.sampleResults;
        if (!_isDefined(soilSampleResults)) {
            return false;
        }
        var csvColumns = soilSampleResults.columnHeaders;
        if (!_isDefined(csvColumns)) {
            return false;
        }
        if (!_isDefined(soilSampleResults.selected)) {
            return false;
        }
        if (!_isDefined(farmData.paddocks)) {
            return false;
        }
        var paddocks = farmData.paddocks[0];
        if (!_isDefined(paddocks.soils)) {
            return false;
        }
        return true;
    };
    soilSampleValidator.isValidSoilSampleResult = function(soilSampleResult) {
        var results = soilSampleResult.results;
        if (!_isDefined(results)) {
            return false;
        }
        var columnHeaders = results.columnHeaders;
        if (!_isDefined(columnHeaders)) {
            return false;
        }
        var rowsData = results.rows;
        if (!_isDefined(rowsData)) {
            return false;
        }
        if (!_isDefined(soilSampleResult.classificationColumnDictionary)) {
            return false;
        }
        if (!_isDefined(soilSampleResult.selected)) {
            return false;
        }
        if (!_isDefined(soilSampleResult.paddockRowDictionary)) {
            return false;
        }
        var numberOfPaddocks = Object.keys(soilSampleResult.paddockRowDictionary).length;
        if (!(numberOfPaddocks > 0)) {
            return false;
        }
        var totalCSVColumns = columnHeaders.length;
        $log.info("Columns in the column headers key " + totalCSVColumns);
        for (var i = 0; i < rowsData.length; i++) {
            var singleRow = rowsData[i];
            if (singleRow.length != totalCSVColumns) {
                $log.error("The " + i + " row with paddick name " + singleRow[0] + " doesn't have required number of columns");
                return false;
            }
        }
        return true;
    };
    return soilSampleValidator;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("googleAnalyticsImporter", function($log, validations, googleAnalytics) {
    var googleAnalyticsImporter = {}, api = "farmbuild-dairy-nutrient-calculator", _isDefined = validations.isDefined;
    googleAnalyticsImporter.track = function(clientName) {
        $log.info("googleAnalyticsImporter.track clientName: %s", clientName);
        googleAnalytics.track(api, clientName);
    };
    return googleAnalyticsImporter;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("paddockSelector", function($log, farmdata, soilSampleImporterSession, soilClassificationTypes, collections) {
    $log.info("paddockSelector ");
    var paddockSelector = {}, _paddocks = [ {
        name: "Paddock one"
    }, {
        name: "Paddock two"
    } ], _types = soilClassificationTypes.toArray();
    paddockSelector.createNew = function() {
        var test = {
            dateLastUpdated: "2015-05-25T02:23:51",
            columnHeaders: [ "Paddock", "SampleId", "SampleName", "Ph", "Saturation", "aaa", "bbb", "ccc", "dd", "ee" ],
            rows: [ [ undefined, "123", "Front Barn", 1, 2, 3, 4, 5, 6, 7 ], [ undefined, "456", "Left Barn", 2, 3, 4, 5, 6, 7, 8 ], [ undefined, "789", "Back Barn", 3, 4, 5, 6, 7, 8, 9 ] ],
            classificationColumnDictionary: {},
            paddockRowDictionary: {},
            paddockColumnIndex: 0
        };
        return test;
    };
    paddockSelector.load = function() {
        var test = {
            dateLastUpdated: "2015-05-25T02:23:51",
            columnHeaders: [ "Paddock", "SampleId", "SampleName", "Ph", "Saturation" ],
            rows: [ [ "P1", "123", "Front Barn", 1, 2, 3, 4, 5, 6, 7 ], [ "P2", "456", "Left Barn", 1, 2, 3, 4, 5, 6, 7 ] ],
            classificationColumnDictionary: {},
            paddockRowDictionary: {},
            paddockColumnIndex: 0
        };
        return test;
    };
    paddockSelector.save = function(paddockSelection) {
        $log.info(JSON.stringify(paddockSelection));
    };
    paddockSelector.connectRow = function(paddockSelection, paddock, rowIndex) {
        if (!paddockSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
            paddockSelection.paddockRowDictionary[paddock.name] = [];
        }
        collections.add(paddockSelection.paddockRowDictionary[paddock.name], rowIndex);
    };
    paddockSelector.disconnectRow = function(paddockSelection, paddock, index) {
        if (paddockSelection.paddockRowDictionary.hasOwnProperty(paddock.name)) {
            collections.remove(paddockSelection.paddockRowDictionary[paddock.name], index);
        }
    };
    paddockSelector.resetPaddockRowDictionary = function(paddockSelection) {
        paddockSelection.paddockRowDictionary = {};
        return paddockSelection;
    };
    paddockSelector.classifyColumn = function(paddockSelection, classificationType, index) {
        paddockSelection.classificationColumnDictionary[classificationType.name] = index;
    };
    paddockSelector.declassifyColumn = function(paddockSelection, classificationType) {
        delete paddockSelection.classificationColumnDictionary[classificationType.name];
    };
    paddockSelector.types = _types;
    paddockSelector.paddocks = _paddocks;
    return paddockSelector;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("soilSampleImporterSession", function($log, farmdata, validations) {
    var soilSampleImporterSession = {}, _isDefined = validations.isDefined;
    function load() {
        var root = farmdata.session.find();
        if (!_isDefined(root)) {
            return undefined;
        }
        return root.soilSampleImporter;
    }
    soilSampleImporterSession.saveSection = function(section, value) {
        var loaded = load();
        if (!_isDefined(loaded)) {
            $log.error("Unable to find an existing farmData! please create then save.");
            return soilSampleImporterSession;
        }
        loaded[section] = value;
        return save(loaded);
    };
    function save(toSave) {
        var farmData = farmdata.session.find();
        if (!_isDefined(farmData)) {
            $log.error("Unable to find the farmData in the session!");
            return undefined;
        }
        farmData.dateLastUpdated = new Date();
        farmData.soilSampleImporter = toSave;
        farmdata.session.save(farmData);
        return toSave;
    }
    soilSampleImporterSession.save = save;
    soilSampleImporterSession.loadSection = function(section) {
        var loaded = load();
        return loaded ? loaded[section] : null;
    };
    soilSampleImporterSession.isLoadFlagSet = function(location) {
        var load = false;
        if (location.href.split("?").length > 1 && location.href.split("?")[1].indexOf("load") === 0) {
            load = location.href.split("?")[1].split("=")[1] === "true";
        }
        return load;
    };
    soilSampleImporterSession.find = function() {
        return farmdata.session.find();
    };
    return soilSampleImporterSession;
});

angular.module("farmbuild.soilSampleImporter").constant("soilClassificationDefaults", {
    types: [ {
        name: "pH H2O (Water)",
        ranges: [ {
            name: [ "Very Acidic", "Acidic", "Slightly Acidic", "Neutral" ],
            min: [ undefined, 5.2, 5.5, 6.1 ],
            max: [ 5.2, 5.5, 6.1, undefined ],
            defaultColor: [ "#fffe03", "#96cf4c", "#96cf4c", "#aba3cc" ]
        } ]
    }, {
        name: "Olsen Phosphorus (mg/kg)",
        ranges: [ {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            min: [ undefined, 9, 14, 20, 27 ],
            max: [ 9, 14, 20, 27, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        } ]
    }, {
        name: "PBI",
        ranges: [ {
            name: [ "Very Sandy", "Sand, Sandy Loams", "Sandy/Silty Loams", "Sandy/Silty Clay Loams", "Clay Loams", "Clay Loams & Clay", "Volcanic Clay & Peat" ],
            min: [ undefined, 15, 35, 70, 140, 280, 840 ],
            max: [ 15, 35, 70, 140, 280, 840, undefined ],
            defaultColor: [ undefined, undefined, undefined, undefined, undefined, undefined, undefined ]
        } ]
    }, {
        name: "KCl 40 Sulphur (mg/kg)",
        ranges: [ {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            min: [ undefined, 4.5, 7.5, 10.5, 14 ],
            max: [ 4.5, 7.5, 10.5, 14, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        } ]
    }, {
        name: "Colwell Phosphorus (mg/kg)",
        ranges: [ {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ undefined ],
                max: [ 15 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 15, 23, 30, 41 ],
            max: [ 15, 23, 30, 41, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 15 ],
                max: [ 35 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 17, 26, 34, 47 ],
            max: [ 17, 26, 34, 47, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 35 ],
                max: [ 70 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 19, 30, 39, 53 ],
            max: [ 19, 30, 39, 53, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 70 ],
                max: [ 140 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 22, 35, 45, 61 ],
            max: [ 22, 35, 45, 61, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 140 ],
                max: [ 280 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 26, 42, 54, 74 ],
            max: [ 26, 42, 54, 74, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 280 ],
                max: [ 840 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 37, 58, 75, 102 ],
            max: [ 37, 58, 75, 102, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 840 ],
                max: [ undefined ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 50, 90, 120, 150 ],
            max: [ 50, 90, 120, 150, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        } ]
    }, {
        name: "Colwell Potassium (mg/kg)",
        ranges: [ {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ undefined ],
                max: [ 35 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 70, 120, 170, 230 ],
            max: [ 70, 120, 170, 230, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 35 ],
                max: [ 70 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 80, 130, 190, 250 ],
            max: [ 80, 130, 190, 250, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 70 ],
                max: [ 280 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 90, 130, 190, 260 ],
            max: [ 90, 130, 190, 260, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 280 ],
                max: [ undefined ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, 100, 150, 220, 280 ],
            max: [ 100, 150, 220, 280, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        } ]
    }, {
        name: "Exch Potassium (meq/100g)",
        ranges: [ {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ undefined ],
                max: [ 35 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, .18, .31, .44, .6 ],
            max: [ .18, .31, .44, .6, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 35 ],
                max: [ 70 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, .2, .33, .49, .64 ],
            max: [ .2, .33, .49, .64, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 70 ],
                max: [ 280 ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, .23, .33, .53, .66 ],
            max: [ .23, .33, .53, .66, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        }, {
            name: [ "Deficient", "Marginal", "Adequate", "High", "Very High" ],
            dependencyRange: {
                name: [ "PBI" ],
                min: [ 280 ],
                max: [ undefined ],
                defaultColor: [ undefined ]
            },
            min: [ undefined, .26, .39, .56, .72 ],
            max: [ .26, .39, .56, .72, undefined ],
            defaultColor: [ "#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573" ]
        } ]
    } ]
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("soilClassification", function($log, soilClassificationTypes, validations) {
    $log.info("soilClassification ");
    var soilClassification = {}, _isDefined = validations.isDefined;
    function _isWithinRange(min, max, classificationValue) {
        if (!_isDefined(min) && _isDefined(max)) {
            return classificationValue <= max;
        } else if (_isDefined(min) && _isDefined(max)) {
            return min < classificationValue && classificationValue <= max;
        } else if (_isDefined(min) && !_isDefined(max)) {
            return min < classificationValue;
        }
        return false;
    }
    function _findRangeIndex(minArray, maxArray, classificationValue) {
        for (var i = 0; i < minArray.length; i++) {
            if (_isWithinRange(minArray[i], maxArray[i], classificationValue)) {
                return i;
            }
        }
        return -1;
    }
    function _copyResult(classificationRange, index) {
        if (index >= 0 && index < classificationRange.name.length) {
            var result = {};
            result.name = classificationRange.name[index];
            result.defaultColor = classificationRange.defaultColor[index];
            return result;
        }
        return undefined;
    }
    function _isValidType(anObject) {
        try {
            if (_isDefined(anObject) && _isDefined(anObject.name) && _isDefined(anObject.ranges)) {
                return true;
            }
        } catch (err) {}
        return false;
    }
    soilClassification.findRange = function(classificationType, classificationValue) {
        if (!_isValidType(classificationType)) {
            return undefined;
        }
        for (var i = 0; i < classificationType.ranges.length; i++) {
            var aRange = classificationType.ranges[i];
            var index = _findRangeIndex(aRange.min, aRange.max, classificationValue);
            if (index >= 0) {
                return _copyResult(aRange, index);
            }
        }
        return undefined;
    };
    soilClassification.findRangeWithDependency = function(classificationType, classificationValue, dependencyValue) {
        if (!_isValidType(classificationType)) {
            return undefined;
        }
        for (var i = 0; i < classificationType.ranges.length; i++) {
            var aRange = classificationType.ranges[i];
            if (_findRangeIndex(aRange.dependencyRange.min, aRange.dependencyRange.max, dependencyValue) >= 0) {
                var index = _findRangeIndex(aRange.min, aRange.max, classificationValue);
                if (index >= 0) {
                    return _copyResult(aRange, index);
                }
                return undefined;
            }
        }
        return undefined;
    };
    return soilClassification;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("soilClassificationTypes", function(collections, validations, soilClassificationDefaults, $log) {
    var soilClassificationTypes, _isPositiveNumber = validations.isPositiveNumber, _isPositiveNumberOrZero = validations.isPositiveNumberOrZero, _isEmpty = validations.isEmpty, _isDefined = validations.isDefined, _types = angular.copy(soilClassificationDefaults.types);
    function _create(name) {
        var type = {
            name: name
        };
        return type;
    }
    function _validate(type) {
        $log.info("validating type  ...", type);
        var valid = !_isEmpty(type) && !_isEmpty(type.name);
        if (!valid) {
            $log.error("invalid type: %j", type);
        }
        return valid;
    }
    function _add(types, name) {
        var type = _create(name);
        $log.info("adding a type ...", type);
        if (!_validate(type)) {
            return undefined;
        }
        return collections.add(types, type);
    }
    soilClassificationTypes = {
        add: _add,
        at: function(index) {
            return collections.at(_types, index);
        },
        size: function() {
            return collections.size(_types);
        },
        byName: function(name) {
            return collections.byProperty(_types, "name", name);
        },
        toArray: function() {
            return angular.copy(_types);
        },
        removeAt: function(index) {
            return collections.removeAt(_types, index);
        },
        last: function() {
            return collections.last(_types);
        },
        validate: _validate,
        create: _create
    };
    return soilClassificationTypes;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").run(function(soilSampleImporter) {});

angular.injector([ "ng", "farmbuild.soilSampleImporter" ]);