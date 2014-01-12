var gui = require("nw.gui").Window.get().show(),
    platform = require("os").platform,
    midi = require('midi'),
    swig = require('swig');

const portName = 'VMK188++'; //Midi port name

Array.prototype.pushChar = function (value, size) {

    var paramType = typeof(value);

    switch (paramType) {
        case 'number':

            for (var i = 0; i < size; i++) {
                var partValue = (value >> (8 * i)) & 0xFF;
                this.push(partValue);
            }

            break;
        case 'string':
            for (var i = 0; i < size; i++) {

                if (value[i])
                    this.push(value[i].charCodeAt(0));
                else
                    this.push(0);

            }
            break;
        case 'boolean':

            this.push(value & 1);

            break;
        default:
            console.error('Unresolve params type: ' + paramType, value);
            break;
    }
};

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
}

var midiConnect = {
    init: function () {
        var that = this;
        console.log('Search port...');

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

        if (response) {
            this.input.ignoreTypes(false, false, false);
            this.input.on('message', that.sysexInputEvent);
        }

        return response;
    },
    output: new midi.output(),
    input: new midi.input(),
    sysexPushCommand: function (command, data) {
        //max command adress
        if (command > 65535) {
            alert('Command ' + command + ' not recognize!');
            return;
        }

        //2 byte command
        var command4 = (command & 0xF000) >> 12,
            command3 = (command & 0xF00) >> 8,
            command2 = (command & 0xF0) >> 4,
            command1 = command & 0xF;

        this.sysexOutput.push([0xF0, command1, command2]);
        this.sysexOutput.push([0xF0, command3, command4]);

        //1 byte data size
        if (data && data.length > 0) {
            this.sysexOutput.push([0xF0, data.length & 0xF, (data.length >> 4) & 0xF]);
        }

        //Data
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                this.sysexOutput.push([0xF0, data[i] & 0xF, (data[i] >> 4) & 0xF]);
            }
        }

        //End message action
        this.sysexOutput.push([0xF0, 1, 0xF7]);

    },
    sysexInput: new Array(),
    sysexOutput: new Array(),
    sysexSend: function () {

        if (this.sysexOutput.length > 0) {
            var sendingMessage = this.sysexOutput[0];

            //Delete sending message
            this.sysexOutput.splice(0, 1);
            this.output.sendMessage(sendingMessage);

        } else {
            this.sysexOutput = [];
            console.log('Transfer finish');
            console.timeEnd('Command time');
        }
    },
    sysexInputEvent: function (deltaTime, message) {

        console.log('deltaTime:', deltaTime, message);

        if (message[1] == 0 && message[2] == 1) {
            midiConnect.sysexSend();
        }

    }
};

window.onload = function () {

    console.log(platform());

    if (midiConnect.init()) {
        console.log('Port init success');
    } else {
        alert('Port VMK188++ not found!');
    }

    $('body').html(swig.renderFile('./views/layout.swig'));

    window.calibration = {
        send: function () {
            var that = this,
                sendArray = [];

            //Update actual data
            $('#main-content .calibration input').each(function () {
                that.data[$(this).data('name')][$(this).data('type')] = Number($(this).val());
            });

            for (var key in this.data) {
//                sendArray.pushChar(Number(this.data[key]['min']), 2);
//                sendArray.pushChar(Number(this.data[key]['max']), 2);
            }
            console.time('Command time');
            midiConnect.sysexPushCommand(1);
            midiConnect.sysexSend();
        },
        "data": {
            "pedal1": {
                "name": "Pedal 1", "min": 2, "max": 20
            },
            "pedal2": {
                "name": "Pedal 2", "min": 2, "max": 20
            },
            "pedal3": {
                "name": "Pedal 3", "min": 2, "max": 20
            },
            "pitch": {
                "name": "Pitch", "min": 2, "max": 20
            },
            "modulation": {
                "name": "Modulation", "min": 2, "max": 20
            },
            "slider0": {
                "name": "Slider 0", "min": 2, "max": 20
            },
            "slider1": {
                "name": "Slider 1", "min": 2, "max": 20
            },
            "slider2": {
                "name": "Slider 2", "min": 2, "max": 20
            },
            "slider3": {
                "name": "Slider 3", "min": 2, "max": 20
            },
            "slider4": {
                "name": "Slider 4", "min": 2, "max": 20
            },
            "slider5": {
                "name": "Slider 5", "min": 2, "max": 20
            },
            "slider6": {
                "name": "Slider 6", "min": 2, "max": 20
            },
            "slider7": {
                "name": "Slider 7", "min": 2, "max": 20
            },
            "slider8": {
                "name": "Slider 8", "min": 2, "max": 20
            },
            "rotator1": {
                "name": "Rotator 1", "min": 2, "max": 20
            },
            "rotator2": {
                "name": "Rotator 2", "min": 2, "max": 20
            },
            "rotator3": {
                "name": "Rotator 3", "min": 2, "max": 20
            },
            "rotator4": {
                "name": "Rotator 4", "min": 2, "max": 20
            },
            "rotator5": {
                "name": "Rotator 5", "min": 2, "max": 20
            },
            "rotator6": {
                "name": "Rotator 6", "min": 2, "max": 20
            },
            "rotator7": {
                "name": "Rotator 7", "min": 2, "max": 20
            },
            "rotator8": {
                "name": "Rotator 8", "min": 2, "max": 20
            }
        }};

//Button event
    $('#main-nav a').on('click', function (e) {

        var butName = $(this).data('name');
        $('#main-content').html(swig.renderFile('./views/' + butName + '.swig', ((window[butName] != undefined) ? window[butName] : '')));

    });

}

//window.onload = function () {
//
//    if (midiConnect.init()) {
//        console.log('Port init success');
//    } else {
//        alert('Port VMK188++ not found!');
//    }
//
//    midiConnect.input.ignoreTypes(false, false, false);
//
//    midiConnect.input.on('message', function (deltaTime, message) {
//
//        if (message[1] == 0 && message[2] == 1) {
//            // console.log('Transfer ok detect');
//            sendSysexMessages();
//        }
//
//        //console.log('m:' + message + ' d:' + deltaTime);
//
//    });
//
//    // Add listners
//    $('#led1').on('click', function () {
//        sendData(1, [1, 192, 240]);
//        sendSysexMessages();
//    });
//    $('#led2').on('click', function () {
//        sendData(2, [50]);
//        sendSysexMessages();
//    });
//    $('#led3').on('click', function () {
//        sendData(3, [70]);
//        sendSysexMessages();
//    });
//    $('#led4').on('click', function () {
//        sendData(4, [240]);
//        sendSysexMessages();
//
//
//    });
//
//    $('#colibrationUpload').on('click', function () {
//        //Flush array
//        transferArray = [];
//
//        sendData(1);
//
//        sendData(4);
//
//        sendSysexMessages();
//
//    });
//
//    $('#presetUpload').on('click', function () {
//
//        //Flush array
//        transferArray = [];
//
//        //Перебираем все свойства пресетов
//        for (var key in Preset) {
//            if (!Preset.hasOwnProperty(key)) continue;
//
//            var PresValue = Preset[key];
//
//            if (PresValue.hasOwnProperty('value')) {
//
//                add8bitToArray(PresValue);
//
//            } else {
//
//                for (var key2 in PresValue) {
//                    if (!PresValue.hasOwnProperty(key2)) continue;
//                    add8bitToArray(PresValue[key2]);
//                }
//
//            }
//
//        }
//
//        sendData(1);
//        //Load 1 preset
//        sendData(100);
//
//        for (var i = 0; i < transferArray.length; i++) {
//
//            var buf = 1,
//                adress = i;
//
//            if (i > 255) {
//                buf = 2;
//                adress = adress & 0xFF;
//            }
//
//            sendData(101, [buf, adress, transferArray[i]]);
//
//        }
//
//        //Save first preset
//        sendData(102);
//        sendData(2);
//
//        sendSysexMessages();
//
//    });
//
//
//}