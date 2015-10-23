angular.module('farmbuild.soilSampleImporter.examples', ['farmbuild.soilSampleImporter'])

    .run(function ($rootScope) {
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
        $rootScope.decimalPrecision = farmbuild.examples.soilsampleimporter.decimalPrecision;
    })

    .controller('FarmCtrl', function ($scope, $log, soilSampleImporter) {

        $scope.farmData = {};
        $scope.paddocks = [];
        $scope.paddockFieldNames = [];
        $scope.paddockGroups = [];
        $scope.paddockGroupFieldNames = [];

    /**
     * This is called when a file is been uploaded through the example page "Choose File" button.
     * will evaluate the uploaded file to see if it is a valid FarmData json.
     * @param $fileContent
     */
        $scope.loadFarmData = function ($fileContent) {
            $log.info('FarmCtrl>>loadFarmData>>start');
          /**
           * Send API usage statistics to GoogleAnalytics. In this example the client name is 'farmbuild-test-client'
           */
            soilSampleImporter.ga.trackSoilSampleImporter('farmbuild-test-client');
            try {
                $scope.farmData = {};
              /**
               * Load given file data in to session if it is a valid FarmData json. If invalid FarmData will return undefined.
               */
                var farmData = soilSampleImporter.load(angular.fromJson($fileContent));
                $log.info('FarmCtrl>>loadFarmData');
              /**
               * If FarmData is invalid the returned value will be undefined.
               */
                if (!angular.isDefined(farmData)) {
                    $scope.noResult = true;
                    return;
                }
              /**
               * If FarmData is defined update the $scope variable FarmData values
               */
                updateFarmData($scope, farmData);
                $scope.prettyContent = JSON.stringify(farmData, null, "    ");
            } catch (e) {
                console.error('farmbuild.soilSampleImporter.examples > load: Your file should be in json format: ', e);
                $scope.noResult = true;
            }
        };

        /**
         * Export the FarmData which is already in session as a json file
         * @param FarmData
         */
        $scope.exportFarmData = function (farmData) {
            var url = 'data:application/json;charset=utf8,' + encodeURIComponent(JSON.stringify(farmData, undefined, 2));
            window.open(url, '_blank');
            window.focus();
        };

        /**
         * Get object containing name,min,max,defaultColor for the given string key value of a import field name
         * @param sampleResult
         * @param key import field name string value (check API documnetation for more details)
         * @return {*}
         */
        $scope.getSampleResultClassification = function(sampleResult, key) {
            if (!sampleResult) {
                $log.info('avg result is undefined');
                return undefined;
            }
            /**
             * Check if the given import field has a classification associated with it. If so classify it.
             */
            if (soilSampleImporter.importField.hasClassification(key)) {
                var range = soilSampleImporter.soilClassification.classifyResult(sampleResult, key);
                return range;
            }
            return "N/A";
        }

        /**
         * Get average of values over soil samples results for a given paddock
         * @param FarmData
         * @param paddockName to average over
         * @return {array|*}
         */
        $scope.getPaddockAverage = function(farmData, paddockName) {
            return soilSampleImporter.paddockSoilSampleRetriever.averagesForPaddock(farmData, paddockName);
        }

        /**
         * Find average values over soil samples results for a given paddockGroup
         * @param farmData
         * @param paddockGroup
         * @return {*}
         */
        $scope.getPaddockGroupAverage = function (farmData, paddockGroup) {
            return soilSampleImporter.paddockGroups.averageForPaddockGroup(farmData, paddockGroup);
        }

      /**
       * Helper function to join array contents with comma
       */
        $scope.joinedPaddockNames = function(paddockNameArray){
          return paddockNameArray.join(", ");
        }

        $scope.calculate = function () {
            $log.info('calculate...');

            updateFarmData($scope, farmData);
          /**
           * Send API usage statistics to GoogleAnalytics. In this example the client name is 'farmbuild-test-client'
           */
            soilSampleImporter.ga.trackSoilSampleImporter('farmbuild-test-client');
        };


    /**
     * Clear the currently loaded FarmData from session
     */
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

    /**
     * Check if FarmData is valid and initialize required objects using it.
     * @param $scope
     * @param farmData
     */
        function updateFarmData($scope, farmData) {
            if (!farmData) {
                $log.error('Failed to load data...');
                $scope.noResult = true;
                return;
            }
            $scope.farmData = farmData;
            $scope.paddocks = farmData.paddocks;
            $scope.paddockFieldNames = farmData.soils.sampleResults.importFieldNames;
            $scope.paddockGroups = farmData.paddockGroups;

            /**
             * Initialize array having all paddock names for each paddockGroup
             * @type {Array}
             */
            $scope.paddockGroupFieldNames = [];
            var managementZoneFields = soilSampleImporter.importField.getPaddockGroupFields();
            for(var i=0; i<managementZoneFields.length; i++) {
                $scope.paddockGroupFieldNames.push(managementZoneFields[i].name);
            }

        }

    })

    /**
     * Handle file upload
     */
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