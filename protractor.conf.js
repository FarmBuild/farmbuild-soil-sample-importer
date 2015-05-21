var timeout = 60000;

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'examples/**/*.e2e.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000/examples/angularjs',

  resultJsonOutputFile: 'protractor.result',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: timeout
  },

  getPageTimeout: timeout,
  onPrepare: function() {
    // At this point, global variable 'protractor' object will be set up, and
    // globals from the test framework will be available. For example, if you
    // are using Jasmine, you can add a reporter with:
//   jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
//       'protractor/', true, true));

    // If you need access back to the current configuration object,
    // use a pattern like the following:
    //     browser.getProcessedConfig().then(function(config) {
    //       // config.capabilities is the CURRENT capability being run, if
    //       // you are using multiCapabilities.
    //       console.log('Executing capability', config.capabilities);
    //     });
  }
};
