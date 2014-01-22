#!/usr/bin/env node

var tap = require('tap');

var valid = require('../lib/owa_validator');

process.env['FILESYSTEM_BUILD'] = '/tmp/test';

tap.test("A minimal valid manifest passes", function(test) {
  test.ok(valid({
    name: 'Foomatic 5000'
  }));
  test.end();
});

tap.test("A minimal valid manifest passes", function(test) {
  test.ok(valid({
    "name":"Test App (deltron3030)",
    "description":"This app has been automatically generated by testmanifest.com",
    "version":"1.0",
    "icons":{
      "16":"http://testmanifest.com/icon-16.png",
      "48":"http://testmanifest.com/icon-48.png",
      "128":"http://testmanifest.com/icon-128.png"
    },
    "installs_allowed_from":[
      "*"
    ],
    "developer":{
      "name":"Gregory Koberger",
      "url":"http://gkoberger.net"
    }
  }));
  test.end();
});

tap.test("A packaged app manifest passes", function(test) {
  test.ok(valid({
    "name" : "FbImport",
    "version" : "1.0a1",
    "size" : 172496,
    "release_notes": "first release!!!",
    "package_path": "/~fdesre/openwebapps/fbowd.zip",
    "developer": {
      "name": "Telefonica",
      "url": "http://www.tid.es"
    },
    "locales": {
      "en-US": {
        "name": "FbImport",
        "description": "Social Network"
      },
      "es": {
        "name": "FbImport",
        "description": "Red Social"
      },
      "fr": {
        "name": "Horloge",
        "description": "Horloge Gaia"
      },
      "pt-BR": {
        "name": "Rel\u00f3gio",
        "description": "Rel\u00f3gio do Gaia"
      }
    }
  }));
  test.end();
});

tap.test("A malformed manifest is rejected", function(test) {
  test.equal(valid({
    foo: "bar"
  }), false);
  test.end();
});


tap.test("A packaged app with absolute URI is rejected", function(test) {
  test.ok(valid({
    "name" : "FbImport",
    "package_path": "http://example.com/~fdesre/openwebapps/fbowd.zip"
  }));
  
  test.end();
});