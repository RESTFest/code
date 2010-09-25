// Import dependencies
var utils=require('utils');
var sys=require('sys');
var url=require('url');
var libxml=require('libxmljs');
var match=require('./match');
var mazeMediaType = "application/vnd.amundsen.maze+xml; charset=utf-8"

/**
 * Always returns an array of three, e.g. "text", "html", "charset = utf-8; lang = en"
 */
parseMediaType = function (mediaType) {
    if (mediaType == undefined) {
      return [,,];
    }
    var semicolon = mediaType.indexOf(";");
    return [
      // "application"
      mediaType.substring(0,mediaType.indexOf("/")).trim(),
      // "atom+xml"
      mediaType.substring(
        mediaType.indexOf("/")+1,
        semicolon == -1
          ? undefined
          : semicolon
      ).trim(),
      // "charset=utf-8" etc. or ""
      (semicolon == -1)
         ? ""
         : mediaType.substring(semicolon + 1).trim()
    ];
}


function get(someuri) {
  nextUri = someuri;
  process.nextTick(tick);
}

get(process.argv[2]);

var responseMatcher = match.Match(
     ['status',200,'application', 'vnd.amundsen.maze+xml' ,String, Object], function(some,data) {
        var body = "";
        data.r.on('data',function(newdata) {
          // todo: extract encoding from header
          body = body + newdata.toString('utf8');
        });
        data.r.on('end', function () {
          var doc = libxml.parseXmlString(body);
          // If we find no links, nothing to do :-/

          // store current state in "agent" somewhere
          // current state is:  all outgoing directions.
          var findLink = function(doc, direction) {
            var attr = doc.find('/maze/*/link[@rel="' + direction + '"]/@href')[0];
            if (attr) return attr.text();
            return undefined;
          }
          var agent = new Object();
          agent.current = findLink(doc, 'current');
          agent.start = findLink(doc, 'start');
          agent.exit= findLink(doc, 'exit');
          agent.north = findLink(doc, 'north');
          agent.east = findLink(doc, 'east');
          agent.west  = findLink(doc, 'west');
          agent.south = findLink(doc, 'south');
          // process new links in a new tick?
          newState(agent);
        });
     },
     ['status', 302, , , , Object], function ( a, a, a, data) {
       console.log("HTTP Redirect to " + data.r.headers["location"]);
       get(data.r.headers["location"]);
       // perhaps not
     },
     ['status', Number, String, String , , ], function(responseCode, mediaType, mediaSubtype) {
       console.log("Panic!  HTTP " + responseCode + ", media type: " + mediaType + "/" + mediaSubtype + ".  Aborting...");
     },
     function(unknown) {
       console.log("I don't understand this: " + (typeof(unknown)));
       console.log("I don't understand this: " + unknown);
     }
);


var state;
var history = new Object();
var directions = ['north', 'east', 'south', 'west'];

function newState(agent) {
  state = agent;
  process.nextTick(algorithm);
}

function algorithm() {
//  console.log("New state!");
//  console.log(state);
  if (state.exit) {
    console.log("I found the maze exit.  node.js rocks!");
    return; // since it doesn't do anything, the program will exit.
  }
  startDirection = 0; // north
  // If I previously navigated a direction, try to keep going "left"
  if (history.navigate != undefined) {
    startDirection = (history.navigate - 1) % directions.length;
    console.log("I was going " +directions[history.navigate]); 
  }
  for (var i = 0; i < directions.length; i++) {
    if (state[directions[i + startDirection]]) {
      history.navigate = i + startDirection % directions.length;
      console.log("\n***************************************************************\n************* " + history.navigate + ": " + directions[history.navigate] + "\n" + state[directions[history.navigate]]);
      get(state[directions[history.navigate]]);
      return;
    }
  }
  if (state.start) {
    console.log("I found the maze entrance.  Going in!!!");
    get(state.start);
    return;
  }
  console.log("I couldn't find my way out :-(");
}


var http      = require('http');
function tick() {
  console.log("going to " + nextUri);
  var uri = url.parse(nextUri);
  nextUri = null;
  var client= http.createClient(uri.port ? uri.port : 80, uri.hostname);
  var maze      = client.request('GET', uri.pathname, {
                  "Host": uri.hostname,
                  "Accept": mazeMediaType
                });
  maze.end();
  maze.on('response', function(response) {
    var mt = parseMediaType(response.headers["content-type"]);
    responseMatcher( [ 'status', response.statusCode, mt[0], mt[1], mt[2], {'r':response} ]);
  });
}


