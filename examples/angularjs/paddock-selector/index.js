'use strict';

angular.module('farmbuild.soilSampleImporter.examples.paddockSelector', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    })

    .controller('PaddockSelectorCtrl', function ($scope, $log, soilSampleImporter, paddockSelector, validations,
            collections) {
        //$scope.paddockSelection = paddockSelector.createNew();
        $scope.paddockSelection = {};
        $scope.noResult = false;
        $scope.paddockColumnIndex = paddockSelector.paddockColumnIndex;
        $scope.classificationTypes = [];
        $scope.paddocks = paddockSelector.paddocks;
        $scope.myFarmData = soilSampleImporter.find();

        for(var i=0; i<paddockSelector.types.length;i++) {
            var newClassificication = {};
            newClassificication.name=paddockSelector.types[i].name;
            $scope.classificationTypes.push(newClassificication);
        }

        $scope.changeClassification = function (paddockSelection, colIndex, classificationType, oldValueString) {
            if (!(validations.isEmpty(oldValueString))) {
                $log.info('removing previously selected classificationType '+oldValueString);
                //oldValue is string literal of previous value
                var prevClassification = JSON.parse(oldValueString);
                paddockSelector.declassifyColumn(paddockSelection, prevClassification, colIndex);
            }
            if (!(validations.isEmpty(classificationType))) {
                $log.info('adding newly selected classificationType '+classificationType + " to col "+colIndex);
                paddockSelector.classifyColumn(paddockSelection, classificationType, colIndex);
            }
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

        $scope.loadSoilSample = function ($fileContent) {
            try {
                var csv = d3.csv.parseRows($fileContent);
                for(var i=0; i<csv.length; i++) {
                    if (i==0) {
                        csv[i].splice(0, 0, "PaddockName");
                    }
                    else {
                        csv[i].splice(0, 0, '-1');
                    }
                }
                $log.info(csv);
                var header = csv.shift();
                $scope.paddockSelection = paddockSelector.createNew(header,
                    csv, 0);
                if (!$scope.paddockSelection) {
                    $scope.noResult = true;
                }

            } catch (e) {
                console.error('farmbuild.soilSampleImporter.loadsample > load: Your file should be in csv format: ', e);
                $scope.noResult = true;
            }
        }

        $scope.export = function (paddockSelection) {

            $scope.result = paddockSelector.save(paddockSelection);

            if ($scope.result) {
                soilSampleImporter.export(document, $scope.result);
            }
            else {
                $scope.noResult = true;
            }

        };
    })

    .directive('onReadFile', function ($parse, $log) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    //var file =  (onChangeEvent.srcElement || onChangeEvent.target).files[0]
                    var file =  (onChangeEvent.target).files[0]
                    $log.info('onReadFile.onChange... onChangeEvent.srcElement:%s, ' +
                        'onChangeEvent.target:%s, (onChangeEvent.srcElement || onChangeEvent.target).files[0]: %s',
                        onChangeEvent.srcElement, onChangeEvent.target,
                        file)

                    var reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        //console.log('reader.onload', angular.toJson(onLoadEvent));
                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadEvent.target.result});
                        });
                    };
                    reader.onerror = function (onLoadEvent) {
                        //console.log('reader.onload', angular.toJson(onLoadEvent));
                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);

                });
            }
        };
    });