'use strict';

/**
 * AngularJS is popular JavaScript MVC framework which is developed by google.
 * In this example we use AngularJS to construct the structure of the client side application.
 * You can find out more about AngularJS at https://angularjs.org
 * In farmbuild project we have used AngularJS as an internal dependency to provide modular structure, but to use FarmBuild JavaScript libraries you are forced to use AngularJS.
 * All the api function are available via "farmbuild" namespace (eg: farmbuild.webmapping, farmbuild.nutrientcalculator).
 * If you are using AngularJS in your application you can consume farmbuild component as AngularJS modules, similar to this example.
 */
 
 /**
 * Defining my application and passing 'farmbuild.soilSampleImporter' as a dependency to be injected.
 */
angular.module('farmbuild.soilSampleImporter.examples.paddockSelector', ['farmbuild.soilSampleImporter'])
	/**
	 * "run" method is executed before any other function in application, so I am putting my initial configs here.
	 */
    .run(function ($rootScope) {
        /**
	    * Optional version number for sake of this example (not part of the webmapping api)
		*/
        $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    })
    
	/**
	 * controller is where I put the logic of my application
	 */
    .controller('PaddockSelectorCtrl', function ($scope, $log, soilSampleImporter, importFieldSelector,validations,
            collections) {
		/**
		 * Defining variables on the $scope
		 */
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

        /**
         * Add/Change classification type for a given column
         * @param {object} importFieldsSelection - temporary object to hold data during soil import process.
         * @param {number} colIndex CSV files column index
         * @param {object} importFieldDefinition new import field the column should be classified in to
         * @param {string} oldValueString old import field name the column should be disconnected from
         */
        $scope.changeClassification = function (importFieldsSelection, colIndex, importFieldDefinition, oldValueString) {
          /**
           * Remove any previous classification
           */
            if (!(validations.isEmpty(oldValueString))) {
                $log.info('removing previously selected importFieldDefinition '+oldValueString);
                //oldValue is string literal of previous value
                var prevClassification = JSON.parse(oldValueString);
                /**
                 * Remove previous associations
                 */
                importFieldSelector.declassifyColumn(importFieldsSelection, prevClassification, colIndex);
                $scope.classifiedColumns[colIndex]=undefined;
            }

          /**
           * If the new importFieldDefinition is not empty classify the column in concern to the new importFieldDefinition
           */
            if (!(validations.isEmpty(importFieldDefinition))) {
                $log.info('adding newly selected importFieldDefinition '+importFieldDefinition + " to col "+colIndex);
                importFieldSelector.classifyColumn(importFieldsSelection, importFieldDefinition, colIndex);
                $scope.classifiedColumns[colIndex]=importFieldDefinition;
            }
            $scope.valid = importFieldSelector.validate(importFieldsSelection);
        }


        /**
         * Auto link the columns to importFieldDefinition based on the text column header value
         * @param {object} importFieldDefinition new import field the column should be classified in to
         */
        $scope.autoLink = function(importFieldsDefinition) {

            var colIndex = importFieldsDefinition.results.columnHeaders.indexOf($scope.selectedColumn);

            if (colIndex<0) {
                return;
            }
            /**
             * Link the given column to the given import field definition
             */
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

    /**
     * Change the paddock name selection for a given row
     * @param paddockSelection
     * @param rowIndex
     * @param paddock
     * @param oldValueString
     */
        $scope.changePaddock = function (paddockSelection, rowIndex, paddock, oldValueString) {
          /**
           * If a paddock name has been already selected for the row in concern remove it
           */
            if (!(validations.isEmpty(oldValueString))) {
                $log.info('removing previously selected paddock '+oldValueString);
                //oldValue is string literal of previous paddock value
                var prevPaddock = JSON.parse(oldValueString);
                importFieldSelector.disconnectRow(paddockSelection, prevPaddock, rowIndex);
                $scope.connectedRows[rowIndex]='';
            }
          /**
           * Change to new paddock name for the given row index
           */
            if (!(validations.isEmpty(paddock))) {
                $log.info('adding newly selected paddock '+paddock + " to row "+rowIndex);
                importFieldSelector.connectRow(paddockSelection, paddock, rowIndex);
                $scope.connectedRows[rowIndex]=paddock;
            }
            $scope.valid = importFieldSelector.validate(paddockSelection);
        }


      /**
         * Parse the CSV file been uploaded and get the intermediate object which represents the data in the CSV file
         * @param $fileContent
         */
        $scope.loadSoilSample = function ($fileContent) {
            try {
                var csv = d3.csv.parseRows($fileContent);
                var header = csv.shift();
                $scope.paddockSelection = importFieldSelector.createNew($scope.myFarmData, header, csv, 0);
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

    /**
     * Export the classified FarmData as a json
     * @param paddockSelection
     */
        $scope.export = function (paddockSelection) {

            $scope.result = importFieldSelector.save($scope.myFarmData, paddockSelection);
            if ($scope.result) {
                soilSampleImporter.export(document, $scope.result);
            }
            else {
                $scope.noResult = true;
            }
          /**
           * Send API usage statistics to GoogleAnalytics. In this example the client name is 'farmbuild-test-client'
           */
          soilSampleImporter.ga.trackSoilSampleImporter('farmbuild-test-client');

        };
    })

    /**
     * Handle the CSV file import.
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
    
    /**
     * A custom AngularJS filter
     * A filter formats the value of an expression for display to the user. 
     * They can be used in view templates, controllers or services and it is easy to define your own filter.
     * Read more about filter at: https://docs.angularjs.org/guide/filter
    */
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
