angular.module('farmbuild.soilSampleImporter.examples', ['farmbuild.soilSampleImporter'])

  .run(function ($rootScope) {
    $rootScope.appVersion = farmbuild.examples.soilsampleimporter.version;
    $rootScope.decimalPrecision = farmbuild.examples.soilsampleimporter.decimalPrecision;
  })

  .controller('FarmCtrl', function ($scope, $log, soilSampleImporter) {

//    var load = false;
//    if (location.href.split('?').length > 1 && location.href.split('?')[1].indexOf('load') === 0) {
//      load = (location.href.split('?')[1].split('=')[1] === 'true');
//    }

    $scope.farmData = {};

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

        $scope.prettyContent = JSON.stringify(farmData,null,"    ");
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

    $scope.calculate = function () {
      $log.info('calculate...');
      var farmData = soilSampleImporter.calculate($scope.farmData);

      updateFarmData($scope, farmData);

      soilSampleImporter.ga.trackCalculate('AgSmart');
    };

    $scope.clear = function () {
      $scope.farmData ={};
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
      if(!farmData) {
        $log.error('Failed to load milkSold data...');
        $scope.noResult = true;
        return;
      }
      $scope.farmData = farmData;
//      $scope.balance = farmData.soilSampleImporter.balance;
//      $scope.efficiency = farmData.soilSampleImporter.efficiency;
//      $scope.feedBalance = farmData.soilSampleImporter.feedBalance;
//      $scope.milkProduction = farmData.soilSampleImporter.milkProduction;
//      $scope.stockingRate = farmData.soilSampleImporter.stockingRate;

    }
//    $scope.file;
//
//    $scope.loadFile =  function (file) {
//      $log.info('loadFile...');
//      var reader = new FileReader();
//
//      reader.onload = function (onLoadEvent) {
//        console.log('loadFile... onload, %s', onLoadEvent);
//      };
//
//      reader.onerror = function (onLoadEvent) {
//        console.log('loadFile... onerror', angular.toJson(onLoadEvent));
//      };
//
//      reader.onloadstart = function(onLoadEvent) {
//        console.log('loadFile... onloadstart, %s', onLoadEvent);
//      };
//
//      reader.onloadend = function(onLoadEvent) {
//        console.log('loadFile... onloadend, %s, %j, ', onLoadEvent, onLoadEvent.target.result);
//        $scope.loadFarmData(onLoadEvent.target.result);
//        $scope.$apply()
//      };
//
//      reader.readAsText(file);
//    }
//
//
//    $scope.readFile = function(onChangeEvent) {
//      $log.info('readFile... onChangeEvent');
//      $scope.file = (onChangeEvent.srcElement || onChangeEvent.target).files[0];
//      $scope.$apply()
//
////      var reader = new FileReader();
////      reader.onload = function (onLoadEvent) {
////        $log.info('readFile... onLoadEvent');
////        $scope.loadFarmData(onLoadEvent.target.result);
////        $scope.$apply()
////      };
////      reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
//    };

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