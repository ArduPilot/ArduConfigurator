//'use strict';

const SERVO_OUT_0 = 0,
    SERVO_AILERON_NUM = 1,
    SERVO_ELEVATOR_NUM = 2,
    SERVO_THROTTLE_NUM = 3,
    SERVO_RUDDER_NUM = 4,
    SERVO_FLAPPERON_1_NUM = 5,
    SERVO_FLAPPERON_2_NUM = 6,
    SERVO_OUT_7 = 7,
    SERVO_OUT_8 = 8,
    
    SERVO_BICOPTER_RIGHT = 5,
    SERVO_DUALCOPTER_LEFT = 4,
    SERVO_DUALCOPTER_RIGHT = 5,
    SERVO_SINGLECOPTER_1 = 3,
    SERVO_SINGLECOPTER_2 = 4,
    SERVO_SINGLECOPTER_3 = 5,
    SERVO_SINGLECOPTER_4 = 6;

const INPUT_STABILIZED_ROLL = 0,
    INPUT_STABILIZED_PITCH = 1,
    INPUT_STABILIZED_YAW = 2,
    INPUT_STABILIZED_THROTTLE = 3,
    INPUT_RC_ROLL = 4,
    INPUT_RC_PITCH = 5,
    INPUT_RC_YAW = 6,
    INPUT_RC_THROTTLE = 7,
    INPUT_RC_AUX1 = 8,
    INPUT_RC_AUX2 = 9,
    INPUT_RC_AUX3 = 10,
    INPUT_RC_AUX4 = 11,
    INPUT_GIMBAL_PITCH = 12,
    INPUT_GIMBAL_ROLL = 13,
    INPUT_FEATURE_FLAPS = 14;

    // see    getServoMixInputNames: function () { for where teh dropdown is populated im mixer
    //these are ardupilot "servo functions"
    const  SERVO_Disabled  = 0;
    const  SERVO_RCPassThru  = 1;
    const  SERVO_Flap  = 2;
    const  SERVO_FlapAuto  = 3;
    const  SERVO_Aileron  = 4;
    const  SERVO_MountPan  = 6;
    const  SERVO_MountTilt  = 7;
    const  SERVO_MountRoll  = 8;
    const  SERVO_MountOpen  = 9;
    const  SERVO_CameraTrigger  = 10;
    const  SERVO_Mount2Pan  = 12;
    const  SERVO_Mount2Tilt  = 13;
    const  SERVO_Mount2Roll  = 14;
    const  SERVO_Mount2Open  = 15;
    const  SERVO_DifferentialSpoilerLeft1  = 16;
    const  SERVO_DifferentialSpoilerRight1  = 17;
    const  SERVO_Elevator  = 19;
    const  SERVO_Rudder  = 21;
    const  SERVO_SprayerPump  = 22;
    const  SERVO_SprayerSpinner  = 23;
    const  SERVO_FlaperonLeft  = 24;
    const  SERVO_FlaperonRight  = 25;
    const  SERVO_GroundSteering  = 26;
    const  SERVO_Parachute  = 27;
    const  SERVO_Gripper  = 28;
    const  SERVO_LandingGear  = 29;
    const  SERVO_EngineRunEnable  = 30;
    const  SERVO_Motor1  = 33;
    const  SERVO_Motor2  = 34;
    const  SERVO_Motor3  = 35;
    const  SERVO_Motor4  = 36;
    const  SERVO_Motor5  = 37;
    const  SERVO_Motor6  = 38;
    const  SERVO_Motor7  = 39;
    const  TailTiltServo  = 39;// alternate name for the same thing above
    const  SERVO_Motor8  = 40;
    const  SERVO_TiltMotorsFront  = 41;
    const  SERVO_TiltMotorsRear  = 45;
    const  SERVO_TiltMotorRearLeft  = 46;
    const  SERVO_TiltMotorRearRight  = 47;
    const  SERVO_RCIN1  = 51;
    const  SERVO_RCIN2  = 52;
    const  SERVO_RCIN3  = 53;
    const  SERVO_RCIN4  = 54;
    const  SERVO_RCIN5  = 55;
    const  SERVO_RCIN6  = 56;
    const  SERVO_RCIN7  = 57;
    const  SERVO_RCIN8  = 58;
    const  SERVO_RCIN9  = 59;
    const  SERVO_RCIN10  = 60;
    const  SERVO_RCIN11  = 61;
    const  SERVO_RCIN12  = 62;
    const  SERVO_RCIN13  = 63;
    const  SERVO_RCIN14  = 64;
    const  SERVO_RCIN15  = 65;
    const  SERVO_RCIN16  = 66;
    const  SERVO_Ignition = 67;
    const  SERVO_Starter  = 69;
    const  SERVO_Throttle  = 70;
    const  SERVO_ThrottleLeft  = 73;
    const  SERVO_ThrottleRight  = 74;
    const  SERVO_TiltMotorFrontLeft  = 75;
    const  SERVO_TiltMotorFrontRight  = 76;
    const  SERVO_ElevonLeft  = 77;
    const  SERVO_ElevonRight  = 78;
    const  SERVO_VTailLeft  = 79;
    const  SERVO_VTailRight  = 80;
    const  SERVO_Motor9  = 82;
    const  SERVO_Motor10  = 83;
    const  SERVO_Motor11  = 84;
    const  SERVO_Motor12  = 85;
    const  SERVO_DifferentialSpoilerLeft2  = 86;
    const  SERVO_DifferentialSpoilerRight2  = 87;
    const  SERVO_CameraISO  = 90;
    const  SERVO_CameraAperture  = 91;
    const  SERVO_CameraFocus  = 92;
    const  SERVO_CameraShutterSpeed  = 93;
    const  SERVO_Script1  = 94;
    const  SERVO_Script2  = 95;
    const  SERVO_Script3  = 96;
    const  SERVO_Script4  = 97;
    const  SERVO_Script5  = 98;
    const  SERVO_Script6  = 99;
    const  SERVO_Script7  = 100;
    const  SERVO_Script8  = 101;
    const  SERVO_Script9  = 102;
    const  SERVO_Script10  = 103;
    const  SERVO_Script11  = 104;
    const  SERVO_Script12  = 105;
    const  SERVO_Script13  = 106;
    const  SERVO_Script14  = 107;
    const  SERVO_Script15  = 108;
    const  SERVO_Script16  = 109;
    const  SERVO_NeoPixel1  = 120;
    const  SERVO_NeoPixel2  = 121;
    const  SERVO_NeoPixel3  = 122;
    const  SERVO_NeoPixel4  = 123;
    const  SERVO_RateRoll   = 124;
    const  SERVO_RatePitch  = 125;
    const  SERVO_RateThrust = 126;
    const  SERVO_RateYaw    = 127;
    const  SERVO_ProfiLED1  = 129;
    const  SERVO_ProfiLED2  = 130;
    const  SERVO_ProfiLED3  = 131;
    const  SERVO_ProfiLEDClock = 132;
    const  SERVO_SERVOn_MIN  = 134;
    const  SERVO_SERVOn_TRIM  = 135;
    const  SERVO_SERVOn_MAX  = 136;


const
    PLATFORM_UNKNOWN        = 0,
    PLATFORM_MULTIROTOR     = 1,
    PLATFORM_AIRPLANE       = 2,
    PLATFORM_HELICOPTER     = 3,
    PLATFORM_TRICOPTER      = 4,
    PLATFORM_ROVER          = 5,
    PLATFORM_BOAT           = 6,
    PLATFORM_ANTENNA        = 7,
    PLATFORM_PERIPH         = 8,
    PLATFORM_SUB            = 9,
    PLATFORM_OTHER          = 10;

// cut-n-pasted from https://ardupilot.org/copter/docs/parameters.html#frame-class july 2021
// values for FRAME_CLASS param.
const ardu_frame_classes = {
    0:	'Undefined',
    1:	'Quad',
    2:	'Hexa',
    3:	'Octa',
    4:	'OctaQuad',
    5:	'Y6',
    6:	'Heli',
    7:	'Tri',
    8:	'SingleCopter',
    9:	'CoaxCopter',
    10:	'BiCopter',
    11:	'Heli_Dual',
    12:	'DodecaHexa',
    13:	'HeliQuad',
    14:	'Deca',
    15:	'Scripting Matrix',
    16:	'6DoF Scripting'
};

//https://ardupilot.org/plane/docs/quadplane-frame-setup.html
const Qardu_frame_classes = {
    0:	'Undefined',
    1:	'Quad',
    2:	'Hexa',
    3:	'Octa',
    4:	'OctaQuad',
    5:	'Y6',
    7:	'Tri',
    10:	'Tailsitter',
};

// cut-n-pasted from https://ardupilot.org/copter/docs/parameters.html#frame-type july 2021
// values for FRAME_TYPE param.
const ardu_frame_types = {
    0:	'Plus',
    1:	'X',
    2:	'V',
    3:	'H',
    4:	'V-Tail',
    5:	'A-Tail',
    10:	'Y6B',
    11:	'Y6F',
    12:	'BetaFlightX',
    13:	'DJIX',
    14:	'ClockwiseX',
    15:	'I',
    18:	'BetaFlightXReversed',
    99: '' //use this for 'undefined' or 'unused'
    
};
const Qardu_frame_types = {
    1:	'X',
    2:	'V',
    3:	'H',
    11:	'Y6F',
    99: '' //use this for 'undefined' or 'unused'
    
};

// generate mixer, a mixER basically defines how many MOTORS and SERVOs you have and the 'range' of min/max/reverse/etc for each of these.
const mixerList = [
    {
        id: 1,
        name: 'Tricopter',
        model: 'tricopter',
        image: 'tri',
        enabled: true,
        legacy: true,
        platform: PLATFORM_TRICOPTER,
        frame_class: 'Tri', //FRAME_CLASS=7
        frame_type: '',  //FRAME_TYPE=???  buzz todo is -1 ok here?
        motorMixer: [
            // new MotorMixRule(1.0, 0.0, 1.333333, 0.0),     // REAR
            // new MotorMixRule(1.0, -1.0, -0.666667, 0.0),   // RIGHT
            // new MotorMixRule(1.0, 1.0, -0.666667, 0.0),    // LEFT
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(4 , SERVO_Motor4, 1000, 2000),
            new ServoMixRule(7,  TailTiltServo,1000, 2000), // aka Motor7 aka 39
        ]
    },            // 1
    {
        id: 3,
        name: 'Quad X',
        model: 'quad_x',
        image: 'quad_x',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Quad', //FRAME_CLASS=1
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            // new MotorMixRule(1.0, -1.0, 1.0, -1.0),          // REAR_R
            // new MotorMixRule(1.0, -1.0, -1.0, 1.0),          // FRONT_R
            // new MotorMixRule(1.0, 1.0, 1.0, 1.0),            // REAR_L
            // new MotorMixRule(1.0, 1.0, -1.0, -1.0),          // FRONT_L
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
        ]
    },               // 3
    {
        id: 2,
        name: 'Quad +',
        model: 'quad_plus',
        image: 'quad_p',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Quad', //FRAME_CLASS=1
        frame_type: 'Plus',  //FRAME_TYPE=0
        motorMixer: [
            // new MotorMixRule(1.0, 0.0, 1.0, -1.0),          // REAR
            // new MotorMixRule(1.0, -1.0, 0.0, 1.0),          // RIGHT
            // new MotorMixRule(1.0, 1.0, 0.0, 1.0),           // LEFT
            // new MotorMixRule(1.0, 0.0, -1.0, -1.0),         // FRONT
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
        ]
    },               // 2
    // {
    //     id: 4,
    //     name: 'Bicopter',
    //     model: 'custom',
    //     image: 'bicopter',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     motorMixer: [],
    //     servoMixer: []
    // },           // 4
    // {
    //     id: 5,
    //     name: 'Gimbal',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_OTHER,
    //     motorMixer: [],
    //     servoMixer: []
    // },               // 5
    {
        id: 6,
        name: 'Y6',
        model: 'y6',
        image: 'y6',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Y6', //FRAME_CLASS=5
        frame_type: 'X',  //X=1=Y6A. FRAME_TYPE=1  ( alternative could be 'Y6B'=10 FRAME_TYPE=10 )
        motorMixer: [
            // new MotorMixRule(1.0, 0.0, 1.333333, 1.0),      // REAR
            // new MotorMixRule(1.0, -1.0, -0.666667, -1.0),   // RIGHT
            // new MotorMixRule(1.0, 1.0, -0.666667, -1.0),    // LEFT
            // new MotorMixRule(1.0, 0.0, 1.333333, -1.0),     // UNDER_REAR
            // new MotorMixRule(1.0, -1.0, -0.666667, 1.0),    // UNDER_RIGHT
            // new MotorMixRule(1.0, 1.0, -0.666667, 1.0),     // UNDER_LEFT
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
            new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
            new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
        ]
    },                           // 6
    {
        id: 7,
        name: 'Hex +',
        model: 'hex_plus2',
        image: 'hex_p',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Hexa', //FRAME_CLASS=2
        frame_type: 'Plus',  //FRAME_TYPE=0
        motorMixer: [
            // new MotorMixRule(1.0, -0.866025, 0.5, 1.0),     // REAR_R
            // new MotorMixRule(1.0, -0.866025, -0.5, -1.0),   // FRONT_R
            // new MotorMixRule(1.0, 0.866025, 0.5, 1.0),      // REAR_L
            // new MotorMixRule(1.0, 0.866025, -0.5, -1.0),    // FRONT_L
            // new MotorMixRule(1.0, 0.0, -1.0, 1.0),          // FRONT
            // new MotorMixRule(1.0, 0.0, 1.0, -1.0),          // REAR
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
            new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
            new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
        ]
    },               // 7
    {
        id: 8,
        name: 'Flying Wing',
        model: 'flying_wing',
        image: 'flying_wing',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(1                 , SERVO_Throttle, 1000, 2000),
            new ServoMixRule(3                 , SERVO_ElevonLeft,  1000, 2000),
            new ServoMixRule(4                 , SERVO_ElevonRight, 1000, 2000),
        ]
    },     // 8
    {
        id: 9,
        name: 'Flying Wing with differential thrust',
        model: 'flying_wing',
        image: 'flying_wing_twomotors',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            // new MotorMixRule(1.0, 0.0, 0.0, 0.1),
            // new MotorMixRule(1.0, 0.0, 0.0, -0.1)
        ],
        servoMixer: [
            new ServoMixRule(1                 , SERVO_ThrottleLeft, 1000, 2000),
           // new ServoMixRule(SERVO_RUDDER_NUM, SERVO_Rudder, 1000, 2000),
            new ServoMixRule(2                 , SERVO_ThrottleRight, 1000, 2000),
            new ServoMixRule(3                 , SERVO_ElevonLeft,  1000, 2000),
            new ServoMixRule(4                 , SERVO_ElevonRight, 1000, 2000),
        ]
    },       // 9
    {
        id: 10,
        name: 'Hex X',
        model: 'hex_x2',
        image: 'hex_x',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Hexa', //FRAME_CLASS=2
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            // new MotorMixRule(1.0, -0.5, 0.866025, 1.0),     // REAR_R
            // new MotorMixRule(1.0, -0.5, -0.866025, 1.0),     // FRONT_R
            // new MotorMixRule(1.0, 0.5, 0.866025, -1.0),     // REAR_L
            // new MotorMixRule(1.0, 0.5, -0.866025, -1.0),     // FRONT_L
            // new MotorMixRule(1.0, -1.0, 0.0, -1.0),     // RIGHT
            // new MotorMixRule(1.0, 1.0, 0.0, 1.0),     // LEFT
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
            new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
            new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
        ]
    },                  // 10
    {
        id: 11,
        name: 'Octo X8', // 8 arms, not 4
        model: 'octo_x8',
        image: 'octo_x8',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Octa', //FRAME_CLASS=3
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            // new MotorMixRule(1.0, -1.0, 1.0, -1.0),          // REAR_R
            // new MotorMixRule(1.0, -1.0, -1.0, 1.0),          // FRONT_R
            // new MotorMixRule(1.0, 1.0, 1.0, 1.0),          // REAR_L
            // new MotorMixRule(1.0, 1.0, -1.0, -1.0),          // FRONT_L
            // new MotorMixRule(1.0, -1.0, 1.0, 1.0),          // UNDER_REAR_R
            // new MotorMixRule(1.0, -1.0, -1.0, -1.0),          // UNDER_FRONT_R
            // new MotorMixRule(1.0, 1.0, 1.0, -1.0),          // UNDER_REAR_L
            // new MotorMixRule(1.0, 1.0, -1.0, 1.0),          // UNDER_FRONT_L
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
            new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
            new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
            new ServoMixRule(7 , SERVO_Motor7, 1000, 2000),
            new ServoMixRule(8,  SERVO_Motor8, 1000, 2000), 
        ]
    },             // 11
    {
        id: 12,
        name: 'Octo +8',  // 8 arms, not 4
        model: 'octo_plus8',
        image: 'octo_plus8',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Octa', //FRAME_CLASS=3
        frame_type: 'Plus',  //FRAME_TYPE=0
        motorMixer: [
            // new MotorMixRule(1.0, 0.707107, -0.707107, 1.0),    // FRONT_L
            // new MotorMixRule(1.0, -0.707107, -0.707107, 1.0),    // FRONT_R
            // new MotorMixRule(1.0, -0.707107, 0.707107, 1.0),    // REAR_R
            // new MotorMixRule(1.0, 0.707107, 0.707107, 1.0),    // REAR_L
            // new MotorMixRule(1.0, 0.0, -1.0, -1.0),              // FRONT
            // new MotorMixRule(1.0, -1.0, 0.0, -1.0),              // RIGHT
            // new MotorMixRule(1.0, 0.0, 1.0, -1.0),              // REAR
            // new MotorMixRule(1.0, 1.0, 0.0, -1.0),              // LEFT
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
            new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
            new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
            new ServoMixRule(7 , SERVO_Motor7, 1000, 2000),
            new ServoMixRule(8,  SERVO_Motor8, 1000, 2000), 
        ]
    },     // 12
    {
        id: 13,
        name: 'Octo-Quad X8', // 8 motors,4 arms
        model: 'octo_quad_x8',
        image: 'tba',  // was octo_flat_x
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'OctaQuad', //FRAME_CLASS=4
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            // buzz todo this entire set of 8 mixers is probably wrong it was for a octo_flat_x
            // new MotorMixRule(1.0, 1.0, -0.414178, 1.0),      // MIDFRONT_L
            // new MotorMixRule(1.0, -0.414178, -1.0, 1.0),      // FRONT_R
            // new MotorMixRule(1.0, -1.0, 0.414178, 1.0),      // MIDREAR_R
            // new MotorMixRule(1.0, 0.414178, 1.0, 1.0),      // REAR_L
            // new MotorMixRule(1.0, 0.414178, -1.0, -1.0),      // FRONT_L
            // new MotorMixRule(1.0, -1.0, -0.414178, -1.0),      // MIDFRONT_R
            // new MotorMixRule(1.0, -0.414178, 1.0, -1.0),      // REAR_R
            // new MotorMixRule(1.0, 1.0, 0.414178, -1.0),      // MIDREAR_L
        ],
        servoMixer: [
            new ServoMixRule(1 , SERVO_Motor1, 1000, 2000),
            new ServoMixRule(2 , SERVO_Motor2, 1000, 2000),
            new ServoMixRule(3 , SERVO_Motor3, 1000, 2000),
            new ServoMixRule(4,  SERVO_Motor4, 1000, 2000), 
            new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
            new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
            new ServoMixRule(7 , SERVO_Motor7, 1000, 2000),
            new ServoMixRule(8,  SERVO_Motor8, 1000, 2000), 
        ]
    },     // 13
    {
        id: 14,
        name: 'Airplane / single prop',
       // model: 'custom',
        model: 'bixler',
        image: 'airplane_4ch',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
          //  new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
            new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
            new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(SERVO_RUDDER_NUM, SERVO_Rudder, 1000, 2000),
           // new ServoMixRule(5, SERVO_FlapAuto,    1000, 2000),
        ]
    },           // 14
    {
        id: 15,
        name: 'Heli 120',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_HELICOPTER,
        frame_class: 'Heli', //FRAME_CLASS=6
        frame_type: '',  //FRAME_TYPE=???
        motorMixer: [],
        servoMixer: []
    },             // 15
    {
        id: 16,
        name: 'Heli 90',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_HELICOPTER,
        frame_class: 'Heli', //FRAME_CLASS=6
        frame_type: '',  //FRAME_TYPE=???
        motorMixer: [],
        servoMixer: []
    },              // 16
    {
        id: 20,
        name: 'QuadPlane - no tilting props, 1 forward + 4 lifting',
        model: 'alti',
        image: 'quadplane_x',
        enabled: true,
        legacy: true,
        q_frame_class: 1, //'Quad', //see Qardu_frame_classes for number-to-name lookup
        q_frame_type:  1, //'X', see Qardu_frame_types for number-to-name lookup
        //q_tilt_type: 0,
        platform: PLATFORM_AIRPLANE, //PLATFORM_MULTIROTOR,
        motorMixer: [
            // new MotorMixRule(1.0, 0.0, 0.0, 0.0),          // front buzz todo
            // new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_R
            // new MotorMixRule(1.0, -1.0, -1.0, 0.0),        // FRONT_R
            // new MotorMixRule(1.0, 0.0, 1.0, -1.0),         // REAR_L
            // new MotorMixRule(1.0, 1.0, -1.0, -0.0),        // FRONT_L
        ],
        servoMixer: [ // AETR surfaces too
        new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
        new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
        new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
        new ServoMixRule(SERVO_RUDDER_NUM, SERVO_Rudder, 1000, 2000),

        new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
        new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
        new ServoMixRule(7 , SERVO_Motor7, 1000, 2000),
        new ServoMixRule(8,  SERVO_Motor8, 1000, 2000), 

        ]
    },  // 20    
    {
        id: 21,
        name: 'QuadPlane - 4  motors, 2 tilting together',
        model: 'griffin',
        image: 'quadplane_x_twotilts',
        enabled: true,
        legacy: true,
        q_frame_class: 1, // 'Quad', //see Qardu_frame_classes for number-to-name lookup
        q_frame_type: 1, //'X', see Qardu_frame_types for number-to-name lookup  
        q_tilt_type: 0, // 0=continuous = normal servo tilt
        platform: PLATFORM_AIRPLANE, //PLATFORM_MULTIROTOR,
        // frame_class: '', //FRAME_CLASS=???
        // frame_type: '',  //FRAME_TYPE=???
        motorMixer: [
            // new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_R // buzz todo tilt
            // new MotorMixRule(1.0, -1.0, -1.0, 0.0),        // FRONT_R
            // new MotorMixRule(1.0, 0.0, 1.0, -1.0),         // REAR_L
            // new MotorMixRule(1.0, 1.0, -1.0, -0.0),        // FRONT_L
        ],
        servoMixer: [ // AETR surfaces too
        new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
        new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
        //new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
        new ServoMixRule(SERVO_RUDDER_NUM, SERVO_Rudder, 1000, 2000),

        new ServoMixRule(5 , SERVO_Motor5, 1000, 2000),
        new ServoMixRule(6,  SERVO_Motor6, 1000, 2000), 
        new ServoMixRule(7 , SERVO_Motor7, 1000, 2000),
        new ServoMixRule(8,  SERVO_Motor8, 1000, 2000), 

        new ServoMixRule(9  , SERVO_TiltMotorsFront, 1000, 2000),

        // buzz todo need to set  set Q_FRAME_CLASS and Q_FRAME_TYPE . Q_FRAME_CLASS can be:
        // 1 for quad
        // 2 for hexa
        // 3 for octa
        // 4 for octaquad
        // 5 for Y6
        // 7 for Tri
        // 10 for Tailsitter

        // enable QuadPlane support by setting Q_ENABLE to 1 and Tilt Rotor support by setting Q_TILT_TYPE = “...”, 
        //   and then choose the right quadplane frame class and frame type.

        // you will need to get the Q_FRAME_TYPE right. The Q_FRAME_TYPE is the sub-type of frame. For 
        // example, for a Quadcopter, a frame type of 1 is for a “X” frame and a frame type of 3 is 
        // for a “H” frame. For Tri and Y6, this parameter is ignored.

        //  Q_TILT_MASK is a bitmask of what motors can tilt on your vehicle. The bits you need to enable correspond 
        // to the motor ordering of the standard ArduCopter motor map for your chosen frame class and frame 
        // type, ie. bit 0 corresponds to Motor 1.
        // a tilt-quadplane where all 4 motors tilt, then you should set Q_TILT_MASK to 15 which is 8+4+2+1.
        // a tilt-tricopter where the front two motors tilt, then you should set Q_TILT_MASK to 3, which is 2+1.

        //You need to set the type of tilt you have using the Q_TILT_TYPE parameter. Valid values are:
        // Tilt Type	Q_TILT_TYPE
        // Continuous	0
        // Binary	1
        // Vectored	2
        // BiCopter	3


        ]
    },  // 21    
    // {
    //     id: 22,
    //     name: 'QuadPlane - one fixed forward prop / VTOL - 4 fixed lifting props',
    //     model: 'alti',
    //     image: 'quad_x',
    //     enabled: true,
    //     legacy: true,
    //     platform: PLATFORM_AIRPLANE, //PLATFORM_MULTIROTOR,
        // frame_class: '', //FRAME_CLASS=???
        // frame_type: '',  //FRAME_TYPE=???
    //     motorMixer: [
    //         new MotorMixRule(1.0, 0.0, 0.0, 0.0),          // front buzz todo
    //         new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_R
    //         new MotorMixRule(1.0, -1.0, -1.0, 0.0),        // FRONT_R
    //         new MotorMixRule(1.0, 0.0, 1.0, -1.0),         // REAR_L
    //         new MotorMixRule(1.0, 1.0, -1.0, -0.0),        // FRONT_L
    //     ],
    //     servoMixer: [ // AETR surfaces too
    //         new ServoMixRule(SERVO_ELEVATOR_NUM,    INPUT_STABILIZED_PITCH, 1000, 2000),
    //         new ServoMixRule(SERVO_THROTTLE_NUM, INPUT_STABILIZED_ROLL,  1000, 2000),
    //         new ServoMixRule(SERVO_RUDDER_NUM, INPUT_STABILIZED_ROLL,  1000, 2000),
    //         new ServoMixRule(SERVO_FLAPPERON_1_NUM,      INPUT_STABILIZED_YAW,   1000, 2000),
    //     ]
    // },  // 22
    {
        id: 23,
        name: 'Custom',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        motorMixer: [],
        servoMixer: []
    },               // 23
    {
        id: 24,
        name: 'Airplane / single prop, tail dragger, flaps',
       // model: 'custom',
        model: 'cub',
        image: 'airplane_5ch',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
            new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
            new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(SERVO_RUDDER_NUM, SERVO_Rudder, 1000, 2000),
            new ServoMixRule(6, SERVO_FlapAuto,    1000, 2000),
        ]
    },           // 24
    // {
    //     id: 25,
    //     name: 'Custom Airplane / diy mixer',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: true,
    //     legacy: true,
    //     platform: PLATFORM_AIRPLANE,
    //     motorMixer: [],
    //     servoMixer: []
    // },      // 25
    {
        id: 26,
        name: 'Custom Tricopter / diy mixer',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_TRICOPTER,
        frame_class: 'Tri', //FRAME_CLASS=7
        frame_type: '',  //FRAME_TYPE=???
        motorMixer: [],
        servoMixer: []
    },      // 26
    {
        id: 27,
        name: 'Airplane with differential thrust',
        model: 'cuav_tvbs',
        image: 'airplane_twomotors',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
          //  new MotorMixRule(1.0, 0.0, 0.0, 0.3),
          //  new MotorMixRule(1.0, 0.0, 0.0, -0.3)
        ],
        servoMixer: [
            new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
            new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
            new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_ThrottleLeft, 1000, 2000),
            new ServoMixRule(SERVO_RUDDER_NUM, SERVO_Rudder, 1000, 2000),
            //new ServoMixRule(5               , SERVO_FlapAuto,    1000, 2000),
            new ServoMixRule(5               , SERVO_ThrottleRight, 1000, 2000),
        ]
    }, // end 27
    {
        id: 28,
        name: 'Airplane V-tail (individual aileron servos)',
        model: 'talon',
        image: 'airplane_vtail_twoailerons',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
            new ServoMixRule(2                , SERVO_Aileron, 1000, 2000),
            new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(4               , SERVO_VTailLeft, 1000, 2000),
            new ServoMixRule(5               , SERVO_VTailRight,   1000, 2000),

        ]
    }, // end 28
    {
        id: 29,
        name: 'Airplane V-tail (single aileron servo)',
        model: 'talon',
        image: 'airplane_vtail_single',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
            new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
            new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(SERVO_RUDDER_NUM, SERVO_VTailLeft, 1000, 2000),
            new ServoMixRule(5               , SERVO_VTailRight,   1000, 2000),
        ]
    }, // end 29
    {
        id: 30,
        name: 'Airplane without rudder',
        model: 'custom',
        image: 'airplane_norudder_singleaileron',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_AILERON_NUM, SERVO_Aileron,  1000, 2000),
            new ServoMixRule(SERVO_ELEVATOR_NUM, SERVO_Elevator, 1000, 2000),
            new ServoMixRule(SERVO_THROTTLE_NUM, SERVO_Throttle, 1000, 2000),
        ]
    }, // end 30
    {
        id: 31,
        name: 'Rover / steering-wheel and throttle',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_ROVER,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(1, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(2  , SERVO_Rudder, 1000, 2000),
        ]
    }, // end 31
    {
        id: 32,
        name: 'Rover / skid-steer / tank-tracked',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_ROVER,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(1, SERVO_ThrottleLeft, 1000, 2000),
            new ServoMixRule(2  , SERVO_ThrottleRight, 1000, 2000),
        ]
    }, // end 32
    {
        id: 33,
        name: 'Boat',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_BOAT,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(1, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(2  , SERVO_Rudder, 1000, 2000),
        ]
    }    // end 33
    ,
    {
        id: 34,
        name: 'Other',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_OTHER,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(1, SERVO_Throttle, 1000, 2000),
            new ServoMixRule(2  , SERVO_Rudder, 1000, 2000),
        ]
    }         // end 34        
];




const platformList = [
    {
        id: PLATFORM_UNKNOWN,
        name: "Choose a Vehicle Type First!",
        type: '',
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
        {
        id: PLATFORM_MULTIROTOR,
        name: "Multirotor",
        type: 'Copter',
        excludeonly: '-heli',
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: PLATFORM_AIRPLANE,
        name: "Airplane",
        type: 'Plane',
        enabled: true,
        flapsPossible: true
    },
    {
        id: PLATFORM_HELICOPTER,
        name: "Helicopter",
        type: 'Copter',
        includeonly: '-heli',
        enabled: false,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: PLATFORM_TRICOPTER,
        name: "Tricopter",
        type: 'Copter',
        excludeonly: '-heli',
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: PLATFORM_ROVER,
        name: "Rover",
        type: 'Rover',
        enabled: true,
        flapsPossible: false
    },
    {
        id: PLATFORM_BOAT,
        name: "Boat",
        type: 'Rover',
        enabled: true,
        flapsPossible: false
    },
    {
        id: PLATFORM_ANTENNA,
        name: "Antenna-Tracker",
        type: 'AntennaTracker', // from the release data its got this in the 'vehicletype' json/apj
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    }, 
    {
        id: PLATFORM_PERIPH,
        name: "AP_Periph",
        type: 'AP_Periph', // from the release data its got this in the 'vehicletype' json/apj
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: PLATFORM_SUB,
        name: "Submarine",
        type: 'Sub', // from the release data its got this in the 'vehicletype' json/apj
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: PLATFORM_OTHER,
        name: "Other",
        type: '',
        enabled: true,
        flapsPossible: false
    }
];

var helper = helper || {};

helper.mixer = (function (mixerList) {
    let publicScope = {},
        privateScope = {};

    publicScope.getLegacyList = function () {
        let retVal = [];
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.legacy) {
                    retVal.push(element);
                }
            }
        }
        return retVal;
    };

    publicScope.getList = function () {
        let retVal = [];
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.enabled) {
                    retVal.push(element);
                }
            }
        }
        return retVal;
    };

    publicScope.getById = function (id) {
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.id === id) {
                    return element;
                }
            }
        }
        return false;
    }

    publicScope.getByPlatform = function (platform) {
        let retVal = [];
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.platform === platform && element.enabled) {
                    retVal.push(element);
                }
            }
        }
        return retVal;
    };

    publicScope.loadServoRules = function (mixer) {
        SERVO_RULES.flush();

        for (const i in mixer.servoMixer) {
            if (mixer.servoMixer.hasOwnProperty(i)) {
                const r = mixer.servoMixer[i];
                SERVO_RULES.put(
                    new ServoMixRule(
                        r.getTarget(),
                        r.getInput(),
                        r.getRate(),
                        r.getSpeed()
                    )
                );
            }
        }
    }

    publicScope.loadMotorRules = function (mixer) {
        MOTOR_RULES.flush();

        for (const i in mixer.motorMixer) {
            if (mixer.motorMixer.hasOwnProperty(i)) {
                const r = mixer.motorMixer[i];
                MOTOR_RULES.put(
                    new MotorMixRule(
                        r.getThrottle(),
                        r.getRoll(),
                        r.getPitch(),
                        r.getYaw()
                    )
                );
            }
        }
    }

    return publicScope;
})(mixerList);

// helper.platform = (function (platforms) {
//     let publicScope = {},
//         privateScope = {};

//     publicScope.getList = function () {
//         let retVal = [];
//         for (const i in platforms) {
//             if (platforms.hasOwnProperty(i)) {
//                 let element = platforms[i];
//                 if (element.enabled) {
//                     retVal.push(element);
//                 }
//             }
//         }
//         return retVal;
//     };

//     publicScope.getById = function (id) {
//         for (const i in platforms) {
//             if (platforms.hasOwnProperty(i)) {
//                 let element = platforms[i];
//                 if (element.id === id) {
//                     return element;
//                 }
//             }
//         }
//         return false;
//     }

//     return publicScope;
// })(platformList);
