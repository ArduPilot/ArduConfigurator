//'use strict';

// define all the global variables that are uses to hold FC state
var CONFIG,
    BF_CONFIG,
    LED_STRIP,
    LED_COLORS,
    LED_MODE_COLORS,
    PID,
    PID_names,
    PIDs,
    RC_MAP,
    RC,
    RC_tuning,
    AUX_CONFIG,
    AUX_CONFIG_IDS,
    MODE_RANGES,
    ADJUSTMENT_RANGES,
    SERVO_CONFIG,
    SERVO_RULES,
    MOTOR_RULES,
    LOGIC_CONDITIONS,
    LOGIC_CONDITIONS_STATUS,
    GLOBAL_FUNCTIONS,
    GLOBAL_VARIABLES_STATUS,
    PROGRAMMING_PID,
    PROGRAMMING_PID_STATUS,
    SERIAL_CONFIG,
    SENSOR_DATA,
    MOTOR_DATA,
    SERVO_DATA,
    GPS_DATA,
    MISSION_PLANER,
    ANALOG,
    ARMING_CONFIG,
    FC_CONFIG,
    MISC,
    REVERSIBLE_MOTORS,
    DATAFLASH,
    SDCARD,
    BLACKBOX,
    TRANSPONDER,
    RC_deadband,
    SENSOR_ALIGNMENT,
    RX_CONFIG,
    FAILSAFE_CONFIG,
    RXFAIL_CONFIG,
    VTX_CONFIG,
    ADVANCED_CONFIG,
    ARDUPILOT_PID_CONFIG,
    PID_ADVANCED,
    FILTER_CONFIG,
    SENSOR_STATUS,
    SENSOR_CONFIG,
    NAV_POSHOLD,
    CALIBRATION_DATA,
    POSITION_ESTIMATOR,
    RTH_AND_LAND_CONFIG,
    FW_CONFIG,
    DEBUG_TRACE,
    MIXER_CONFIG,
    BATTERY_CONFIG,
    OUTPUT_MAPPING,
  //  SETTINGS,
    BRAKING_CONFIG,
    SAFEHOMES;

var FC = {
    longyREQ:0,
    curr_mav_state: {}, // we'll fill this with whatever most recent mavlink data is from incoming streams , key is packet_name as str.
    MAX_SERVO_RATE: 125,
    MIN_SERVO_RATE: 0,
    isAirplane: function () {
        return (MIXER_CONFIG.platformType == PLATFORM_AIRPLANE);
    },
    isMultirotor: function () {
        return (MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR || MIXER_CONFIG.platformType == PLATFORM_TRICOPTER);
    },
    isRpyFfComponentUsed: function () {
        //return (MIXER_CONFIG.platformType == PLATFORM_AIRPLANE || MIXER_CONFIG.platformType == PLATFORM_ROVER || MIXER_CONFIG.platformType == PLATFORM_BOAT) || ((MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR || MIXER_CONFIG.platformType == PLATFORM_TRICOPTER) && semver.gte(CONFIG.flightControllerVersion, "2.6.0"));
    },
    isRpyDComponentUsed: function () {
        return true; // Currently all platforms use D term
    },
    isCdComponentUsed: function () {
        return (MIXER_CONFIG.platformType == PLATFORM_MULTIROTOR || MIXER_CONFIG.platformType == PLATFORM_TRICOPTER);
    },
    resetState: function () {
        SENSOR_STATUS = {
            isHardwareHealthy: 0,
            gyroHwStatus: 0,
            accHwStatus: 0,
            magHwStatus: 0,
            baroHwStatus: 0,
            gpsHwStatus: 0,
            rangeHwStatus: 0,
            speedHwStatus: 0,
            flowHwStatus: 0
        };

        SENSOR_CONFIG = {
            accelerometer: 1, // buzz hack to default-enable all of these
            barometer: 1,     // buzz hack to default-enable all of these
            magnetometer: 1,  // buzz hack to default-enable all of these
            pitot: 1,         // buzz hack to default-enable all of these
            rangefinder: 1,   // buzz hack to default-enable all of these
            opflow: 1         // buzz hack to default-enable all of these
        };

        CONFIG = {
            apiVersion: "0.0.0",
            flightControllerIdentifier: '',
            flightControllerVersion: '',
            version: 0,
            buildInfo: '',
            multiType: 0,
            msp_version: 0, // not specified using semantic versioning
            capability: 0,
            cycleTime: 0,
            i2cError: 0,
            activeSensors: 0b1111111111111111, // 0, // 16 bit bitfield buzz todo what are all of these? gps is in there somewhere
            mode: [],
            profile: 0,
            battery_profile: 0,
            uid: [0, 0, 0],
            accelerometerTrims: [0, 0],
            armingFlags: 0,
            name: ''
        };

        BF_CONFIG = {
            mixerConfiguration: 0,
            features: 0,
            serialrx_type: 0,
            board_align_roll: 0,
            board_align_pitch: 0,
            board_align_yaw: 0,
            currentscale: 0,
            currentoffset: 0
        };

        LED_STRIP = [];
        LED_COLORS = [];
        LED_MODE_COLORS = [];

        PID = {
        };

        PID_names = [];
        PIDs = [];
        RC_MAP = [];

        // defaults
        // roll, pitch, yaw, throttle, aux 1, ... aux n
        RC = {
            active_channels: 0,
            channels: new Array(32)
        };

        RC_tuning = {
            RC_RATE: 0,
            RC_EXPO: 0,
            roll_pitch_rate: 0, // pre 1.7 api only
            roll_rate: 0,
            pitch_rate: 0,
            yaw_rate: 0,
            dynamic_THR_PID: 0,
            throttle_MID: 0,
            throttle_EXPO: 0,
            dynamic_THR_breakpoint: 0,
            RC_YAW_EXPO: 0,
            manual_RC_EXPO: 0,
            manual_RC_YAW_EXPO: 0,
            manual_roll_rate: 0,
            manual_pitch_rate: 0,
            manual_yaw_rate: 0,
        };

        AUX_CONFIG = [];
        AUX_CONFIG_IDS = [];

        MODE_RANGES = [];
        ADJUSTMENT_RANGES = [];

        SERVO_CONFIG = [];
        SERVO_RULES             = new ServoMixerRuleCollection();
        MOTOR_RULES             = new MotorMixerRuleCollection();
        LOGIC_CONDITIONS        = new LogicConditionsCollection();
        LOGIC_CONDITIONS_STATUS = new LogicConditionsStatus();
        GLOBAL_VARIABLES_STATUS = new GlobalVariablesStatus();
        PROGRAMMING_PID         = new ProgrammingPidCollection();
        PROGRAMMING_PID_STATUS  = new ProgrammingPidStatus();

        MIXER_CONFIG = {
            yawMotorDirection: 0,
            yawJumpPreventionLimit: 0,
            platformType: -1,   // plane, copter, boat, rover etc
            hasFlaps: false,
            appliedMixerPreset: -1,
            numberOfMotors: 0,
            numberOfServos: 0
        },

        SERIAL_CONFIG = {
            ports: [],

            // pre 1.6 settings
            mspBaudRate: 0,
            gpsBaudRate: 0,
            gpsPassthroughBaudRate: 0,
            cliBaudRate: 0
        };

        SENSOR_DATA = {
            gyroscope: [0, 0, 0],
            accelerometer: [0, 0, 0],
            magnetometer: [0, 0, 0],
            altitude: 0,
            barometer: 0,
            sonar: 0,
            air_speed: 0,
            kinematics: [0.0, 0.0, 0.0],
            temperature: [0, 0, 0, 0, 0, 0, 0, 0],
            debug: [0, 0, 0, 0]
        };

        MOTOR_DATA = new Array(8);
        SERVO_DATA = new Array(16);

        GPS_DATA = {
            fix: 0,
            numSat: 0,
            lat: 0,
            lon: 0,
            alt: 0,
            speed: 0,
            ground_course: 0,
            distanceToHome: 0,
            ditectionToHome: 0,
            update: 0,
            hdop: 0,
            eph: 0,
            epv: 0,
            messageDt: 0,
            errors: 0,
            timeouts: 0,
            packetCount: 0
        };

        /* MISSION_PLANER = {
            maxWaypoints: 0,
            isValidMission: 0,
            countBusyPoints: 0,
            bufferPoint: {
                number: 0,
                action: 0,
                lat: 0,
                lon: 0,
                alt: 0,
                endMission: 0,
                p1: 0,
                p2: 0,
                p3: 0
            }
        }; */
        
        MISSION_PLANER = new WaypointCollection();

        ANALOG = {
            board_vcc: 0,
            voltage: 0,
            mAhdrawn: 0,
            mWhdrawn: 0,
            rssi: 0,
            amperage: 0,
            power: 0,
            cell_count: 0,
            battery_percentage: 0,
            battery_full_when_plugged_in: false,
            use_capacity_thresholds: false,
            battery_remaining_capacity: 0,
            battery_flags: 0
        };

        ARMING_CONFIG = {
            auto_disarm_delay: 0,
            disarm_kill_switch: 0
        };

        FC_CONFIG = {
            loopTime: 0
        };

        MISC = {
            midrc: 0,
            minthrottle: 0,
            maxthrottle: 0,
            mincommand: 0,
            failsafe_throttle: 0,
            gps_type: 0,
            sensors_baudrate: 0,
            gps_ubx_sbas: 0,
            multiwiicurrentoutput: 0,
            rssi_channel: 0,
            placeholder2: 0,
            mag_declination: 0, // not checked
            battery_cells: 0,
            vbatscale: 0,
            vbatdetectcellvoltage: 0,
            vbatmincellvoltage: 0,
            vbatmaxcellvoltage: 0,
            vbatwarningcellvoltage: 0,
            battery_capacity: 0,
            battery_capacity_warning: 0,
            battery_capacity_critical: 0,
            battery_capacity_unit: 'mAh'
        };

        BATTERY_CONFIG = {
            vbatscale: 0,
            vbatdetectcellvoltage: 0,
            vbatmincellvoltage: 0,
            vbatmaxcellvoltage: 0,
            vbatwarningcellvoltage: 0,
            current_offset: 0,
            current_scale: 0,
            capacity: 0,
            capacity_warning: 0,
            capacity_critical: 0,
            capacity_unit: 0
        };

        VTX_CONFIG = {
            device_type: VTX.DEV_UNKNOWN,
            band: 0,
            channel: 1,
            power: 0,
            pitmode: 0,
            low_power_disarm: 0,
        };

        ADVANCED_CONFIG = {
            gyroSyncDenominator: null,
            pidProcessDenom: null,
            useUnsyncedPwm: null,
            motorPwmProtocol: null,
            motorPwmRate: null,
            servoPwmRate: null,
            gyroSync: null
        };

        FILTER_CONFIG = {
            gyroSoftLpfHz: null,
            dtermLpfHz: null,
            yawLpfHz: null,
            gyroNotchHz1: null,
            gyroNotchCutoff1: null,
            dtermNotchHz: null,
            dtermNotchCutoff: null,
            gyroNotchHz2: null,
            gyroNotchCutoff2: null,
            accNotchHz: null,
            accNotchCutoff: null,
            gyroStage2LowpassHz: null
        };

        PID_ADVANCED = {
            rollPitchItermIgnoreRate: null,
            yawItermIgnoreRate: null,
            yawPLimit: null,
            axisAccelerationLimitRollPitch: null,
            axisAccelerationLimitYaw: null,
            dtermSetpointWeight: null,
            pidSumLimit: null
        };

        ARDUPILOT_PID_CONFIG = {
            asynchronousMode: null,
            accelerometerTaskFrequency: null,
            attitudeTaskFrequency: null,
            magHoldRateLimit: null,
            magHoldErrorLpfFrequency: null,
            yawJumpPreventionLimit: null,
            gyroscopeLpf: null,
            accSoftLpfHz: null
        };

        NAV_POSHOLD = {
            userControlMode: null,
            maxSpeed: null,
            maxClimbRate: null,
            maxManualSpeed: null,
            maxManualClimbRate: null,
            maxBankAngle: null,
            useThrottleMidForAlthold: null,
            hoverThrottle: null
        };

        CALIBRATION_DATA = {
            acc: { // each of the 6 positions the user holds the vehicle in diring accel cal.
                Pos0: null,
                Pos1: null,
                Pos2: null,
                Pos3: null,
                Pos4: null,
                Pos5: null
            },
            accZero: {
                X: null,
                Y: null,
                Z: null
            },
            accGain: {
                X: null,
                Y: null,
                Z: null
            },
            magZero: {
                X: null,
                Y: null,
                Z: null
            },
            opflow: {
                Scale: null
            },
            magGain: {
                X: null,
                Y: null,
                Z: null
            }
        };

        RTH_AND_LAND_CONFIG = {
             minRthDistance: null,
             rthClimbFirst: null,
             rthClimbIgnoreEmergency: null,
             rthTailFirst: null,
             rthAllowLanding: null,
             rthAltControlMode: null,
             rthAbortThreshold: null,
             rthAltitude: null,
             landDescentRate: null,
             landSlowdownMinAlt: null,
             landSlowdownMaxAlt: null,
             emergencyDescentRate: null
        };

        REVERSIBLE_MOTORS = {
            deadband_low: 0,
            deadband_high: 0,
            neutral: 0,
            deadband_throttle: 0
        };

        DATAFLASH = {
            ready: false,
            supported: false,
            sectors: 0,
            totalSize: 0,
            usedSize: 0
        };

        SDCARD = {
            supported: false,
            state: 0,
            filesystemLastError: 0,
            freeSizeKB: 0,
            totalSizeKB: 0
        };

        BLACKBOX = {
            supported: false,
            blackboxDevice: 0,
            blackboxRateNum: 1,
            blackboxRateDenom: 1
        };

        TRANSPONDER = {
            supported: false,
            data: []
        };

        RC_deadband = {
            deadband: 0,
            yaw_deadband: 0,
            alt_hold_deadband: 0
        };

        SENSOR_ALIGNMENT = {
            align_gyro: 0,
            align_acc: 0,
            align_mag: 0,
            align_opflow: 0
        };

        RX_CONFIG = {
            receiver_type: 0,
            serialrx_provider: 0,
            maxcheck: 0,
            midrc: 0,
            mincheck: 0,
            spektrum_sat_bind: 0,
            rx_min_usec: 0,
            rx_max_usec: 0,
            spirx_protocol: 0,
            spirx_id: 0,
            spirx_channel_count: 0,
        };

        POSITION_ESTIMATOR = {
            w_z_baro_p: null,
            w_z_gps_p: null,
            w_z_gps_v: null,
            w_xy_gps_p: null,
            w_xy_gps_v: null,
            gps_min_sats: null,
            use_gps_velned: null
        };

        FAILSAFE_CONFIG = {
            failsafe_delay: 0,
            failsafe_off_delay: 0,
            failsafe_throttle: 0,
            failsafe_kill_switch: 0,
            failsafe_throttle_low_delay: 0,
            failsafe_procedure: 0,
            failsafe_recovery_delay: 0,
            failsafe_fw_roll_angle: 0,
            failsafe_fw_pitch_angle: 0,
            failsafe_fw_yaw_rate: 0,
            failsafe_stick_motion_threshold: 0,
            failsafe_min_distance: 0,
            failsafe_min_distance_procedure: 0
        };

        FW_CONFIG = {
            cruiseThrottle: null,
            minThrottle: null,
            maxThrottle: null,
            maxBankAngle: null,
            maxClimbAngle: null,
            maxDiveAngle: null,
            pitchToThrottle: null,
            loiterRadius: null
        };

        BRAKING_CONFIG = {
            speedThreshold: null,
            disengageSpeed: null,
            timeout: null,
            boostFactor: null,
            boostTimeout: null,
            boostSpeedThreshold: null,
            boostDisengageSpeed: null,
            bankAngle: null
        }

        RXFAIL_CONFIG = [];

        OUTPUT_MAPPING = new OutputMappingCollection();

     //   SETTINGS = {};
        
        SAFEHOMES = new SafehomeCollection();
    },
    getOutputUsages: function() {
        return {
            'ANY':      (0),
            'MC_MOTOR': (1<<2),
            'MC_SERVO': (1<<3),
            'FW_MOTOR': (1<<5),
            'FW_SERVO': (1<<6),
            'LED':      (1<<24)
        };
    },
    getFeatures: function () {
        var features = [
            {bit: 1, group: 'batteryVoltage', name: 'VBAT'},
            {bit: 4, group: 'other', name: 'MOTOR_STOP'},
            {bit: 6, group: 'other', name: 'SOFTSERIAL', haveTip: true, showNameInTip: true},
            {bit: 7, group: 'gps', name: 'GPS', haveTip: true},
            {bit: 10, group: 'other', name: 'TELEMETRY', showNameInTip: true},
            {bit: 11, group: 'batteryCurrent', name: 'CURRENT_METER'},
            {bit: 12, group: 'other', name: 'REVERSIBLE_MOTORS', showNameInTip: true},
            {bit: 15, group: 'other', name: 'RSSI_ADC', haveTip: true, showNameInTip: true},
            {bit: 16, group: 'other', name: 'LED_STRIP', showNameInTip: true},
            {bit: 17, group: 'other', name: 'DASHBOARD', showNameInTip: true},
            {bit: 19, group: 'other', name: 'BLACKBOX', haveTip: true, showNameInTip: true},
            {bit: 28, group: 'other', name: 'PWM_OUTPUT_ENABLE', haveTip: true},
            {bit: 26, group: 'other', name: 'SOFTSPI'},
            {bit: 29, group: 'other', name: 'OSD', haveTip: false, showNameInTip: false},
            {bit: 22, group: 'other', name: 'AIRMODE', haveTip: false, showNameInTip: false},
            {bit: 30, group: 'other', name: 'FW_LAUNCH', haveTip: false, showNameInTip: false},
            {bit: 2, group: 'other', name: 'TX_PROF_SEL', haveTip: false, showNameInTip: false},
            {bit: 0, group: 'other', name: 'THR_VBAT_COMP', haveTip: true, showNameInTip: true},
            {bit: 3, group: 'other', name: 'BAT_PROFILE_AUTOSWITCH', haveTip: true, showNameInTip: true},
            {bit: 31, group: 'other', name: "FW_AUTOTRIM", haveTip: true, showNameInTip: true}
        ];

        //if (semver.gte(CONFIG.flightControllerVersion, "2.4.0") && semver.lt(CONFIG.flightControllerVersion, "2.5.0")) {
            features.push({bit: 5, group: 'other', name: 'DYNAMIC_FILTERS', haveTip: true, showNameInTip: true});
        //}

        return features.reverse();
    },
    paramslist: {},
    //getParams: function () {
        //var paramslist = [
        //paramslist = [
        //        {name: 'todo1', value: '1', group: 'other'},
        //    {name: 'todo2', value: '34.678', group: 'other'},
        //    {name: 'todo3', value: "stringy", group: 'other' }
        //];
        //paramslist.push({ name: 'pushedparam',value: 'other', group: 'other', });

    //    return paramslist; //.reverse(); // rendered on-page from bottom up, so this gets them on-pase in the same order they are seen here
    //},            
    isFeatureEnabled: function (featureName, features) {
        if (features === undefined) {
            features = this.getFeatures();
        }
        //for (var i = 0; i < features.length; i++) {
        //    if (features[i].name == featureName && bit_check(BF_CONFIG.features, features[i].bit)) {
        //        return true;
        //    }
        //}
        //return false;
        return true ; // buzz hack to enable all features
    },
    isMotorOutputEnabled: function () {
        return this.isFeatureEnabled('PWM_OUTPUT_ENABLE', this.getFeatures());
    },
    getLooptimes: function () {
        return {
            125: {
                defaultLooptime: 500,
                looptimes: {
                    1000: "1kHz",
                    500: "2kHz",
                    250: "4kHz",
                    125: "8kHz"
                }
            },
            1000: {
                defaultLooptime: 1000,
                looptimes: {
                    1000: "1kHz"
                }
            }
        };
    },
    getGyroFrequencies: function () {
        return {
            125: {
                defaultLooptime: 1000,
                looptimes: {
                    1000: "1kHz",
                    500: "2kHz",
                    250: "4kHz",
                    125: "8kHz"
                }
            },
            1000: {
                defaultLooptime: 1000,
                looptimes: {
                    1000: "1kHz"
                }
            }
        };
    },
    getGyroLpfValues: function () {
        return [
            {
                tick: 125,
                label: "256Hz"
            },
            {
                tick: 1000,
                label: "188Hz"
            },
            {
                tick: 1000,
                label: "98Hz"
            },
            {
                tick: 1000,
                label: "42Hz"
            },
            {
                tick: 1000,
                label: "20Hz"
            },
            {
                tick: 1000,
                label: "10Hz"
            }
        ];
    },
    getGpsProtocols: function () {
        return [
            'NMEA',
            'UBLOX',
            'I2C-NAV',
            'DJI NAZA',
            'UBLOX7',
            'MTK',
            'MSP',
            'MAVSP'
        ];
    },
    getGpsBaudRates: function () {
        return [
            '115200',
            '57600',
            '38400',
            '19200',
            '9600'
        ];
    },
    getGpsSbasProviders: function () {
        return [
            'Autodetect',
            'European EGNOS',
            'North American WAAS',
            'Japanese MSAS',
            'Indian GAGAN',
            'Disabled'
        ];
    },
    getSensorAlignments: function () {
        return [
            'CW 0°',
            'CW 90°',
            'CW 180°',
            'CW 270°',
            'CW 0° flip',
            'CW 90° flip',
            'CW 180° flip',
            'CW 270° flip'
        ];
    },
    getEscProtocols: function () {
        return {
            0: {
                name: "STANDARD",
                message: null,
                defaultRate: 400,
                rates: {
                    50: "50Hz",
                    400: "400Hz"
                }
            },
            1: {
                name: "ONESHOT125",
                message: null,
                defaultRate: 1000,
                rates: {
                    400: "400Hz",
                    1000: "1kHz",
                    2000: "2kHz"
                }
            },
            2: {
                name: "ONESHOT42",
                message: null,
                defaultRate: 2000,
                rates: {
                    400: "400Hz",
                    1000: "1kHz",
                    2000: "2kHz",
                    4000: "4kHz",
                    8000: "8kHz"
                }
            },
            3: {
                name: "MULTISHOT",
                message: null,
                defaultRate: 2000,
                rates: {
                    400: "400Hz",
                    1000: "1kHz",
                    2000: "2kHz",
                    4000: "4kHz",
                    8000: "8kHz"
                }
            },
            4: {
                name: "BRUSHED",
                message: null,
                defaultRate: 8000,
                rates: {
                    8000: "8kHz",
                    16000: "16kHz",
                    32000: "32kHz"
                }
            },
            5: {
                name: "DSHOT150",
                message: null,
                defaultRate: 4000,
                rates: {
                    4000: "4kHz"
                }
            },
            6: {
                name: "DSHOT300",
                message: null,
                defaultRate: 8000,
                rates: {
                    8000: "8kHz"
                }
            },
            7: {
                name: "DSHOT600",
                message: null,
                defaultRate: 16000,
                rates: {
                    16000: "16kHz"
                }
            },
            8: {
                name: "DSHOT1200",
                message: "escProtocolNotAdvised",
                defaultRate: 16000,
                rates: {
                    16000: "16kHz"
                }
            },
            9: {
                name: "SERIALSHOT",
                message: "escProtocolExperimental",
                defaultRate: 4000,
                rates: {
                    4000: "4kHz"
                }
            }
        };
    },
    getServoRates: function () {
        return {
            50: "50Hz",
            60: "60Hz",
            100: "100Hz",
            160: "160Hz",
            330: "330Hz"
        };
    },
    getAsyncModes: function () {
        return [
            'Disabled',
            'Gyro',
            'All'
        ]
    },
    getAccelerometerTaskFrequencies: function () {
        return {
            100: '100Hz',
            200: '200Hz',
            250: '250Hz',
            500: '500Hz',
            750: '750Hz',
            1000: '1kHz'
        }
    },
    getAttitudeTaskFrequencies: function () {
        return {
            100: '100Hz',
            200: '200Hz',
            250: '250Hz',
            500: '500Hz',
            750: '750Hz',
            1000: '1kHz'
        }
    },
    getOsdDisabledFields: function () {
        return [];
    },
    getAccelerometerNames: function () {
        return [ "NONE", "AUTO", "ADXL345", "MPU6050", "MMA845x", "BMA280", "LSM303DLHC", "MPU6000", "MPU6500", "MPU9250", "BMI160", "ICM20689", "FAKE"];
    },
    getMagnetometerNames: function () {
        return ["NONE", "AUTO", "HMC5883", "AK8975", "GPSMAG", "MAG3110", "AK8963", "IST8310", "QMC5883", "MPU9250", "IST8308", "LIS3MDL", "MSP", "FAKE"];
    },
    getBarometerNames: function () {
        //if (semver.gte(CONFIG.flightControllerVersion, "2.6.0")) {
            return ["NONE", "AUTO", "BMP085", "MS5611", "BMP280", "MS5607", "LPS25H", "SPL06", "BMP388", "DPS310", "MSP", "FAKE"];
        //} else {
        //    return ["NONE", "AUTO", "BMP085", "MS5611", "BMP280", "MS5607", "LPS25H", "SPL06", "BMP388", "FAKE"];
        //}
    },
    getPitotNames: function () {
        //if (semver.gte(CONFIG.flightControllerVersion, "2.6.0")) {
            return ["NONE", "AUTO", "MS4525", "ADC", "VIRTUAL", "FAKE", "MSP"];
        //} else {
        //    return ["NONE", "AUTO", "MS4525", "ADC", "VIRTUAL", "FAKE"];
        //}
    },
    getRangefinderNames: function () {
        return [ "NONE", "HCSR04", "SRF10", "ARDUPILOT_I2C", "VL53L0X", "MSP", "UIB", "Benewake TFmini"];
    },
    getOpticalFlowNames: function () {
        //if (semver.gte(CONFIG.flightControllerVersion, "2.7.0")) {
            return [ "NONE", "CXOF", "MSP", "FAKE" ];
        //} else {
        //    return [ "NONE", "PMW3901", "CXOF", "MSP", "FAKE" ];
        //}
    },
    getArmingFlags: function () {
        return {
            0: "OK_TO_ARM",
            1: "PREVENT_ARMING",
            2: "ARMED",
            3: "WAS_EVER_ARMED",
            8: "BLOCKED_UAV_NOT_LEVEL",
            9: "BLOCKED_SENSORS_CALIBRATING",
            10: "BLOCKED_SYSTEM_OVERLOADED",
            11: "BLOCKED_NAVIGATION_SAFETY",
            12: "BLOCKED_COMPASS_NOT_CALIBRATED",
            13: "BLOCKED_ACCELEROMETER_NOT_CALIBRATED",
            14: "BLOCKED_RC_NOT_CALIBRATED",
            15: "BLOCKED_HARDWARE_FAILURE",
            26: "BLOCKED_INVALID_SETTING",
        }
    },
    getArmingBlockingFlags: function() {
        var allFlags = this.getArmingFlags(),
            retVal = {};

        for (var i in allFlags) {
            if (allFlags.hasOwnProperty(i) && parseInt(i, 10) >= 8 && allFlags[i] !== null) {
                retVal[i] = allFlags[i];
            }
        }

        return retVal;
    },
    getUserControlMode: function () {
        return [
            "Attitude",
            "Cruise"
        ]
    },
    getPidNames: function () {
        let list = [
            'Roll',
            'Pitch',
            'Yaw',
            'Position Z',
            'Position XY',
            'Velocity XY',
            'Surface',
            'Level',
            'Heading Hold',
            'Velocity Z'
        ];

        //if (semver.gte(CONFIG.flightControllerVersion, '2.5.0')) {
            list.push("Nav Heading")
        //}

        return list;
    },
    getRthAltControlMode: function () {
        return ["Current", "Extra", "Fixed", "Max", "At least", "At least, linear descent"];
    },
    getRthAllowLanding: function() {
        return ["Never", "Always", "Only on failsafe"];
    },
    getFailsafeProcedure: function () {
        return {
            0: "Land",
            1: "Drop",
            2: "RTH",
            3: "Do Nothing",
        }
    },
    getRcMapLetters: function () {
        return ['A', 'E', 'R', 'T'];
    },
    isRcMapValid: function (val) {
        var strBuffer = val.split(''),
            duplicityBuffer = [];

        if (val.length != FC.getRcMapLetters().length)
            return false;

        // check if characters inside are all valid, also check for duplicity
        for (var i = 0; i < val.length; i++) {
            if (FC.getRcMapLetters().indexOf(strBuffer[i]) < 0)
                return false;

            if (duplicityBuffer.indexOf(strBuffer[i]) < 0)
                duplicityBuffer.push(strBuffer[i]);
            else
                return false;
        }

        return true;
    },
    getServoMixInputNames: function () {

        // given a number, get the name
        var Ardu_ServoX_functionsObj = {
            0 : 'Disabled  => 0',
            1 : 'RCPassThru  => 1',
            2 : 'Flap  => 2',
            3 : 'FlapAuto  => 3',
            4 : 'Aileron  => 4',
            5 : '-5-unused-',
            6 : 'MountPan  => 6',
            7 : 'MountTilt  => 7',
            8 : 'MountRoll  => 8',
            9 : 'MountOpen  => 9',
            10 : 'CameraTrigger  => 10',
            11 : '-11-unused-',
            12 : 'Mount2Pan  => 12',
            13 : 'Mount2Tilt  => 13',
            14 : 'Mount2Roll  => 14',
            15 : 'Mount2Open  => 15',
            16 : 'DifferentialSpoilerLeft1  => 16',
            17 : 'DifferentialSpoilerRight1  => 17',
            18 : '-18-unused-',
            19 : 'Elevator  => 19',
            20 : '-20-unused-',
            21 : 'Rudder  => 21',
            22 : 'SprayerPump  => 22',
            23 : 'SprayerSpinner  => 23',
            24 : 'FlaperonLeft  => 24',
            25 : 'FlaperonRight  => 25',
            26 : 'GroundSteering  => 26',
            27 : 'Parachute  => 27',
            28 : 'Gripper  => 28',
            29 : 'LandingGear  => 29',
            30 : 'EngineRunEnable  => 30',
            31 : '-31-unused-',
            32 : '-32-unused-',
            33 : 'Motor1  => 33',
            34 : 'Motor2  => 34',
            35 : 'Motor3  => 35',
            36 : 'Motor4  => 36',
            37 : 'Motor5  => 37',
            38 : 'Motor6  => 38',
            39 : 'Motor7/TailTiltServo  => 39',
            40 : 'Motor8  => 40',
            41 : 'TiltMotorsFront  => 41',
            42 : '-42-unused-',
            43 : '-43-unused-',
            44 : '-44-unused-',
            45 : 'TiltMotorsRear  => 45',
            46 : 'TiltMotorRearLeft  => 46',
            47 : 'TiltMotorRearRight  => 47',
            48 : '-48-unused-',
            49 : '-49-unused-',
            50 : '-50-unused-',
            51 : 'RCIN1  => 51',
            52 : 'RCIN2  => 52',
            53 : 'RCIN3  => 53',
            54 : 'RCIN4  => 54',
            55 : 'RCIN5  => 55',
            56 : 'RCIN6  => 56',
            57 : 'RCIN7  => 57',
            58 : 'RCIN8  => 58',
            59 : 'RCIN9  => 59',
            60 : 'RCIN10  => 60',
            61 : 'RCIN11  => 61',
            62 : 'RCIN12  => 62',
            63 : 'RCIN13  => 63',
            64 : 'RCIN14  => 64',
            65 : 'RCIN15  => 65',
            66 : 'RCIN16  => 66',
            67 : 'Ignition => 67',
            68 : '-68-unused-',
            69 : 'Starter  => 69',
            70 : 'Throttle  => 70',
            71 : '-71-unused-',
            72 : '-72-unused-',
            73 : 'ThrottleLeft  => 73',
            74 : 'ThrottleRight  => 74',
            75 : 'TiltMotorFrontLeft  => 75',
            76 : 'TiltMotorFrontRight  => 76',
            77 : 'ElevonLeft  => 77',
            78 : 'ElevonRight  => 78',
            79 : 'VTailLeft  => 79',
            80 : 'VTailRight  => 80',
            81 : '-81-unused-',
            82 : 'Motor9  => 82',
            83 : 'Motor10  => 83',
            84 : 'Motor11  => 84',
            85 : 'Motor12  => 85',
            86 : 'DifferentialSpoilerLeft2  => 86',
            87 : 'DifferentialSpoilerRight2  => 87',
            88 : '-88-unused-',
            89 : '-89-unused-',
            90 : 'CameraISO  => 90',
            91 : 'CameraAperture  => 91',
            92 : 'CameraFocus  => 92',
            93 : 'CameraShutterSpeed  => 93',
            94 : 'Script1  => 94',
            95 : 'Script2  => 95',
            96 : 'Script3  => 96',
            97 : 'Script4  => 97',
            98 : 'Script5  => 98',
            99 : 'Script6  => 99',
            100 : 'Script7  => 100',
            101 : 'Script8  => 101',
            102 : 'Script9  => 102',
            103 : 'Script10  => 103',
            104 : 'Script11  => 104',
            105 : 'Script12  => 105',
            106 : 'Script13  => 106',
            107 : 'Script14  => 107',
            108 : 'Script15  => 108',
            109 : 'Script16  => 109',
            110 : '-110-unused-',
            111 : '-111-unused-',
            112 : '-112-unused-',
            113 : '-113-unused-',
            114 : '-114-unused-',
            115 : '-115-unused-',
            116 : '-116-unused-',
            117 : '-117-unused-',
            118 : '-118-unused-',
            119 : '-119-unused-',
            120 : 'NeoPixel1  => 120',
            121 : 'NeoPixel2  => 121',
            122 : 'NeoPixel3  => 122',
            123 : 'NeoPixel4  => 123',
            124 : 'RateRoll   => 124',
            125 : 'RatePitch  => 125',
            126 : 'RateThrust => 126',
            127 : 'RateYaw    => 127',
            128 : '-128-unused-',
            129 : 'ProfiLED1  => 129',
            130 : 'ProfiLED2  => 130',
            131 : 'ProfiLED3  => 131',
            132 : 'ProfiLEDClock => 132',
            133 : '-133-unused-',
            134 : 'SERVOn_MIN  => 134',
            135 : 'SERVOn_TRIM  => 135',
            136 : 'SERVOn_MAX  => 136',
        };


        var Ardu_ServoX_functionsObjNAME = {};
        for ( prop in Ardu_ServoX_functionsObj ) {
            var name = Ardu_ServoX_functionsObj[prop];
            
            Ardu_ServoX_functionsObjNAME[name] = prop; // from name -> number
        }

        // an list of just the names
        var Ardu_ServoX_functionsARR = Object.keys(Ardu_ServoX_functionsObjNAME);
        return Ardu_ServoX_functionsARR; 

    },
    getServoMixInputName: function (input) {
        return this.getServoMixInputNames()[input];
    },
    getModeId: function (name) {
        for (var i = 0; i < AUX_CONFIG.length; i++) {
            if (AUX_CONFIG[i] == name)
                return i;
        }
        return -1;
    },
    isModeBitSet: function (i) {
        return bit_check(CONFIG.mode[Math.trunc(i / 32)], i % 32);
    },
    isModeEnabled: function (name) {
        return this.isModeBitSet(this.getModeId(name));
    },
    getLogicOperators: function () {
        return {
            0: {
                name: "True",
                hasOperand: [false, false],
                output: "boolean"
            },
            1: {
                name: "Equal",
                hasOperand: [true, true],
                output: "boolean"
            },
            2: {
                name: "Greater Than",
                hasOperand: [true, true],
                output: "boolean"
            },
            3: {
                name: "Lower Than",
                hasOperand: [true, true],
                output: "boolean"
            },
            4: {
                name: "Low",
                hasOperand: [true, false],
                output: "boolean"
            },
            5: {
                name: "Mid",
                hasOperand: [true, false],
                output: "boolean"
            },
            6: {
                name: "High",
                hasOperand: [true, false],
                output: "boolean"
            },
            7: {
                name: "AND",
                hasOperand: [true, true],
                output: "boolean"
            },
            8: {
                name: "OR",
                hasOperand: [true, true],
                output: "boolean"
            },
            9: {
                name: "XOR",
                hasOperand: [true, true],
                output: "boolean"
            },
            10: {
                name: "NAND",
                hasOperand: [true, true],
                output: "boolean"
            },
            11: {
                name: "NOR",
                hasOperand: [true, true],
                output: "boolean"
            },
            12: {
                name: "NOT",
                hasOperand: [true, false],
                output: "boolean"
            },
            13: {
                name: "STICKY",
                hasOperand: [true, true],
                output: "boolean"
            },
            14: {
                name: "ADD",
                hasOperand: [true, true],
                output: "raw"
            },
            15: {
                name: "SUB",
                hasOperand: [true, true],
                output: "raw"
            },
            16: {
                name: "MUL",
                hasOperand: [true, true],
                output: "raw"
            },
            17: {
                name: "DIV",
                hasOperand: [true, true],
                output: "raw"
            },
            40: {
                name: "MOD",
                hasOperand: [true, true],
                output: "raw"
            },
            18: {
                name: "GVAR SET",
                hasOperand: [true, true],
                output: "none"
            },
            19: {
                name: "GVAR INC",
                hasOperand: [true, true],
                output: "none"
            },
            20: {
                name: "GVAR DEC",
                hasOperand: [true, true],
                output: "none"
            },
            21: {
                name: "IO PORT SET",
                hasOperand: [true, true],
                output: "none"
            },
            22: {
                name: "OVERRIDE ARMING SAFETY",
                hasOperand: [false, false],
                output: "boolean"
            },
            23: {
                name: "OVERRIDE THROTTLE SCALE",
                hasOperand: [true, false],
                output: "boolean"
            },
            29: {
                name: "OVERRIDE THROTTLE",
                hasOperand: [true, false],
                output: "boolean"
            },
            24: {
                name: "SWAP ROLL & YAW",
                hasOperand: [false, false],
                output: "boolean"
            },
            25: {
                name: "SET VTX POWER LEVEL",
                hasOperand: [true, false],
                output: "boolean"
            },
            30: {
                name: "SET VTX BAND",
                hasOperand: [true, false],
                output: "boolean"
            },
            31: {
                name: "SET VTX CHANNEL",
                hasOperand: [true, false],
                output: "boolean"
            },
            26: {
                name: "INVERT ROLL",
                hasOperand: [false, false],
                output: "boolean"
            },
            27: {
                name: "INVERT PITCH",
                hasOperand: [false, false],
                output: "boolean"
            },
            28: {
                name: "INVERT YAW",
                hasOperand: [false, false],
                output: "boolean"
            },
            32: {
                name: "SET OSD LAYOUT",
                hasOperand: [true, false],
                output: "boolean"
            },
            33: {
                name: "SIN",
                hasOperand: [true, true],
                output: "raw"
            },
            34: {
                name: "COS",
                hasOperand: [true, true],
                output: "raw"
            },
            35: {
                name: "TAN",
                hasOperand: [true, true],
                output: "raw"
            },
            36: {
                name: "MAP INPUT",
                hasOperand: [true, true],
                output: "raw"
            },
            37: {
                name: "MAP OUTPUT",
                hasOperand: [true, true],
                output: "raw"
            },
            38: {
                name: "RC CHANNEL OVERRIDE",
                hasOperand: [true, true],
                output: "boolean"
            },
        }
    },
    getOperandTypes: function () {
        return {
            0: {
                name: "Value",
                type: "value",
                min: -1000000,
                max: 1000000,
                step: 1,
                default: 0
            },
            1: {
                name: "RC Channel",
                type: "range",
                range: [1, 16],
                default: 1
            },
            2: {
                name: "Flight",
                type: "dictionary",
                default: 0,
                values: {
                    0: "ARM timer [s]",
                    1: "Home distance [m]",
                    2: "Trip distance [m]",
                    3: "RSSI",
                    4: "Vbat [centi-Volt] [1V = 100]",
                    5: "Cell voltage [centi-Volt] [1V = 100]",
                    6: "Current [centi-Amp] [1A = 100]",
                    7: "Current drawn [mAh]",
                    8: "GPS Sats",
                    9: "Ground speed [cm/s]",
                    10: "3D speed [cm/s]",
                    11: "Air speed [cm/s]",
                    12: "Altitude [cm]",
                    13: "Vertical speed [cm/s]",
                    14: "Throttle position [%]",
                    15: "Roll [deg]",
                    16: "Pitch [deg]",
                    17: "Is Armed",
                    18: "Is Autolaunch",
                    19: "Is Controlling Altitude",
                    20: "Is Controlling Position",
                    21: "Is Emergency Landing",
                    22: "Is RTH",
                    23: "Is WP",
                    24: "Is Landing",
                    25: "Is Failsafe",
                    26: "Stabilized Roll",
                    27: "Stabilized Pitch",
                    28: "Stabilized Yaw",
                    29: "Current Waypoint Index",
                    30: "Current Waypoint Action",
                    31: "3D home distance [m]",
                    32: "CRSF LQ",
                    33: "CRSF SNR",
                    34: "GPS Valid Fix",
                }
            },
            3: {
                name: "Flight Mode",
                type: "dictionary",
                default: 0,
                values: {
                    0: "Failsafe",
                    1: "Manual",
                    2: "RTH",
                    3: "Position Hold",
                    4: "Cruise",
                    5: "Altitude Hold",
                    6: "Angle",
                    7: "Horizon",
                    8: "Air",
                    9: "USER 1",
                    10: "USER 2"
                }
            },
            4: {
                name: "Logic Condition",
                type: "range",
                range: [0, 31],
                default: 0
            },
            5: {
                name: "Global Variable",
                type: "range",
                range: [0, 7],
                default: 0
            },
            6: {
                name: "Programming PID",
                type: "range",
                range: [0, 3],
                default: 0
            }
        }
    }
};
