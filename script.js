//Require rtmidi library to recive\send midi message
var midi = require('midi'),
	gui = require("nw.gui").Window.get().show();

const portName = 'VMK188++'; //Midi port name

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
		value: 3452,
		size: 2
	},
	name: {
		value: 'VintageD',
		size: 16
	},
	midiChannel: {
		value: 1,
		size: 1
	},
	highResMidiEnable: {
		value: true,
		size: 1
	},
	analogMidiEnable: {
		value: false,
		size: 1
	},
	curveUnique: {
		value: true,
		size: 1
	},
	curveId: {
		value: 0,
		size: 1
	},
	curve: {
		value: 123,
		size: 48
	},
	split1_key: {
		value: 0,
		size: 1
	},
	split1_offset: {
		value: 0,
		size: 1
	},
	split2_key: {
		value: 0,
		size: 1
	},
	split2_offset: {
		value: 0,
		size: 1
	},
	pitch: new slider(),
	modulation: new slider(),
	pedal1: new pedal(),
	pedal2: new pedal(),
	pedal3: new pedal(),
	slider0: new slider(),
	slider1: new slider(),
	slider2: new slider(),
	slider3: new slider(),
	slider4: new slider(),
	slider5: new slider(),
	slider6: new slider(),
	slider7: new slider(),
	slider8: new slider(),
	rotator1: new slider(),
	rotator2: new slider(),
	rotator3: new slider(),
	rotator4: new slider(),
	rotator5: new slider(),
	rotator6: new slider(),
	rotator7: new slider(),
	rotator8: new slider(),
	button1: new button(),
	button2: new button(),
	button3: new button(),
	button4: new button(),
	button5: new button(),
	button6: new button(),
	button7: new button(),
	button8: new button(),
	dawbutton1: new button(),
	dawbutton2: new button(),
	dawbutton3: new button(),
	dawbutton4: new button(),
	dawbutton5: new button()
};

var functionInvmk = {};

functionInvmk['id'] = 100;
functionInvmk['name'] = 101;
functionInvmk['midiChannel'] = 102;
functionInvmk['highResMidiEnable'] = 103;
functionInvmk['analogMidiEnable'] = 104;


var midiConnect = {
	init: function() {
		console.log('await port');

		var response = false;

		var inputCount = this.input.getPortCount(),
			outputCount = this.output.getPortCount();

		for (var i = 0; i < inputCount; i++) {
			var curPortName = this.input.getPortName(i);

			if (curPortName === portName) {
				this.input.openPort(i);
				response = true;
				console.log('Open input: ' + curPortName);
			}

		}

		for (var i = 0; i < outputCount; i++) {
			var curPortName = this.output.getPortName(i);

			if (curPortName === portName) {
				this.output.openPort(i);
				response = true;
				console.log('Output input: ' + curPortName);
			}

		}

		this.input.ignoreTypes(false, false, false);

		return response;
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

function sendData(command, data) {

	//max command adress
	if (command > 65535) {
		alert('Command ' + command + ' not recognize!');
		return;
	}

	//2 byte command
	var command1 = (command & 0xF000) >> 12,
		command2 = (command & 0xF00) >> 8,
		command3 = (command & 0xF0) >> 4,
		command4 = command & 0xF;

	sendArray.push([0xF0, command1, command2]);
	sendArray.push([0xF0, command3, command4]);

	//1 byte data syze
	sendArray.push([0xF0, 0, 4]);

	//Data
	sendArray.push([0xF0, 0, 1]);
	sendArray.push([0xF0, 0, 2]);
	sendArray.push([0xF0, 0, 3]);
	sendArray.push([0xF0, 0, 4]);

	//End message action
	sendArray.push([0xF0, 1, 0xF7]);

	// sendSysexMessages();

}

window.onload = function() {

	if (midiConnect.init()) {
		console.log('Port init success');
	} else {
		alert('Port VMK188++ not found!');
	}

	midiConnect.input.ignoreTypes(false, false, false);

	midiConnect.input.on('message', function(deltaTime, message) {

		if (message[1] == 0 && message[2] == 1) {
			console.log('Transfer ok detect');
			sendSysexMessages();
		}

		console.log('m:' + message + ' d:' + deltaTime);

	});

	// Add listners
	$('#led1').on('click', function() {
		sendData(1, [1, 2, 3, 4]);
	});
	$('#led2').on('click', function() {
		sendData(2, [1, 2, 3, 4]);
	});
	$('#led3').on('click', function() {
		sendData(3, [1, 2, 3, 4]);
	});
	$('#led4').on('click', function() {
		sendData(4, [1, 2, 3, 4]);
	});


	$('#presetUpload').on('click', function() {
		//Перебираем все свойства пресетов
		for (var key in Preset) {
			if (!Preset.hasOwnProperty(key)) continue;

			var PresValue = Preset[key];

			if (functionInvmk[key] > 0) {

				console.log('yes');

			}

			if (PresValue.hasOwnProperty('value')) {

				add8bitToArray(PresValue);

			} else {

				for (var key2 in PresValue) {
					if (!PresValue.hasOwnProperty(key2)) continue;
					add8bitToArray(PresValue[key2]);
				}

			}

		}


	});


}