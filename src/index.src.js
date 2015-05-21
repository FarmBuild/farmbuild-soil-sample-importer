'use strict';

// Inject modules
angular.module('farmbuild.soilSampleImporter').run(function(soilSampleImporter){});

// Init api by instantiating angular module internally, users are not tied to angular for using farmbuild.
angular.injector(['ng', 'farmbuild.soilSampleImporter']);