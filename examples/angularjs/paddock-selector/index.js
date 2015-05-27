'use strict';

angular.module('farmbuild.soilSampleImporter.examples.paddockSelector', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    })

    .controller('PaddockSelectorCtrl', function ($scope, $log, soilSampleImporter, paddockSelector) {
        $scope.paddockSelection = paddockSelector.createNew();

        $scope.paddockColumnIndex = paddockSelector.paddockColumnIndex;
        $scope.classificationTypes = paddockSelector.types;
        $scope.paddocks = paddockSelector.paddocks;

        $scope.calculate = function (paddockSelection) {
            $scope.result = paddockSelector.save(paddockSelection);
        };
    });
