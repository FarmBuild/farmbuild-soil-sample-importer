'use strict';

angular.module('farmbuild.soilSampleImporter.examples.paddockSelector', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    })

    .controller('PaddockSelectorCtrl', function ($scope, $log, soilSampleImporter, importFieldSelector,validations,
            collections) {

        $scope.paddockSelection = {};
        $scope.noResult = false;
        $scope.paddockColumnIndex = 0;
        $scope.classificationTypes = [];
        $scope.paddocks = [];
        $scope.myFarmData = soilSampleImporter.find();
        $scope.classifiedColumns = [];
        $scope.valid = false;

        $scope.selectedColumn = '';
        $scope.connectedRows = [];
        var importFieldSelector= soilSampleImporter.importFieldSelector;

        for(var i=0; i<importFieldSelector.types.length;i++) {
            var newClassificication = {};
            newClassificication.name=importFieldSelector.types[i].name;
            $scope.classificationTypes.push(newClassificication);
        }

        function _findPaddockWithName(paddocks, name) {
            for(var i=0; i<paddocks.length; i++) {
                if (name== paddocks[i].name) {
                    return paddocks[i];
                }
            }
            return undefined;
        }

        $scope.changeClassification = function (paddockSelection, colIndex, classificationType, oldValueString) {
            if (!(validations.isEmpty(oldValueString))) {
                $log.info('removing previously selected classificationType '+oldValueString);
                //oldValue is string literal of previous value
                var prevClassification = JSON.parse(oldValueString);
                importFieldSelector.declassifyColumn(paddockSelection, prevClassification, colIndex);
                $scope.classifiedColumns[colIndex]=undefined;
            }
            if (!(validations.isEmpty(classificationType))) {
                $log.info('adding newly selected classificationType '+classificationType + " to col "+colIndex);
                importFieldSelector.classifyColumn(paddockSelection, classificationType, colIndex);
                $scope.classifiedColumns[colIndex]=classificationType;
            }
            $scope.valid = importFieldSelector.validate(paddockSelection);
        }

        $scope.autoLink = function(importFieldsDefinition) {

            var colIndex = importFieldsDefinition.results.columnHeaders.indexOf($scope.selectedColumn);

            if (colIndex<0) {
                return;
            }

            importFieldSelector.autoLinkPaddock(importFieldsDefinition, colIndex);

            for(var i=0; i<$scope.connectedRows.length; i++) {
                $scope.connectedRows[i]= '';
            }

            var paddockKeys = Object.keys(importFieldsDefinition.paddockRowDictionary);
            for(var i=0; i<paddockKeys.length; i++) {
                var indexArray = importFieldsDefinition.paddockRowDictionary[paddockKeys[i]];

                var paddock = _findPaddockWithName($scope.paddocks, paddockKeys[i]);

                for(var j=0; j<indexArray.length; j++) {
                    $scope.connectedRows[indexArray[j]] = paddock;
                }
            }

            $scope.selectedColumn = '';

        }

        $scope.changePaddock = function (paddockSelection, rowIndex, paddock, oldValueString) {
            if (!(validations.isEmpty(oldValueString))) {
                $log.info('removing previously selected paddock '+oldValueString);
                //oldValue is string literal of previous paddock value
                var prevPaddock = JSON.parse(oldValueString);
                importFieldSelector.disconnectRow(paddockSelection, prevPaddock, rowIndex);
                $scope.connectedRows[rowIndex]='';
            }
            if (!(validations.isEmpty(paddock))) {
                $log.info('adding newly selected paddock '+paddock + " to row "+rowIndex);
                importFieldSelector.connectRow(paddockSelection, paddock, rowIndex);
                $scope.connectedRows[rowIndex]=paddock;
            }
        }

        $scope.loadSoilSample = function ($fileContent) {
            try {
                var csv = d3.csv.parseRows($fileContent);
                var header = csv.shift();
                $scope.paddockSelection = importFieldSelector.createNew($scope.myFarmData,
                    header,
                    csv, 0);
                if (!$scope.paddockSelection) {
                    $scope.noResult = true;
                    return;
                }
                $scope.paddocks = importFieldSelector.paddocks;
                for(var i=0; i<$scope.paddockSelection.results.columnHeaders.length; i++) {
                    $scope.classifiedColumns[i] = undefined;
                }

                for(var i=0; i<csv.length; i++) {
                    $scope.connectedRows[i]= '';
                }
            } catch (e) {
                console.error('farmbuild.soilSampleImporter.loadsample > load: Your file should be in csv format: ', e);
                $scope.noResult = true;
            }
        }

        $scope.export = function (paddockSelection) {

            $scope.result = importFieldSelector.save($scope.myFarmData, paddockSelection);
            if ($scope.result) {
                soilSampleImporter.export(document, $scope.result);
            }
            else {
                $scope.noResult = true;
            }
          soilSampleImporter.ga.trackSoilSampleImporter('AgSmart');

        };
    })

    .directive('onReadFile', function ($parse, $log) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    var file =  (onChangeEvent.target).files[0]
                    $log.info('onReadFile.onChange... onChangeEvent.srcElement:%s, ' +
                        'onChangeEvent.target:%s, (onChangeEvent.srcElement || onChangeEvent.target).files[0]: %s',
                        onChangeEvent.srcElement, onChangeEvent.target,
                        file)

                    var reader = new FileReader();

                    reader.onload = function (onLoadEvent) {

                        scope.$apply(function () {
                            fn(scope, {$fileContent: onLoadEvent.target.result});
                        });
                    };
                    reader.onerror = function (onLoadEvent) {

                    };

                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);

                });
            }
        };
    })
    .filter('excludeFrom', [function() {
        return function(array,expression1, expression2, comparator){
            //$log.info("expr "+expression);
            return array.filter(function(item) {
                if (expression1) {
                    for (var i = 0; i < expression1.length; i++) {
                        if (i!= expression2 && expression1[i] && angular.equals(expression1[i].name, item.name)) {
                            return false;
                        }
                    }
                }
                return true;
            });
        }
    }])

;