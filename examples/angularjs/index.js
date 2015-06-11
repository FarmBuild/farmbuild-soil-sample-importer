angular.module('farmbuild.soilSampleImporter.examples', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
        $rootScope.decimalPrecision = farmbuild.examples.soilsampleimporter.decimalPrecision;
    })

    .controller('FarmCtrl', function ($scope, $log, soilSampleImporter) {

        $scope.farmData = {};
        $scope.paddocks = [];
        $scope.paddockFieldNames = [];
        $scope.managementZones = [];

        $scope.loadFarmData = function ($fileContent) {
            $log.info('FarmCtrl>>loadFarmData>>start');

            try {
                $scope.farmData = {};
                var farmData = soilSampleImporter.load(angular.fromJson($fileContent));
                $log.info('FarmCtrl>>loadFarmData');
                if (!angular.isDefined(farmData)) {
                    $scope.noResult = true;
                    return;
                }

                updateFarmData($scope, farmData);
                $scope.prettyContent = JSON.stringify(farmData, null, "    ");
            } catch (e) {
                console.error('farmbuild.soilSampleImporter.examples > load: Your file should be in json format: ', e);
                $scope.noResult = true;
            }
        };

        $scope.exportFarmData = function (farmData) {
            var url = 'data:application/json;charset=utf8,' + encodeURIComponent(JSON.stringify(farmData, undefined, 2));
            window.open(url, '_blank');
            window.focus();
        };

        $scope.getPaddockClassification = function(paddockName, key) {
            if (soilSampleImporter.hasClassification(key)) {
                //TODO: retrieve average result for a paddock
                var paddockAverage = {
                    "Sample Id": 20,
                    "Sample Name": "p3 sample1",
                    "pH H2O (Water)": 0.3,
                    "Olsen Phosphorus (mg/kg)": 12.12,
                    "PBI": 22,
                    "KCl 40 Sulphur (mg/kg)": null,
                    "Colwell Phosphorus (mg/kg)": 10,
                    "Colwell Potassium (mg/kg)": 10
                };

                var range = soilSampleImporter.classifyResult(paddockAverage, key);
                return range;
            }
            return "N/A";
        }

        $scope.getPaddockAverage = function(paddockName, key) {
            if (soilSampleImporter.hasAverage(key)) {
                var result = 1.1;
                return result;
            }
            return "N/A";
        }

        $scope.calculate = function () {
            $log.info('calculate...');

            updateFarmData($scope, farmData);

            soilSampleImporter.ga.trackCalculate('AgSmart');
        };

        $scope.clear = function () {
            $scope.farmData = {};
            soilSampleImporter.farmdata.session.clear();
            var path = location.href.toString(),
                path = path.substring(0, path.indexOf('?'));
            location.href = path;
        }

        if (soilSampleImporter.session.isLoadFlagSet(location)) {
            var farmData = soilSampleImporter.find();

            updateFarmData($scope, farmData);
        }

        function updateFarmData($scope, farmData) {
            if (!farmData) {
                $log.error('Failed to load milkSold data...');
                $scope.noResult = true;
                return;
            }
            $scope.farmData = farmData;
            $scope.paddocks = farmData.paddocks;
            $scope.paddockFieldNames = farmData.soils.sampleResults.importFieldNames;
            $scope.managementZones = farmData.managementZones;
        }

    })

    .directive('onReadFile', function ($parse, $log) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    //var file =  (onChangeEvent.srcElement || onChangeEvent.target).files[0]
                    var file = (onChangeEvent.target).files[0]
                    $log.info('onReadFile.onChange... onChangeEvent.srcElement:%s, ' +
                        'onChangeEvent.target:%s, (onChangeEvent.srcElement || onChangeEvent.target).files[0]: %s',
                        onChangeEvent.srcElement, onChangeEvent.target,
                        angular.toJson(file))

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