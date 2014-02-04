#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
var optimist = require("optimist"),
  path = require("path"),
  fs = require("fs");

var frontController = require('../lib/front_controller');

var argv = optimist
  .usage('Usage: $0 {OPTIONS}')
  .wrap(80)
  .option('manifest', {
    alias: "m",
    desc: "The URL or path to the manifest"
  })
  .option('overideManifest', {
    desc: "The URL or path to the manifest"
  })
  .option('buildDir', {
    alias: "d",
    desc: "Use this directory as the temporary project directory",
    default: path.resolve(process.env.TMPDIR || process.cwd(), "app")
  })
  .option('cacheDir', {
    alias: "c",
    desc: "Use this directory as the directory to cache keys and apks"
  })
  .option('force', {
    alias: "f",
    desc: "Force the projects to be built every time, i.e. don't rely on cached copies",
    default: false,
    boolean: true
  })
  .option("output", {
    alias: "o",
    desc: "The output APK filename"
  })
  .option("debug", {
    desc: "Do not delete the project build directory",
    default: false,
    boolean: true
  })
  .option('help', {
    alias: "?",
    desc: "Display this message",
    boolean: true
  })
  .check(function(argv) {
    if (argv.help) {
      throw "";
    }

    if (!argv.manifest) {
      throw "Must specify a manifest location";
    }


    argv.buildDir = path.resolve(process.cwd(), argv.buildDir);

  })
  .argv;



var withConfig = require('../lib/config');

withConfig(function(config) {

  var manifestUrl = argv.overideManifest || argv.manifest;
  frontController(manifestUrl, argv.type, config, function(err, apk) {
    var output;
    if (!err) {
      if (argv.output) {
        output = path.resolve(process.cwd(), argv.output);
        console.log('Writing', output);
        fs.writeFile(output, apk.Body, {encoding: null}, function(err) {
          console.log(err);
        });
      } else {
        console.log(new Buffer(apk.Body).toString(null));
      }
    } else {
      console.error(err);
    }
  });
});