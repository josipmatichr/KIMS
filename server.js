'use strict'

const Net = require('net'),
	debug = require('debug')('server'); // set DEBUG=server

const Constants = {
	TYPE_INIT: 0,
	TYPE_CLIENT_JOINED: 1,
	TYPE_CLIENT_LEFT: 2,
	TYPE_KEY_AGREE_PROT: 3
}

let HOST = '0.0.0.0',
	PORT = 6968,
	CLIENTS = [];

const utils = (() => {
	const crypto = require('crypto');

	let hex2dec = (hexx) => {
		let hex = hexx.toString(),
			str = '',
			dec = 0;
		for (let i = 0; i < hex.length; i += 2) {
			dec = parseInt(hex.substr(i, 2), 16) % 25;
			if (dec >= 0 && dec <= 9) {
				dec += 48;
				str += String.fromCharCode(dec);
			}
		}
		return str;
	}

	return {
		getID: () => 'ID' + hex2dec(crypto.randomBytes(30).toString('hex'))
	}
})();

const server = Net.createServer((socket) => {
	socket.on('data', (data) => {
		const msg = JSON.parse(data);
		switch (msg.type) {
			case Constants.TYPE_KEY_AGREE_PROT: // 3 = public key agreement protocol 
				sendTo(socket, msg.to, data);
				break;

			default:
				// Client already registered with the server.            	
				if (socket.nickname) {
					broadcast(socket, data);
					// Client not yet registered its nickname.						
				} else {
					socket.nickname = JSON.parse(data).nickname;
					broadcast(socket, JSON.stringify({
						type: Constants.TYPE_CLIENT_JOINED, // 1 = new client joined
						clientID: socket.clientID,
						nickname: socket.nickname
					}));
					printClients();
				}
		}
	}).on('error', function (error) {
		debug('ERROR ' + error.stack);
		deleteClient(socket);
	}).on('end', function () {
		deleteClient(socket);
	}).on('close', function () {
		debug('SOCKET CLOSED');
	});
}).listen(PORT, HOST, () => {
	debug('Server listening on ' + server.address().address + ':' + server.address().port);
}).on('connection', (socket) => {
	debug('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
	const clientID = utils.getID();
	socket.clientID = clientID;
	CLIENTS = CLIENTS.concat([socket]);
	const date = new Date();
	const timestamp = Date.UTC(
		date.getFullYear(),
		date.getMonth(),
		date.getDay(),
		date.getHours(),
		date.getMinutes() + new Date().getTimezoneOffset(),
		date.getSeconds(),
		date.getMilliseconds());

	socket.write(JSON.stringify({
		type: Constants.TYPE_INIT, // 0 = init message
		clientID: clientID,
		nickname: 'SERVER@FESB',
		timestamp: timestamp,
		content: 'Welcome to CHAT@FESB!',
		clients: getOtherClients(socket)
	}));
}).on('error', (err) => {
	debug(err);
});

function broadcast(sender, msg) {
	debug('BROADCAST: ' + msg);

	var buffer = msg.toString();

	var pos = buffer.search("content\"\:\"");
	debug("Pozicija je: " + pos);
	if (pos != -1) {
		var dio_stringa = buffer.substring(pos, buffer.length);
		debug("Poruka je: " + dio_stringa);
		var sadrzaj = dio_stringa.substring(10, dio_stringa.length - 34);
		debug("Sadrzaj je:" + sadrzaj);
			var block1 = sadrzaj.slice(0,16);
			var block2 = sadrzaj.slice(16,32);
			var block3 = sadrzaj.substring(32);
			debug ("vrijednost blokova " , block1)
			debug ("vrijednost blokova " , block2)
			debug ("vrijednost blokova " , block3)
			var druga_poruka = block1 + block2 + block3;
			buffer = buffer.replace(sadrzaj, druga_poruka);
			msg = buffer;
	}
	let i = 0;
	CLIENTS.forEach((client) => {
		if (client.clientID && client !== sender) {
			debug((i += 1) + '. SENDING: ' + sender.clientID + ' --> ' + client.clientID);
			client.write(msg);
		}
	});
}

function sendTo(sender, receiver, msg) {
	debug('SEND TO: ' + msg);
	CLIENTS.some((client) => {
		if (client.clientID && client.clientID == receiver) {
			debug('SENDING: ' + sender.clientID + ' --> ' + client.clientID);
			client.write(msg);
			return true;
		}
	});
}

function deleteClient(client) {
	const index = CLIENTS.indexOf(client);
	if (index > -1) {
		debug('DELETING clientID: ' + client.clientID);
		CLIENTS.splice(index, 1);
		broadcast(client, JSON.stringify({
			type: Constants.TYPE_CLIENT_LEFT, // 2 = client left
			clientID: client.clientID
		}));
		printClients();
	}
}

function printClients() {
	debug('CLIENTS:');
	let i = 0;
	CLIENTS.forEach((client) => {
		debug((i += 1) + '. ' + client.remoteAddress + ':' + client.remotePort + ' (id: ' + client.clientID + ', nickname: ' + client.nickname + ')');
	});
}

function getOtherClients(receiver) {
	let clients = {}
	CLIENTS.forEach((client) => {
		if (client.clientID &&
			client.nickname &&
			client !== receiver) {
			clients[client.clientID] = { nickname: client.nickname };
		}
	})
	return clients;
}

function a2hex(str) {
  var arr = [];
  for (var i = 0, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
}