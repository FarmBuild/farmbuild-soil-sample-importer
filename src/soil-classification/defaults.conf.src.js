angular.module('farmbuild.soilSampleImporter').
    constant('soilClassificationDefaults', {
        "types": [
            {
                "name": "pH H2O (Water)",
                "ranges": [
                    {
                        "name": ["Very Acidic", "Acidic", "Slightly Acidic", "Neutral"],
                        "min": [undefined, 5.2, 5.5, 6.1],
                        "max": [5.2, 5.5, 6.1, undefined],
                        "defaultColor": ["#fffe03", "#96cf4c", "#96cf4c", "#aba3cc"]
                    }
                ]
            },
            {
                "name": "Olsen Phosphorus (mg/kg)",
                "ranges": [
                    {
                        "name": ["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "min": [undefined, 9, 14, 20, 27],
                        "max":[9, 14, 20, 27,  undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    }
                ]
            },
            {
                "name": "PBI",
                "ranges": [
                    {
                        "name": ["Very Sandy", "Sand, Sandy Loams", "Sandy/Silty Loams", "Sandy/Silty Clay Loams", "Clay Loams", "Clay Loams & Clay", "Volcanic Clay & Peat"],
                        "min": [undefined, 15, 35, 70, 140, 280, 840],
                        "max": [15, 35, 70, 140, 280, 840, undefined],
                        "defaultColor": [undefined, undefined, undefined, undefined, undefined, undefined, undefined]
                    }
                ]
            },
            {
                "name" : "KCl 40 Sulphur (mg/kg)",
                "ranges": [
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "min": [undefined, 4.5, 7.5, 10.5, 14],
                        "max": [4.5, 7.5, 10.5, 14, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    }
                ]
            },
            {
                "name" : "Colwell Phosphorus (mg/kg)",
                "ranges": [
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[undefined], "max":[15], "defaultColor": [undefined]},
                        "min": [undefined, 15, 23, 30, 41],
                        "max": [15, 23, 30, 41, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name": ["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[15], "max":[35], "defaultColor": [undefined]},
                        "min": [undefined, 17, 26, 34, 47],
                        "max": [17, 26, 34, 47, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[35], "max":[70], "defaultColor": [undefined]},
                        "min": [undefined, 19, 30, 39, 53],
                        "max": [19, 30, 39, 53, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[70], "max":[140], "defaultColor": [undefined]},
                        "min": [undefined, 22, 35, 45, 61],
                        "max": [22, 35, 45, 61, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name": ["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name": ["PBI"], "min": [140], "max": [280], "defaultColor": [undefined]},
                        "min": [undefined, 26, 42, 54, 74],
                        "max": [26, 42, 54, 74, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[280], "max":[840], "defaultColor": [undefined]},
                        "min": [undefined, 37, 58, 75, 102],
                        "max": [37, 58, 75, 102, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[840], "max":[undefined], "defaultColor": [undefined]},
                        "min": [undefined, 50, 90, 120, 150],
                        "max": [50, 90, 120, 150, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    }
                ]
            },
            {
                "name" : "Colwell Potassium (mg/kg)",
                "ranges": [
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[undefined], "max":[35], "defaultColor": [undefined]},
                        "min": [undefined, 70, 120, 170, 230],
                        "max": [70, 120, 170, 230, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[35], "max":[70], "defaultColor": [undefined]},
                        "min": [undefined, 80, 130, 190, 250],
                        "max": [80, 130, 190, 250, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[70], "max":[280], "defaultColor": [undefined]},
                        "min": [undefined, 90, 130, 190, 260],
                        "max": [90, 130, 190, 260, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[280], "max":[undefined], "defaultColor": [undefined]},
                        "min": [undefined, 100, 150, 220, 280],
                        "max": [100, 150, 220, 280, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    }
                ]
            },
            {
                "name" : "Exch Potassium (meq/100g)",
                "ranges": [
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[undefined], "max":[35], "defaultColor": [undefined]},
                        "min": [undefined, 0.18, 0.31, 0.44, 0.6],
                        "max": [0.18, 0.31, 0.44, 0.6, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[35], "max":[70], "defaultColor": [undefined]},
                        "min": [undefined, 0.2, 0.33, 0.49, 0.64],
                        "max": [0.2, 0.33, 0.49, 0.64, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[70], "max":[280], "defaultColor": [undefined]},
                        "min": [undefined, 0.23, 0.33, 0.53, 0.66],
                        "max": [0.23, 0.33, 0.53, 0.66, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    },
                    {
                        "name":["Deficient", "Marginal", "Adequate", "High", "Very High"],
                        "dependencyRange": {"name":["PBI"], "min":[280], "max":[undefined], "defaultColor": [undefined]},
                        "min": [undefined, 0.26, 0.39, 0.56, 0.72],
                        "max": [0.26, 0.39, 0.56, 0.72, undefined],
                        "defaultColor": ["#fff6a6", "#98d6ea", "#9fba9b", "#ffbfdc", "#ff7573"]
                    }
                ]
            }
        ]
    });
