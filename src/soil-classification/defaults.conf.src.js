angular.module('farmbuild.soilSampleImporter').
    constant('soilClassificationDefaults', {
        "types": [
            {
                "name": "pH H2O (Water)",
                "ranges": [
                    {"name":"Very Acidic", "min":undefined, "max":5.2, "defaultColor": "#fffe03"},
                    {"name":"Acidic", "min":5.2, "max":5.5, "defaultColor": "#96cf4c"},
                    {"name":"Slightly Acidic", "min":5.5, "max":6.1, "defaultColor": "#96cf4c"},
                    {"name":"Neutral", "min":6.1, "max":undefined, "defaultColor": "#aba3cc"}
                ]
            },
            {
                "name": "Olsen Phosphorus (mg/kg)",
                "ranges": [
                    {"name":"Deficient", "min":undefined, "max":9, "defaultColor": "#fff6a6"},
                    {"name":"Marginal", "min":9, "max":14, "defaultColor": "#98d6ea"},
                    {"name":"Adequate", "min":14, "max":20, "defaultColor": "#9fba9b"},
                    {"name":"High", "min":20, "max":27, "defaultColor": "#ffbfdc"},
                    {"name":"Very High", "min":27, "max":undefined, "defaultColor": "#ff7573"}
                ]
            },
            {
                "name": "PBI",
                "ranges": [
                    {"name":"Very Sandy", "min":undefined, "max":15, "defaultColor": undefined},
                    {"name":"Sand, Sandy Loams", "min":15, "max":35, "defaultColor": undefined},
                    {"name":"Sandy/Silty Loams", "min":35, "max":70, "defaultColor": undefined},
                    {"name":"Sandy/Silty Clay Loams", "min":70, "max":140, "defaultColor": undefined},
                    {"name":"Clay Loams", "min":140, "max":280, "defaultColor": undefined},
                    {"name":"Clay Loams & Clay", "min":280, "max":840, "defaultColor": undefined},
                    {"name":"Volcanic Clay & Peat", "min":840, "max":undefined, "defaultColor": undefined}
                ]
            }
        ]
    });
