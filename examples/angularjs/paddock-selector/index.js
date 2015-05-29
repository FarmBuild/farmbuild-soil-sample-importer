'use strict';

angular.module('farmbuild.soilSampleImporter.examples.paddockSelector', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    })

    .controller('PaddockSelectorCtrl', function ($scope, $log, soilSampleImporter, paddockSelector, validations) {
        $scope.paddockSelection = paddockSelector.createNew();

        $scope.paddockColumnIndex = paddockSelector.paddockColumnIndex;
        $scope.classificationTypes = [];
        $scope.paddocks = paddockSelector.paddocks;


        for(var i=0; i<paddockSelector.types.length;i++) {
            var newClassificication = {};
            newClassificication.label=paddockSelector.types[i].name;
            $scope.classificationTypes.push(newClassificication);
        }

        $scope.changePaddock = function (paddockSelection, rowIndex, paddock, oldValueString) {

            if (!(validations.isEmpty(oldValueString))) {
                $log.info('removing previously selected paddock '+oldValueString);
                //oldValue is string literal of previous value
                var prevPaddock = JSON.parse(oldValueString);
                paddockSelector.disconnectRow(paddockSelection, prevPaddock, rowIndex);
            }
            if (!(validations.isEmpty(paddock))) {
                $log.info('adding newly selected paddock '+paddock + " to row "+rowIndex);
                paddockSelector.connectRow(paddockSelection, paddock, rowIndex);
            }
        }


        $scope.save = function (paddockSelection) {

            $scope.result = paddockSelector.save(paddockSelection);
        };
    });
