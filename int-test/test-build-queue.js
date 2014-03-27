#!/usr/bin/env node

/**
 * The config module can only be initialized once,
 * so we need multiple test files which are each
 * executed by tap.
 */
var path = require('path');

var tap = require('tap');

var config = require('../lib/config');

var configFiles = [
  path.join(__dirname, '../', 'config/default.js'),
  path.join(__dirname, '../', 'config/developer.js')
];

config.init({
  "config-files": configFiles.join(','),
});

console.log(config);

var buildQueue = require('../lib/build_queue');
var log = {
  debug: function() {console.log(arguments);},
  info: function() {console.log(arguments);},
  warn: function() {console.log(arguments);},
  error: function() {console.log(arguments); }
};
//require('../test/common/mock_log');

tap.test("Build queue controls execution of building per manifest", function(test) {
  config.withConfig(function(config) {

    var state1;
    buildQueue('state1', config, log, function(finishedCb) {
      test.equal(state1, undefined, 'This is the first piece of work to run');
      state1 = 1;
      finishedCb();
    });
    buildQueue('state1', config, log, function(finishedCb) {
      test.equal(state1, 1, 'This is the second piece of work to run');
      state1 = 2;
      finishedCb();
    });
    buildQueue('state1', config, log, function(finishedCb) {
      test.equal(state1, 2, 'This is the third piece of work to run');
      state1 = 3;
      finishedCb();
    });
    buildQueue('state1', config, log, function(finishedCb) {
      test.equal(state1, 3, 'This is the third piece of work to run');
      state1 = 4;
      finishedCb();
      test.end();
    });
  });
});

tap.test("Build queue handles multiple manifest urls", function(test) {
  config.withConfig(function(config) {
    var state1;
    var state2;
    var state3;
    test.equal(state1, undefined);
    buildQueue('state1', config, log, function(finishedCb) {
      setTimeout(function() {
        test.equal(state1, undefined, 'This is the first piece of state1 work to run');
        state1 = 1;
        setTimeout(function() {
          finishedCb();
        }, 300);
      }, 100);
    });
    buildQueue('state2', config, log, function(finishedCb) {
      test.equal(state2, undefined, 'This is the first piece of state2 work to run');
      state2 = 1;
      finishedCb();
    });
    buildQueue('state3', config, log, function(finishedCb) {
      setTimeout(function() {
        test.equal(state3, undefined, 'This is the first piece of state3 work to run');
        state3 = 3;
        finishedCb();
        // BEWARE: putting test.end here as this happens 500 millis in, fragile...
        console.log('Calling test.end');
        test.end();
        setTimeout(function() {
          process.exit(0);
        }, 1000);
      }, 500);
    });
    buildQueue('state1', config, log, function(finishedCb) {
      test.equal(state1, 1, 'This is the second piece of state1 work to run');
      state1 = 2;
      finishedCb();
    });
    buildQueue('state2', config, log, function(finishedCb) {
      test.equal(state2, 1, 'This is the second piece of state2 work to run');
      state2 = 2;
      finishedCb();
    });
    buildQueue('state1', config, log, function(finishedCb) {
      test.equal(state1, 2, 'This is the third piece of state1 work to run');
      state1 = 3;
      finishedCb();
    });
  });
});