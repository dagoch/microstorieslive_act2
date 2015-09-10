// test peer.js data connections
// this is a daemon that reads a data file containing kinect osc data, and sends it out over a webrtc data 
// channel to any registered peers

var testKinectData = require('./kinecttestdata.json');

console.log("starting");
window = global;
location = {protocol: 'http'};

var peer_id = null;

console.log("require socket.io client");
var io = require('socket.io-client');  //this has to be here; when it is later in the script (after peerjs loads) it causes a Seg Fault
if (!(typeof Socket === 'undefined')) { console.log("Socket = "+Socket); }

console.log("require XMLHttpRequest");
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

console.log("require wrtc");
var wrtc = require("wrtc");
RTCPeerConnection = wrtc.RTCPeerConnection;
RTCSessionDescription = wrtc.RTCSessionDescription;
RTCIceCandidate = wrtc.RTCIceCandidate;
console.log("require ws");

WebSocket = require('ws');
console.log("ws done");

if (!(typeof Socket === 'undefined')) { console.log("Socket = "+Socket); }

console.log("require peerjs");
require('./peerjs/lib/exports.js');

console.log(" peerjs done");
console.log("Socket = "+Socket);



var peer = new Peer({key: 'uohu08l7r6swcdi'}, {'debug':3});
var dataConnections = [];  // array of all data connections from browser peers
console.log("Get an ID from the PeerJS server");

				peer.on('open', function(id) {
				  console.log('My peer ID is: ' + id);
				  peer_id = id;
				   if (socket != null) {  // we just got peer, but socket is already connected, so send peer id
					 console.log('socket already connected, sending peer id: '+peer_id);
					 socket.emit('kinect_peer_id', peer_id);
				   }
				});

				peer.on('error', function(err){
					console.log("Got peer error: "+err);
				});	

			peer.on('connection', function(dataConnection) { 
				// add this data connection to the list of client connections
				dataConnections.push(dataConnection);
				console.log("Now have "+dataConnections.length+" connections: "+dataConnections);


				dataConnection.on('error',function(err){
					console.log("data connection error: "+err);
				});
				dataConnection.on('open',function(){
					console.log("data connection opened");
					console.log(" try sending kinect data");
					// dataConnection.send(testKinectData);
					dataConnection.send("sending test string");
				});

				if (dataConnection.open) {
					console.log("data connection is open");
				}


			});



console.log("try io.connect");

socket = io.connect('http://localhost:8080');

console.log("done");

				socket.on('connect', function() {
					console.log("test_datachannel: Socket Connected");
					if (peer_id != null) {
						console.log('sending peer id: '+peer_id);
						socket.emit('kinect_peer_id', peer_id);
					}
				});







