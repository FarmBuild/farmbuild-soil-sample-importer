angular.module('farmbuild.soilSampleImporter').
    constant('importFieldDefaults', {
        "types": [
            {"name": "Sample Id", "soilClassificationName" : undefined, "hasAverage":false},
            {"name": "Sample Name", "soilClassificationName" : undefined, "hasAverage":false},
            {"name": "pH H2O (Water)", "soilClassificationName" : "pH H2O (Water)", "hasAverage":true},
            {"name": "Olsen Phosphorus (mg/kg)", "soilClassificationName" : "Olsen Phosphorus (mg/kg)", "hasAverage":true},
            {"name": "PBI", "soilClassificationName" : "PBI", "hasAverage":true},
            {"name": "KCl 40 Sulphur (mg/kg)", "soilClassificationName" : "KCl 40 Sulphur (mg/kg)", "hasAverage":true},
            {"name": "Colwell Phosphorus (mg/kg)", "soilClassificationName" : "Colwell Phosphorus (mg/kg)", "hasAverage":true},
            {"name": "Colwell Potassium (mg/kg)", "soilClassificationName" : "Colwell Potassium (mg/kg)", "hasAverage":true},
            {"name": "Exch Potassium (meq/100g)", "soilClassificationName" : "Exch Potassium (meq/100g)", "hasAverage":true}
        ]
    });
