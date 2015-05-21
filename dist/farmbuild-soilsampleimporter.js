"use strict";

angular.module("farmbuild.soilSampleImporter", [ "farmbuild.core", "farmbuild.farmdata" ]).factory("soilSampleImporter", function(soilSampleImporterSession, farmdata, validations, googleAnalyticsImporter, $log) {
    var soilSampleImporter = {
        farmdata: farmdata
    }, _isPositiveNumber = validations.isPositiveNumber, _isDefined = validations.isDefined;
    soilSampleImporter.version = "0.1.0";
    soilSampleImporter.ga = googleAnalyticsImporter;
    soilSampleImporter.session = soilSampleImporterSession;
    $log.info("Welcome to Farm Dairy Soil Sample Importer... " + "this should only be initialised once! why we see twice in the example?");
    function createDefault() {
        return {};
    }
    soilSampleImporter.find = function() {
        return soilSampleImporterSession.find();
    };
    soilSampleImporter.load = function(farmData) {
        var loaded = farmdata.load(farmData);
        if (!_isDefined(loaded)) {
            return undefined;
        }
        if (!loaded.hasOwnProperty("soilSampleImporter")) {
            loaded.soilSampleImporter = createDefault();
            loaded = farmdata.update(loaded);
        }
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

angular.module("farmbuild.soilSampleImporter").run(function(soilSampleImporter) {});

angular.injector([ "ng", "farmbuild.soilSampleImporter" ]);