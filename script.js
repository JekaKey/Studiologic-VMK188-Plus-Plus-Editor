//Require rtmidi library to recive\send midi message
var midi = require('midi');


var transferArray = new Array;

var sendArray = [];

function add8bitToArray(param) {

	var paramType = typeof(param.value);

	switch (paramType) {
		case 'number':

			for (var i = 0; i < param.size; i++) {
				transferArray.push(param.value);
			}

			break;
		case 'string':
			for (var i = 0; i < param.size; i++) {

				if (param.value[i])
					transferArray.push(param.value[i]);
				else
					transferArray.push(0);

			}
			break;
		case 'boolean':
			transferArray.push(param.value & 1);
			break;
		default:
			console.error('Unresolve params type: ' + paramType, param);
			break;
	}

}

//Settings for slider,rotator

function slider() {
	this.active = {
		value: 1,
		size: 1
	};
	this.reverse = {
		value: 0,
		size: 1
	};
	this.channel = {
		value: 0,
		size: 1
	};
	this.event = {
		value: 0,
		size: 1
	};
	this.min_out_value = {
		value: 0,
		size: 1
	};
	this.max_out_value = {
		value: 127,
		size: 1
	};
	this.reserved = {
		value: 0,
		size: 4
	};
}

//Setting for pedal

function pedal() {
	this.active = {
		value: 1,
		size: 1
	};
	this.behavior = {
		value: 0,
		size: 1
	};
	this.reverse = {
		value: 0,
		size: 1
	};
	this.channel = {
		value: 0,
		size: 1
	};
	this.event = {
		value: 0,
		size: 1
	};
	this.min_in_value = {
		value: 0,
		size: 2
	};
	this.max_in_value = {
		value: 3000,
		size: 2
	};
	this.min_out_value = {
		value: 0,
		size: 1
	};
	this.max_out_value = {
		value: 127,
		size: 1
	};
	this.reserved = {
		value: 0,
		size: 4
	};
}

//Settings for button

function button() {
	this.type = {
		value: 1,
		size: 1
	};
	this.behavior = {
		value: 1,
		size: 1
	};
	this.ccnum = {
		value: 1,
		size: 1
	};
	this.onvalue = {
		value: 0,
		size: 1
	};
	this.offvalue = {
		value: 0,
		size: 1
	};
	this.reserved = {
		value: 0,
		size: 5
	};
}

//Preset entity
var Preset = {
	id: {
		number: 1,
		value: 3452,
		size: 2
	},
	name: {
		number: 2,
		value: 'VintageD',
		size: 16
	},
	midiChannel: {
		number: 3,
		value: 1,
		size: 1
	},
	highResMidiEnable: {
		number: 4,
		value: true,
		size: 1
	},
	analogMidiEnable: {
		number: 5,
		value: false,
		size: 1
	},
	curve: {
		value: 123,
		size: 48
	},
	pitch: new slider(6),
	modulation: new slider(7),
	pedal1: new pedal(8),
	pedal2: new pedal(9),
	pedal3: new pedal(10),
	slider0: new slider(11),
	slider1: new slider(12),
	slider2: new slider(13),
	slider3: new slider(14),
	slider4: new slider(15),
	slider5: new slider(16),
	slider6: new slider(17),
	slider7: new slider(18),
	slider8: new slider(19),
	rotator1: new slider(20),
	rotator2: new slider(21),
	rotator3: new slider(22),
	rotator4: new slider(23),
	rotator5: new slider(24),
	rotator6: new slider(25),
	rotator7: new slider(26),
	rotator8: new slider(27),
	button1: new button(28),
	button2: new button(29),
	button3: new button(30),
	button4: new button(31),
	button5: new button(32),
	button6: new button(33),
	button7: new button(34),
	button8: new button(35),
	dawbutton1: new button(36),
	dawbutton2: new button(37),
	dawbutton3: new button(38),
	dawbutton4: new button(39),
	dawbutton5: new button(40)
};

var midiConnect = {
	init: function() {
		console.log('await port');
	},
	output: new midi.output(),
	input: new midi.input()
};

// Send a MIDI message.

function sendSysexMessages() {

	if (sendArray.length > 0) {
		var sendingMessage = sendArray[0];
		//Delete sending message
		sendArray.splice(0, 1);
		console.log('Will be send message: ' + sendingMessage);
		midiConnect.output.sendMessage(sendingMessage);

	} else {
		sendArray = [];
		console.log('Transfer finish');
	}

};

window.onload = function() {

	require("nw.gui").Window.get().show();

	midiConnect.init();

	console.log('Port name: ' + midiConnect.output.getPortName(1));

	midiConnect.output.openPort(1);
	midiConnect.input.openPort(1);

	midiConnect.input.ignoreTypes(false, false, false);

	midiConnect.input.on('message', function(deltaTime, message) {

		if (message[1] == 4) {
			console.log('Transfer ok detect');
			sendSysexMessages();
		}
		// console.log('m:' + message + ' d:' + deltaTime);

	});

	//Перебираем все свойства пресетов
	for (var key in Preset) {
		if (!Preset.hasOwnProperty(key)) continue;

		var PresValue = Preset[key];

		if (PresValue.hasOwnProperty('value')) {

			add8bitToArray(PresValue);

		} else {

			for (var key2 in PresValue) {
				if (!PresValue.hasOwnProperty(key2)) continue;
				add8bitToArray(PresValue[key2]);
			}

		}

	}


	// Add listners
	$('#presetUpload').on('click', function() {

		//2 byte - action
		sendArray.push([0xF0, 1, 2]);
		sendArray.push([0xF0, 0, 1]);
		// //1 byte data syze
		sendArray.push([0xF0, 0, 4]);
		// //Data
		sendArray.push([0xF0, 0, 1]);
		sendArray.push([0xF0, 0, 2]);
		sendArray.push([0xF0, 0, 3]);
		sendArray.push([0xF0, 0, 4]);

		//End message action
		sendArray.push([0xF0,1,0xF7]);

		sendSysexMessages();

		// midiConnect.output.sendMessage([144,1,2]);


	});

}