# FarmBuild Soil Sample Importer

This is the soil sample importer module of farm build JavaScript library.


## Getting Started

To get you started use the navigation on the left side of this page to explore different function of soil sample importer.


## Units
In all calculations we are using metric units.

## Exception handling
All functions return undefined in case that there is an error related to wrong input values.

## Google Analytics for tracking API usage
DEDJTR wants to understand the usage of the API, so please include the below API when you call calculate function.
The track API calls GA using its own tracking name so you can embedded in your application even though you already have
GA implementation.

Example
```
//Calling the calculate API
farmbuild.soilSampleImporter.calculate(farmData);
var organisationName = 'Spatial Vision';
//Calling the track API for the usage
farmbuild.soilSampleImporter.ga.trackSoilSampleImporter(organisationName);
```

