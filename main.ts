const CENTER_IR = DigitalPin.P15;
const LEFT_IR = DigitalPin.P14;
const RIGHT_IR = DigitalPin.P13;

pins.setPull(CENTER_IR, PinPullMode.PullNone);
pins.setPull(LEFT_IR, PinPullMode.PullNone);
pins.setPull(RIGHT_IR, PinPullMode.PullNone);

function rovne(speed = 130) {
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -speed);
    PCAmotor.MotorRun(PCAmotor.Motors.M1, speed);
}

function doprava(speed: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M4, speed); // 143 - normal; 180 - fast; 110 - slow;
    PCAmotor.MotorRun(PCAmotor.Motors.M1, speed);
}

function doleva(speed: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -speed); // 143 - normal; 180 - fast; 110 - slow;
    PCAmotor.MotorRun(PCAmotor.Motors.M1, -speed);
}

let krizovatkaDoprava = false;

radio.onReceivedValue(function (r_name, r_value) {
    if (r_name == "right" && r_value == 1) {
        krizovatkaDoprava = true;
    }
})

basic.forever(function () {
    let left_black = (0 ^ pins.digitalReadPin(LEFT_IR)) == 0 ? false : true;
    let ctr_black = (0 ^ pins.digitalReadPin(CENTER_IR)) == 0 ? false : true;
    let rig_black = (0 ^ pins.digitalReadPin(RIGHT_IR)) == 0 ? false : true;

    if (left_black && rig_black) {
        if (krizovatkaDoprava) doprava(180);
        else rovne(110);
        
        krizovatkaDoprava = false;
    }
    else if (rig_black) doprava(180);
    else if (left_black) doleva(180);
    else rovne(220);

    basic.pause(5);
})