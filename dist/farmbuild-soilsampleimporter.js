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
        if (!soilSampleValidator.isSoilSampleResultDefined(farmData)) {
            $log.info("soilSampleValidator.isSoilSampleResultDefined");
            return {
                dateLastUpdated: new Date(),
                columns: [],
                paddockResults: []
            };
        }
        var soils = farmData.soils;
        var soilSampleResults = soils.sampleResults;
        var updatedDate = soilSampleResults.dateLastUpdated;
        if (!_isDefined(updatedDate)) {
            updatedDate = new Date();
        }
        var csvColumns = soilSampleResults.columns;
        $log.info("soilSampleConverter.toSoilSampleResults>>csvColumns " + csvColumns);
        var paddocks = farmData.paddocks;
        $log.info("soilSampleConverter.toSoilSampleResults>>paddocks " + paddocks);
        var paddockResult = [];
        for (var i = 0; i < paddocks.length; i++) {
            var singlePaddock = paddocks[i];
            var singleSampleResult = {};
            singleSampleResult.name = singlePaddock.name;
            singleSampleResult.results = [];
            if (_isDefined(singlePaddock.soils)) {
                var paddickSoil = singlePaddock.soils;
                if (_isDefined(paddickSoil.sampleResults)) {
                    singleSampleResult.results = paddickSoil.sampleResults;
                }
            }
            paddockResult.push(singleSampleResult);
        }
        return {
            dateLastUpdated: new Date(),
            columns: csvColumns,
            paddockResults: paddockResult
        };
    };
    soilSampleConverter.toFarmData = function(farmData, sampleResults) {};
    return soilSampleConverter;
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

"use strict";

angular.module("farmbuild.soilSampleImporter").factory("soilSampleValidator", function($log, farmdata, validations) {
    var soilSampleValidator = {}, _isDefined = validations.isDefined, _isArray = validations.isArray;
    soilSampleValidator.isSoilSampleResultDefined = function(farmData) {
        var soils = farmData.soils;
        if (!_isDefined(soils)) {
            return false;
        }
        var soilSampleResults = soils.sampleResults;
        if (!_isDefined(soilSampleResults)) {
            return false;
        }
        var csvColumns = soilSampleResults.columns;
        if (!_isDefined(csvColumns)) {
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
    return soilSampleValidator;
});

"use strict";

angular.module("farmbuild.soilSampleImporter").run(function(soilSampleImporter) {});

angular.injector([ "ng", "farmbuild.soilSampleImporter" ]);