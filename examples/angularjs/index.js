/**
 * AngularJS is popular JavaScript MVC framework which is developed by google.
 * In this example we use AngularJS to construct the structure of the client side application.
 * You can find out more about AngularJS at https://angularjs.org
 * In farmbuild project we have used AngularJS as an internal dependency to provide modular structure, but to use FarmBuild JavaScript libraries you are not forced to use AngularJS.
 * All the api function are available via "farmbuild" namespace (eg: farmbuild.webmapping, farmbuild.nutrientcalculator).
 * Have a look at the jQuery example section to understand more on how to use farmbuild api without directly. (https://github.com/FarmBuild/farmbuild-dairy-nutrient-calculator/tree/master/examples/jquery)
 * If you are using AngularJS in your application you can consume farmbuild component as AngularJS modules, similar to this example.
 */
 
  /**
 * Defining my application. Passing 'farmbuild.soilSampleImporter' as the dependecy.
 */
angular.module('farmbuild.soilSampleImporter.examples', ['farmbuild.soilSampleImporter'])
	/**
	 * In AngularJS Every application has a single root scope.
	 * All other scopes are descendant scopes of the root scope.
	 * Scopes provide separation between the model and the view, via a mechanism for watching the model for changes.
	 * They also provide an event emission/broadcast and subscription facility.
	 * See the AngularJS developer guide on scopes.
	 * https://docs.angularjs.org/guide/scope
	 */
	 
 	/**
	 * "run" method is executed before any other function in application, so we are putting my initial configs here.
	 */
    .run(function ($rootScope) {
        /**
	    * Optional version number for sake of this example (not part of the webmapping api)
		*/
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
        
		/**
		 * normalising the way we round numbers, this variable is used in html template
		 */
        $rootScope.decimalPrecision = farmbuild.examples.soilsampleimporter.decimalPrecision;
    })

    /**
	 * "controller" is where we put the logic of my application
	 */
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
     * directives are markers on a DOM element (such as an attribute,
	 * element name, comment or CSS class) that tell AngularJS's HTML compiler ($compile) to attach a specified behavior to that DOM element (e.g. via event listeners),
	 * or even to transform the DOM element and its children
	 * visit https://docs.angularjs.org/guide/directive for more information
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
