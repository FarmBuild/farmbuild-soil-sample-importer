angular.module('farmbuild.soilSampleImporter').
    constant('importFieldDefaults', {
        "types": [
            {"name": "Paddock Id", "soilClassificationName" : undefined},
            {"name": "Paddock Name", "soilClassificationName" : undefined},
            {"name": "pH H2O (Water)", "soilClassificationName" : "pH H2O (Water)"},
            {"name": "Olsen Phosphorus (mg/kg)", "soilClassificationName" : "Olsen Phosphorus (mg/kg)"},
            {"name": "PBI", "soilClassificationName" : "PBI"},
            {"name": "KCl 40 Sulphur (mg/kg)", "soilClassificationName" : "KCl 40 Sulphur (mg/kg)"},
            {"name": "Colwell Phosphorus (mg/kg)", "soilClassificationName" : "Colwell Phosphorus (mg/kg)"},
            {"name": "Colwell Potassium (mg/kg)", "soilClassificationName" : "Colwell Potassium (mg/kg)"}
        ]
    });
