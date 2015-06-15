module.exports = function(config){
  config.set({

    basePath : '',

    files : [
      'bower_components/farmbuild-core/dist/farmbuild-core.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/farmbuild-farmdata/dist/farmbuild-farmdata.js',
      'src/soil-sample-importer.js',
      'src/session/index.src.js',
      'src/converter/index.src.js',
      'src/converter/validator.src.js',
      //'src/**/*.src.js',
      'src/ga/index.src.js',
        'src/soil-classification/types.src.js',
        'src/soil-classification/defaults.conf.src.js',
        'src/soil-classification/index.src.js',
        'src/import-field-selector/index.src.js',
        'src/import-field-selector/validator.src.js',
        'src/import-field-definition/defaults.conf.src.js',
        'src/import-field-definition/types.src.js',
        'src/import-field-definition/index.src.js',
      'src/paddock-soil-samples/index.src.js',
      'src/paddock-groups/validator.src.js',
      'src/paddock-groups/index.src.js',


      'src/index.src.js',
//      'src/collections/index.spec.js',
//      'src/ga/index.spec.js',
//      'src/converter/index.spec.js',
//      'src/converter/validator.spec.js',
//      'src/soil-classification/index.spec.js',
//      'src/soil-classification/types.spec.js',
        'src/blank.spec.js',//use this as a basis of creating your module test
        'src/session/index.spec.js',
      'src/**/*.spec.js',
      {pattern: 'examples/data/*.json'}
    ],

    autoWatch : true,
    frameworks: ['jasmine', 'fixture'],
    browsers : ['Chrome'],
    //logLevel: 'LOG_INFO', //this it NOT application log level, it's karma's log level.
    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-fixture',
            'karma-html2js-preprocessor',
            'karma-json-fixtures-preprocessor'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
    preprocessors: {
      '**/*.html'   : ['html2js'],
      '**/*.json': ['html2js']
    },
    jsonFixturesPreprocessor: {
      variableName: '__json__',
      // transform the filename 
      transformPath: function(path) {
        return path + '.js';
      }
    }

  });
};
