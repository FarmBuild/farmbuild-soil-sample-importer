'use strict';

angular.module('farmbuild.soilSampleImporter.examples.paddockSelector', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    })

    .controller('PaddockSelectorCtrl', function ($scope, $log, soilSampleImporter, paddockSelector) {
        $scope.paddockSelection = paddockSelector.createNew();

        $scope.paddockColumnIndex = paddockSelector.paddockColumnIndex;
        $scope.classificationTypes = [];
        $scope.paddocks = paddockSelector.paddocks;

        for(var i=0; i<paddockSelector.types.length;i++) {
            var newClassificication = {};
            newClassificication.label=paddockSelector.types[i].name;
            $scope.classificationTypes.push(newClassificication);
        }

        $scope.calculate = function (paddockSelection) {
            $scope.result = paddockSelector.save(paddockSelection);
        };
    });
