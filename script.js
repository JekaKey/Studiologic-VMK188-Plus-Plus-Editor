//Require rtmidi library to recive\send midi message
var midi = require('midi');

//Settings for slider,rotator
function slider() {
	this.active = {value: 1, size: 1};
	this.reverse = {value: 0, size: 1};
	this.channel = {value: 0, size: 1};
	this.event = {value: 0, size: 1};
	this.min_in_value = {value: 0, size: 2};
	this.max_in_value = {value: 3000, size: 2};
	this.min_out_value = {value: 0, size: 1};
	this.max_out_value = {value: 127, size: 1};
	this.reserved = {value: 0, size: 5};
}

//Setting for pedal
function pedal() {
	this.active = {value: 1, size: 1};
	this.behavior = {value: 0, size: 1};
	this.reverse = {value: 0, size: 1};
	this.channel = {value: 0, size: 1};
	this.event = {value: 0, size: 1};
	this.min_in_value = {value: 0, size: 2};
	this.max_in_value = {value: 3000, size: 2};
	this.min_out_value = {value: 0, size: 1};
	this.max_out_value = {value: 127, size: 1};
	this.reserved = {value: 0, size: 5};
}

//Settings for button
function button() {
	this.type = {value: 1, size: 1};
	this.behavior = {value: 1, size: 1};
	this.ccnum = {value: 1, size: 1};
	this.onvalue = {value: 0, size: 1};
	this.offvalue = {value: 0, size: 1};
	this.reserved = {value: 0, size: 5};
}

//Preset entity
var Preset = {
	id: {value: 1, size: 1},
	name: {value: 'test', size: 16},
	midiChannel: {value: 1, size: 1},
	highResMidiEnable: {value: true, size: 1},
	analogMidiEnable: {value: true, size: 1},
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
	button1: new button,
	button2: new button,
	button3: new button,
	button4: new button,
	button5: new button,
	button6: new button,
	button7: new button,
	button8: new button,
	dawbutton1: new button,
	dawbutton2: new button,
	dawbutton3: new button,
	dawbutton4: new button,
	dawbutton5: new button
};

var midiConnect = {
	init: function () {
		console.log('await port');
	},
	output: new midi.output(),
	input: new midi.input()
}

// var midi = require('midi');

// // Set up a new input.
// var input = new midi.input();

// // Count the available input ports.
// input.getPortCount();

// // Get the name of a specified input port.
// input.getPortName(0);

// // Configure a callback.
// input.on('message', function(deltaTime, message) {
//   console.log('m:' + message + ' d:' + deltaTime);
// });

// Open the first available input port.
// input.openPort(0);
// var midi = require('midi');

// // Set up a new output.
// var output = new midi.output();

// // Count the available output ports.
// output.getPortCount();

// // Get the name of a specified output port.
// output.getPortName(0);

// // Open the first available output port.
// output.openPort(0);

// Send a MIDI message.



window.onload = function() {

	require("nw.gui").Window.get().show();

	var count = 0;

	//Перебираем все свойства пресетов
	for(var key in Preset) {
		if (!Preset.hasOwnProperty(key)) continue;
		
		var PresValue = Preset[key];

		//Если свойство найдено, то это свойства верхней категории
		if (PresValue.value) {
			count = count + PresValue.size;
		} else {

			for(var key2 in PresValue) {
				if (!PresValue.hasOwnProperty(key2)) continue;
				var PresValue2 = PresValue[key2];

				var test = PresValue2.size
				count = count + PresValue2.size;

			}

		}

	}

	console.log(count);


	// midiConnect.init();

	// //Add listners
	// $('#presetUpload').on('click', function() {
	// 	output.sendMessage([144,50,90]);
	// });

}