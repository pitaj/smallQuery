"use strict";

var fs = require("fs");
var chokidar = require("chokidar");
var server = require("http-server");

function compile(){

  var files = fs.readdirSync("tests/");

  var wrapper = {
    start: '<iframe src="../tests/',
    end: '"></iframe>'
  };

  var template = "" + fs.readFileSync("test/template.html");

  var out = files.map(function(fileName){
    return wrapper.start + fileName + wrapper.end;
  }).join("");

  out = template.replace("{{tests}}", out);

  fs.writeFileSync("test/index.html", out);

  console.log("Tests successfully compiled");

}

compile();

chokidar.watch('tests/', { ignored: /[\/\\]\./ }).on('all', function() {
  compile();
});

server.createServer().listen(8080);

console.log("Go to http://localhost:8080/test for tests");
