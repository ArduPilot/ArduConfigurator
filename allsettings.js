var ALLSETTINGS = {
  "applied_defaults": {
    "type": "uint8_t",
    "name": "applied_defaults",
    "mode": 0,
    "min": 0,
    "max": 3,
    "index": 162
  },
  "throttle_idle": {
    "type": "float",
    "name": "throttle_idle",
    "mode": 0,
    "min": 0,
    "max": 30,
    "index": 84
  },
  "motor_poles": {
    "type": "uint8_t",
    "name": "motor_poles",
    "mode": 0,
    "min": 4,
    "max": 255,
    "index": 85
  },
  "i2c_speed": {
    "type": "uint8_t",
    "name": "i2c_speed",
    "mode": 64,
    "min": 0,
    "max": 3,
    "index": 449,
    "table": {
      "values": [
        "400KHZ",
        "800KHZ",
        "100KHZ",
        "200KHZ"
      ]
    }
  },
  "gps_ublox_use_galileo": {
    "type": "uint8_t",
    "name": "gps_ublox_use_galileo",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 172,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "tz_offset": {
    "type": "int16_t",
    "name": "tz_offset",
    "mode": 0,
    "min": -1440,
    "max": 1440,
    "index": 458
  },
  "tz_automatic_dst": {
    "type": "uint8_t",
    "name": "tz_automatic_dst",
    "mode": 64,
    "min": 0,
    "max": 2,
    "index": 459,
    "table": {
      "values": [
        "OFF",
        "EU",
        "USA"
      ]
    }
  },
  "vbat_meter_type": {
    "type": "uint8_t",
    "name": "vbat_meter_type",
    "mode": 64,
    "min": 0,
    "max": 2,
    "index": 102,
    "table": {
      "values": [
        "NONE",
        "ADC",
        "ESC"
      ]
    }
  },
  "current_meter_type": {
    "type": "uint8_t",
    "name": "current_meter_type",
    "mode": 64,
    "min": 0,
    "max": 3,
    "index": 106,
    "table": {
      "values": [
        "NONE",
        "ADC",
        "VIRTUAL",
        "ESC"
      ]
    }
  },
  "rc_expo": {
    "type": "uint8_t",
    "name": "rc_expo",
    "mode": 0,
    "min": 0,
    "max": 100,
    "index": 140
  },
  "rc_yaw_expo": {
    "type": "uint8_t",
    "name": "rc_yaw_expo",
    "mode": 0,
    "min": 0,
    "max": 100,
    "index": 141
  },
  "max_angle_inclination_rll": {
    "type": "int16_t",
    "name": "max_angle_inclination_rll",
    "mode": 0,
    "min": 100,
    "max": 900,
    "index": 208
  },
  "max_angle_inclination_pit": {
    "type": "int16_t",
    "name": "max_angle_inclination_pit",
    "mode": 0,
    "min": 100,
    "max": 900,
    "index": 209
  },
  "gyro_main_lpf_hz": {
    "name": "gyro_main_lpf_hz"
  },
  "dyn_notch_width_percent": {
    "name": "dyn_notch_width_percent"
  },
  "dyn_notch_min_hz": {
    "name": "dyn_notch_min_hz"
  },
  "dynamic_gyro_notch_enabled": {
    "type": "uint8_t",
    "name": "dynamic_gyro_notch_enabled",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 11,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "dynamic_gyro_notch_min_hz": {
    "type": "uint16_t",
    "name": "dynamic_gyro_notch_min_hz",
    "mode": 0,
    "min": 30,
    "max": 1000,
    "index": 14
  },
  "dynamic_gyro_notch_q": {
    "type": "uint16_t",
    "name": "dynamic_gyro_notch_q",
    "mode": 0,
    "min": 1,
    "max": 1000,
    "index": 13
  },
  "setpoint_kalman_enabled": {
    "type": "uint8_t",
    "name": "setpoint_kalman_enabled",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 262,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "setpoint_kalman_q": {
    "type": "uint16_t",
    "name": "setpoint_kalman_q",
    "mode": 0,
    "min": 1,
    "max": 16000,
    "index": 263
  },
  "setpoint_kalman_w": {
    "type": "uint16_t",
    "name": "setpoint_kalman_w",
    "mode": 0,
    "min": 1,
    "max": 40,
    "index": 264
  },
  "dterm_lpf_hz": {
    "type": "uint16_t",
    "name": "dterm_lpf_hz",
    "mode": 0,
    "min": 0,
    "max": 500,
    "index": 210
  },
  "dterm_lpf2_hz": {
    "type": "uint16_t",
    "name": "dterm_lpf2_hz",
    "mode": 0,
    "min": 0,
    "max": 500,
    "index": 212
  },
  "rpm_gyro_filter_enabled": {
    "type": "uint8_t",
    "name": "rpm_gyro_filter_enabled",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 163,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "rpm_gyro_min_hz": {
    "type": "uint8_t",
    "name": "rpm_gyro_min_hz",
    "mode": 0,
    "min": 30,
    "max": 200,
    "index": 165
  },
  "acc_lpf_type": {
    "type": "uint8_t",
    "name": "acc_lpf_type",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 25,
    "table": {
      "values": [
        "PT1",
        "BIQUAD"
      ]
    }
  },
  "airmode_type": {
    "name": "airmode_type"
  },
  "airmode_throttle_threshold": {
    "name": "airmode_throttle_threshold"
  },
  "mc_iterm_relax": {
    "type": "uint8_t",
    "name": "mc_iterm_relax",
    "mode": 64,
    "min": 0,
    "max": 2,
    "index": 252,
    "table": {
      "values": [
        "OFF",
        "RP",
        "RPY"
      ]
    }
  },
  "mc_iterm_relax_cutoff": {
    "type": "uint8_t",
    "name": "mc_iterm_relax_cutoff",
    "mode": 0,
    "min": 1,
    "max": 100,
    "index": 253
  },
  "antigravity_gain": {
    "type": "float",
    "name": "antigravity_gain",
    "mode": 0,
    "min": 1,
    "max": 20,
    "index": 257
  },
  "antigravity_accelerator": {
    "type": "float",
    "name": "antigravity_accelerator",
    "mode": 0,
    "min": 1,
    "max": 20,
    "index": 258
  },
  "antigravity_cutoff_lpf_hz": {
    "type": "uint8_t",
    "name": "antigravity_cutoff_lpf_hz",
    "mode": 0,
    "min": 1,
    "max": 30,
    "index": 259
  },
  "fw_yaw_iterm_freeze_bank_angle": {
    "name": "fw_yaw_iterm_freeze_bank_angle"
  },
  "d_boost_factor": {
    "type": "float",
    "name": "d_boost_factor",
    "mode": 0,
    "min": 1,
    "max": 3,
    "index": 254
  },
  "d_boost_max_at_acceleration": {
    "type": "float",
    "name": "d_boost_max_at_acceleration",
    "mode": 0,
    "min": 1000,
    "max": 16000,
    "index": 255
  },
  "d_boost_gyro_delta_lpf_hz": {
    "type": "uint8_t",
    "name": "d_boost_gyro_delta_lpf_hz",
    "mode": 0,
    "min": 10,
    "max": 250,
    "index": 256
  },
  "fw_level_pitch_trim": {
    "name": "fw_level_pitch_trim"
  },
  "nav_fw_launch_idle_thr": {
    "type": "uint16_t",
    "name": "nav_fw_launch_idle_thr",
    "mode": 0,
    "min": 1000,
    "max": 2000,
    "index": 351
  },
  "nav_fw_launch_max_angle": {
    "type": "uint8_t",
    "name": "nav_fw_launch_max_angle",
    "mode": 0,
    "min": 5,
    "max": 180,
    "index": 348
  },
  "nav_fw_launch_velocity": {
    "type": "uint16_t",
    "name": "nav_fw_launch_velocity",
    "mode": 0,
    "min": 100,
    "max": 10000,
    "index": 346
  },
  "nav_fw_launch_accel": {
    "type": "uint16_t",
    "name": "nav_fw_launch_accel",
    "mode": 0,
    "min": 1000,
    "max": 20000,
    "index": 347
  },
  "nav_fw_launch_detect_time": {
    "type": "uint16_t",
    "name": "nav_fw_launch_detect_time",
    "mode": 0,
    "min": 10,
    "max": 1000,
    "index": 349
  },
  "nav_fw_launch_motor_delay": {
    "type": "uint16_t",
    "name": "nav_fw_launch_motor_delay",
    "mode": 0,
    "min": 0,
    "max": 5000,
    "index": 352
  },
  "nav_fw_launch_min_time": {
    "type": "uint16_t",
    "name": "nav_fw_launch_min_time",
    "mode": 0,
    "min": 0,
    "max": 60000,
    "index": 355
  },
  "nav_fw_launch_spinup_time": {
    "type": "uint16_t",
    "name": "nav_fw_launch_spinup_time",
    "mode": 0,
    "min": 0,
    "max": 1000,
    "index": 353
  },
  "nav_fw_launch_thr": {
    "type": "uint16_t",
    "name": "nav_fw_launch_thr",
    "mode": 0,
    "min": 1000,
    "max": 2000,
    "index": 350
  },
  "nav_fw_launch_climb_angle": {
    "type": "uint8_t",
    "name": "nav_fw_launch_climb_angle",
    "mode": 0,
    "min": 5,
    "max": 45,
    "index": 358
  },
  "nav_fw_launch_timeout": {
    "type": "uint16_t",
    "name": "nav_fw_launch_timeout",
    "mode": 0,
    "min": 0,
    "max": 60000,
    "index": 356
  },
  "nav_fw_launch_max_altitude": {
    "type": "uint16_t",
    "name": "nav_fw_launch_max_altitude",
    "mode": 0,
    "min": 0,
    "max": 60000,
    "index": 357
  },
  "nav_fw_launch_end_time": {
    "type": "uint16_t",
    "name": "nav_fw_launch_end_time",
    "mode": 0,
    "min": 0,
    "max": 5000,
    "index": 354
  },
  "idle_power": {
    "type": "uint16_t",
    "name": "idle_power",
    "mode": 0,
    "min": 0,
    "max": 65535,
    "index": 109
  },
  "cruise_power": {
    "type": "uint32_t",
    "name": "cruise_power",
    "mode": 0,
    "min": 0,
    "max": 4294967295,
    "index": 108
  },
  "nav_fw_cruise_speed": {
    "type": "uint16_t",
    "name": "nav_fw_cruise_speed",
    "mode": 0,
    "min": 0,
    "max": 65535,
    "index": 343
  },
  "rth_energy_margin": {
    "type": "uint8_t",
    "name": "rth_energy_margin",
    "mode": 0,
    "min": 0,
    "max": 100,
    "index": 110
  },
  "nav_fw_cruise_thr": {
    "type": "uint16_t",
    "name": "nav_fw_cruise_thr",
    "mode": 0,
    "min": 1000,
    "max": 2000,
    "index": 333
  },
  "nav_fw_pitch2thr": {
    "type": "uint8_t",
    "name": "nav_fw_pitch2thr",
    "mode": 0,
    "min": 0,
    "max": 100,
    "index": 339
  },
  "nav_fw_allow_manual_thr_increase": {
    "type": "uint8_t",
    "name": "nav_fw_allow_manual_thr_increase",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 360,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "nav_fw_min_thr": {
    "type": "uint16_t",
    "name": "nav_fw_min_thr",
    "mode": 0,
    "min": 1000,
    "max": 2000,
    "index": 334
  },
  "nav_fw_max_thr": {
    "type": "uint16_t",
    "name": "nav_fw_max_thr",
    "mode": 0,
    "min": 1000,
    "max": 2000,
    "index": 335
  },
  "nav_fw_pitch2thr_smoothing": {
    "type": "uint16_t",
    "name": "nav_fw_pitch2thr_smoothing",
    "mode": 0,
    "min": 0,
    "max": 9,
    "index": 340
  },
  "nav_fw_pitch2thr_threshold": {
    "type": "uint8_t",
    "name": "nav_fw_pitch2thr_threshold",
    "mode": 0,
    "min": 0,
    "max": 900,
    "index": 341
  },
  "nav_fw_cruise_yaw_rate": {
    "type": "uint8_t",
    "name": "nav_fw_cruise_yaw_rate",
    "mode": 0,
    "min": 0,
    "max": 60,
    "index": 359
  },
  "nav_fw_bank_angle": {
    "type": "uint8_t",
    "name": "nav_fw_bank_angle",
    "mode": 0,
    "min": 5,
    "max": 80,
    "index": 336
  },
  "nav_fw_climb_angle": {
    "type": "uint8_t",
    "name": "nav_fw_climb_angle",
    "mode": 0,
    "min": 5,
    "max": 80,
    "index": 337
  },
  "nav_fw_dive_angle": {
    "type": "uint8_t",
    "name": "nav_fw_dive_angle",
    "mode": 0,
    "min": 5,
    "max": 80,
    "index": 338
  },
  "nav_fw_loiter_radius": {
    "type": "uint16_t",
    "name": "nav_fw_loiter_radius",
    "mode": 0,
    "min": 0,
    "max": 10000,
    "index": 342
  },
  "fw_loiter_direction": {
    "type": "uint8_t",
    "name": "fw_loiter_direction",
    "mode": 64,
    "min": 0,
    "max": 2,
    "index": 216,
    "table": {
      "values": [
        "RIGHT",
        "LEFT",
        "YAW"
      ]
    }
  },
  "nav_fw_control_smoothness": {
    "type": "uint8_t",
    "name": "nav_fw_control_smoothness",
    "mode": 0,
    "min": 0,
    "max": 9,
    "index": 344
  },
  "nav_user_control_mode": {
    "type": "uint8_t",
    "name": "nav_user_control_mode",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 297,
    "table": {
      "values": [
        "ATTI",
        "CRUISE"
      ]
    }
  },
  "nav_auto_speed": {
    "type": "uint16_t",
    "name": "nav_auto_speed",
    "mode": 0,
    "min": 10,
    "max": 2000,
    "index": 301
  },
  "nav_manual_speed": {
    "type": "uint16_t",
    "name": "nav_manual_speed",
    "mode": 0,
    "min": 10,
    "max": 2000,
    "index": 303
  },
  "nav_mc_bank_angle": {
    "type": "uint8_t",
    "name": "nav_mc_bank_angle",
    "mode": 0,
    "min": 15,
    "max": 45,
    "index": 320
  },
  "nav_use_midthr_for_althold": {
    "type": "uint8_t",
    "name": "nav_use_midthr_for_althold",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 295,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "nav_mc_hover_thr": {
    "type": "uint16_t",
    "name": "nav_mc_hover_thr",
    "mode": 0,
    "min": 1000,
    "max": 2000,
    "index": 321
  },
  "nav_mc_wp_slowdown": {
    "name": "nav_mc_wp_slowdown"
  },
  "nav_mc_braking_speed_threshold": {
    "type": "uint16_t",
    "name": "nav_mc_braking_speed_threshold",
    "mode": 0,
    "min": 0,
    "max": 1000,
    "index": 323
  },
  "nav_mc_braking_disengage_speed": {
    "type": "uint16_t",
    "name": "nav_mc_braking_disengage_speed",
    "mode": 0,
    "min": 0,
    "max": 1000,
    "index": 324
  },
  "nav_mc_braking_timeout": {
    "type": "uint16_t",
    "name": "nav_mc_braking_timeout",
    "mode": 0,
    "min": 100,
    "max": 5000,
    "index": 325
  },
  "nav_mc_braking_boost_factor": {
    "type": "uint8_t",
    "name": "nav_mc_braking_boost_factor",
    "mode": 0,
    "min": 0,
    "max": 200,
    "index": 326
  },
  "nav_mc_braking_boost_timeout": {
    "type": "uint16_t",
    "name": "nav_mc_braking_boost_timeout",
    "mode": 0,
    "min": 0,
    "max": 5000,
    "index": 327
  },
  "nav_mc_braking_boost_speed_threshold": {
    "type": "uint16_t",
    "name": "nav_mc_braking_boost_speed_threshold",
    "mode": 0,
    "min": 100,
    "max": 1000,
    "index": 328
  },
  "nav_mc_braking_boost_disengage_speed": {
    "type": "uint16_t",
    "name": "nav_mc_braking_boost_disengage_speed",
    "mode": 0,
    "min": 0,
    "max": 1000,
    "index": 329
  },
  "nav_mc_braking_bank_angle": {
    "type": "uint8_t",
    "name": "nav_mc_braking_bank_angle",
    "mode": 0,
    "min": 15,
    "max": 60,
    "index": 330
  },
  "nav_rth_alt_mode": {
    "type": "uint8_t",
    "name": "nav_rth_alt_mode",
    "mode": 64,
    "min": 0,
    "max": 5,
    "index": 315,
    "table": {
      "values": [
        "CURRENT",
        "EXTRA",
        "FIXED",
        "MAX",
        "AT_LEAST",
        "AT_LEAST_LINEAR_DESCENT"
      ]
    }
  },
  "nav_rth_altitude": {
    "type": "uint16_t",
    "name": "nav_rth_altitude",
    "mode": 0,
    "min": 0,
    "max": 65000,
    "index": 318
  },
  "nav_rth_home_altitude": {
    "type": "uint16_t",
    "name": "nav_rth_home_altitude",
    "mode": 0,
    "min": 0,
    "max": 65000,
    "index": 319
  },
  "nav_rth_climb_first": {
    "type": "uint8_t",
    "name": "nav_rth_climb_first",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 311,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "nav_rth_climb_ignore_emerg": {
    "type": "uint8_t",
    "name": "nav_rth_climb_ignore_emerg",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 312,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "nav_rth_alt_control_override": {
    "name": "nav_rth_alt_control_override"
  },
  "nav_rth_tail_first": {
    "type": "uint8_t",
    "name": "nav_rth_tail_first",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 313,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "nav_rth_allow_landing": {
    "type": "uint8_t",
    "name": "nav_rth_allow_landing",
    "mode": 64,
    "min": 0,
    "max": 2,
    "index": 314,
    "table": {
      "values": [
        "NEVER",
        "ALWAYS",
        "FS_ONLY"
      ]
    }
  },
  "nav_min_rth_distance": {
    "type": "uint16_t",
    "name": "nav_min_rth_distance",
    "mode": 0,
    "min": 0,
    "max": 5000,
    "index": 309
  },
  "nav_rth_abort_threshold": {
    "type": "uint16_t",
    "name": "nav_rth_abort_threshold",
    "mode": 0,
    "min": 0,
    "max": 65000,
    "index": 316
  },
  "nav_manual_climb_rate": {
    "type": "uint16_t",
    "name": "nav_manual_climb_rate",
    "mode": 0,
    "min": 10,
    "max": 2000,
    "index": 304
  },
  "nav_auto_climb_rate": {
    "type": "uint16_t",
    "name": "nav_auto_climb_rate",
    "mode": 0,
    "min": 10,
    "max": 2000,
    "index": 302
  },
  "nav_wp_radius": {
    "type": "uint16_t",
    "name": "nav_wp_radius",
    "mode": 0,
    "min": 10,
    "max": 10000,
    "index": 299
  },
  "nav_wp_safe_distance": {
    "type": "uint16_t",
    "name": "nav_wp_safe_distance",
    "mode": 0,
    "min": 0,
    "max": 65000,
    "index": 300
  },
  "nav_land_maxalt_vspd": {
    "name": "nav_land_maxalt_vspd"
  },
  "nav_land_slowdown_maxalt": {
    "type": "uint16_t",
    "name": "nav_land_slowdown_maxalt",
    "mode": 0,
    "min": 500,
    "max": 4000,
    "index": 307
  },
  "nav_land_minalt_vspd": {
    "name": "nav_land_minalt_vspd"
  },
  "nav_land_slowdown_minalt": {
    "type": "uint16_t",
    "name": "nav_land_slowdown_minalt",
    "mode": 0,
    "min": 50,
    "max": 1000,
    "index": 306
  },
  "nav_emerg_landing_speed": {
    "type": "uint16_t",
    "name": "nav_emerg_landing_speed",
    "mode": 0,
    "min": 100,
    "max": 2000,
    "index": 308
  },
  "receiver_type": {
    "type": "uint8_t",
    "name": "receiver_type",
    "mode": 64,
    "min": 0,
    "max": 5,
    "index": 56,
    "table": {
      "values": [
        "NONE",
        "PPM",
        "SERIAL",
        "MSP",
        "SPI",
        "UIB"
      ]
    }
  },
  "serialrx_provider": {
    "type": "uint8_t",
    "name": "serialrx_provider",
    "mode": 64,
    "min": 0,
    "max": 14,
    "index": 65,
    "table": {
      "values": [
        "SPEK1024",
        "SPEK2048",
        "SBUS",
        "SUMD",
        "SUMH",
        "XB-B",
        "XB-B-RJ01",
        "IBUS",
        "JETIEXBUS",
        "CRSF",
        "FPORT",
        "SBUS_FAST",
        "FPORT2",
        "SRXL2",
        "GHST"
      ]
    }
  },
  "serialrx_inverted": {
    "type": "uint8_t",
    "name": "serialrx_inverted",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 66,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "serialrx_halfduplex": {
    "type": "uint8_t",
    "name": "serialrx_halfduplex",
    "mode": 64,
    "min": 0,
    "max": 2,
    "index": 72,
    "table": {
      "values": [
        "AUTO",
        "ON",
        "OFF"
      ]
    }
  },
  "osd_main_voltage_decimals": {
    "type": "uint8_t",
    "name": "osd_main_voltage_decimals",
    "mode": 0,
    "min": 1,
    "max": 2,
    "index": 434
  },
  "osd_coordinate_digits": {
    "type": "uint8_t",
    "name": "osd_coordinate_digits",
    "mode": 0,
    "min": 8,
    "max": 11,
    "index": 435
  },
  "osd_plus_code_digits": {
    "type": "uint8_t",
    "name": "osd_plus_code_digits",
    "mode": 0,
    "min": 10,
    "max": 13,
    "index": 438
  },
  "osd_plus_code_short": {
    "name": "osd_plus_code_short"
  },
  "osd_crosshairs_style": {
    "type": "uint8_t",
    "name": "osd_crosshairs_style",
    "mode": 64,
    "min": 0,
    "max": 6,
    "index": 416,
    "table": {
      "values": [
        "DEFAULT",
        "AIRCRAFT",
        "TYPE3",
        "TYPE4",
        "TYPE5",
        "TYPE6",
        "TYPE7"
      ]
    }
  },
  "osd_left_sidebar_scroll": {
    "type": "uint8_t",
    "name": "osd_left_sidebar_scroll",
    "mode": 64,
    "min": 0,
    "max": 3,
    "index": 431,
    "table": {
      "values": [
        "NONE",
        "ALTITUDE",
        "GROUND_SPEED",
        "HOME_DISTANCE"
      ]
    }
  },
  "osd_right_sidebar_scroll": {
    "type": "uint8_t",
    "name": "osd_right_sidebar_scroll",
    "mode": 64,
    "min": 0,
    "max": 3,
    "index": 432,
    "table": {
      "values": [
        "NONE",
        "ALTITUDE",
        "GROUND_SPEED",
        "HOME_DISTANCE"
      ]
    }
  },
  "osd_crsf_lq_format": {
    "type": "uint8_t",
    "name": "osd_crsf_lq_format",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 417,
    "table": {
      "values": [
        "TYPE1",
        "TYPE2"
      ]
    }
  },
  "osd_sidebar_scroll_arrows": {
    "type": "uint8_t",
    "name": "osd_sidebar_scroll_arrows",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 433,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "osd_home_position_arm_screen": {
    "type": "uint8_t",
    "name": "osd_home_position_arm_screen",
    "mode": 64,
    "min": 0,
    "max": 1,
    "index": 448,
    "table": {
      "values": [
        "OFF",
        "ON"
      ]
    }
  },
  "osd_rssi_alarm": {
    "type": "uint8_t",
    "name": "osd_rssi_alarm",
    "mode": 0,
    "min": 0,
    "max": 100,
    "index": 396
  },
  "osd_time_alarm": {
    "type": "uint16_t",
    "name": "osd_time_alarm",
    "mode": 0,
    "min": 0,
    "max": 600,
    "index": 397
  },
  "osd_alt_alarm": {
    "type": "uint16_t",
    "name": "osd_alt_alarm",
    "mode": 0,
    "min": 0,
    "max": 10000,
    "index": 398
  },
  "osd_neg_alt_alarm": {
    "type": "uint16_t",
    "name": "osd_neg_alt_alarm",
    "mode": 0,
    "min": 0,
    "max": 10000,
    "index": 400
  },
  "osd_dist_alarm": {
    "type": "uint16_t",
    "name": "osd_dist_alarm",
    "mode": 0,
    "min": 0,
    "max": 50000,
    "index": 399
  },
  "osd_gforce_alarm": {
    "type": "float",
    "name": "osd_gforce_alarm",
    "mode": 0,
    "min": 0,
    "max": 20,
    "index": 402
  },
  "osd_gforce_axis_alarm_min": {
    "type": "float",
    "name": "osd_gforce_axis_alarm_min",
    "mode": 0,
    "min": -20,
    "max": 20,
    "index": 403
  },
  "osd_gforce_axis_alarm_max": {
    "type": "float",
    "name": "osd_gforce_axis_alarm_max",
    "mode": 0,
    "min": -20,
    "max": 20,
    "index": 404
  },
  "osd_current_alarm": {
    "type": "uint8_t",
    "name": "osd_current_alarm",
    "mode": 0,
    "min": 0,
    "max": 255,
    "index": 401
  },
  "osd_imu_temp_alarm_min": {
    "type": "int16_t",
    "name": "osd_imu_temp_alarm_min",
    "mode": 0,
    "min": -550,
    "max": 1250,
    "index": 405
  },
  "osd_imu_temp_alarm_max": {
    "type": "int16_t",
    "name": "osd_imu_temp_alarm_max",
    "mode": 0,
    "min": -550,
    "max": 1250,
    "index": 406
  },
  "osd_baro_temp_alarm_min": {
    "type": "int16_t",
    "name": "osd_baro_temp_alarm_min",
    "mode": 0,
    "min": -550,
    "max": 1250,
    "index": 409
  },
  "osd_baro_temp_alarm_max": {
    "type": "int16_t",
    "name": "osd_baro_temp_alarm_max",
    "mode": 0,
    "min": -550,
    "max": 1250,
    "index": 410
  },
  "osd_esc_temp_alarm_min": {
    "type": "int16_t",
    "name": "osd_esc_temp_alarm_min",
    "mode": 0,
    "min": -550,
    "max": 1500,
    "index": 408
  },
  "osd_esc_temp_alarm_max": {
    "type": "int16_t",
    "name": "osd_esc_temp_alarm_max",
    "mode": 0,
    "min": -550,
    "max": 1500,
    "index": 407
  },
  "osd_snr_alarm": {
    "type": "int16_t",
    "name": "osd_snr_alarm",
    "mode": 0,
    "min": -12,
    "max": 8,
    "index": 411
  },
  "osd_link_quality_alarm": {
    "type": "int8_t",
    "name": "osd_link_quality_alarm",
    "mode": 0,
    "min": 0,
    "max": 100,
    "index": 412
  },
  "CONFIG": {
    "apiVersion": "2.4.0",
    "flightControllerIdentifier": "INAV",
    "flightControllerVersion": "2.6.1",
    "version": 0,
    "buildInfo": "Feb 25 2021 10:55:13",
    "multiType": 0,
    "msp_version": 0,
    "capability": 0,
    "cycleTime": 504,
    "i2cError": 50,
    "activeSensors": 195,
    "mode": [
      65536,
      0
    ],
    "profile": 0,
    "battery_profile": 0,
    "uid": [
      3211306,
      876105989,
      875640113
    ],
    "accelerometerTrims": [
      0,
      0
    ],
    "armingFlags": 270336,
    "name": "",
    "mspProtocolVersion": 0,
    "boardIdentifier": "M765",
    "boardVersion": 0,
    "cpuload": 3
  },
  "BF_CONFIG": {
    "mixerConfiguration": 3,
    "features": 541592582,
    "serialrx_type": 2,
    "board_align_roll": 0,
    "board_align_pitch": 0,
    "board_align_yaw": 0,
    "currentscale": 250,
    "currentoffset": 0
  },


"LED_STRIP":[{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""},{"x":0,"y":0,"directions":"","functions":""}],
"LED_COLORS":[{"h":0,"s":0,"v":0},{"h":0,"s":255,"v":255},{"h":0,"s":0,"v":255},{"h":30,"s":0,"v":255},{"h":60,"s":0,"v":255},{"h":90,"s":0,"v":255},{"h":120,"s":0,"v":255},{"h":150,"s":0,"v":255},{"h":180,"s":0,"v":255},{"h":210,"s":0,"v":255},{"h":240,"s":0,"v":255},{"h":270,"s":0,"v":255},{"h":300,"s":0,"v":255},{"h":330,"s":0,"v":255},{"h":0,"s":0,"v":0},{"h":0,"s":0,"v":0}],
"LED_MODE_COLORS":[{"mode":0,"direction":0,"color":1},{"mode":0,"direction":1,"color":11},{"mode":0,"direction":2,"color":2},{"mode":0,"direction":3,"color":13},{"mode":0,"direction":4,"color":10},{"mode":0,"direction":5,"color":3},{"mode":1,"direction":0,"color":5},{"mode":1,"direction":1,"color":11},{"mode":1,"direction":2,"color":3},{"mode":1,"direction":3,"color":13},{"mode":1,"direction":4,"color":10},{"mode":1,"direction":5,"color":3},{"mode":2,"direction":0,"color":10},{"mode":2,"direction":1,"color":11},{"mode":2,"direction":2,"color":4},{"mode":2,"direction":3,"color":13},{"mode":2,"direction":4,"color":10},{"mode":2,"direction":5,"color":3},{"mode":3,"direction":0,"color":8},{"mode":3,"direction":1,"color":11},{"mode":3,"direction":2,"color":4},{"mode":3,"direction":3,"color":13},{"mode":3,"direction":4,"color":10},{"mode":3,"direction":5,"color":3},{"mode":4,"direction":0,"color":7},{"mode":4,"direction":1,"color":11},{"mode":4,"direction":2,"color":3},{"mode":4,"direction":3,"color":13},{"mode":4,"direction":4,"color":10},{"mode":4,"direction":5,"color":3},{"mode":5,"direction":0,"color":9},{"mode":5,"direction":1,"color":11},{"mode":5,"direction":2,"color":2},{"mode":5,"direction":3,"color":13},{"mode":5,"direction":4,"color":10},{"mode":5,"direction":5,"color":3},{"mode":6,"direction":0,"color":6},{"mode":6,"direction":1,"color":10},{"mode":6,"direction":2,"color":1},{"mode":6,"direction":3,"color":0},{"mode":6,"direction":4,"color":0},{"mode":6,"direction":5,"color":2},{"mode":6,"direction":6,"color":3},{"mode":6,"direction":7,"color":6},{"mode":6,"direction":8,"color":0},{"mode":6,"direction":9,"color":0},{"mode":6,"direction":10,"color":0}],

  "PID": {},
  "PID_names": [
    "ROLL",
    "PITCH",
    "YAW",
    "ALT",
    "Pos",
    "PosR",
    "NavR",
    "LEVEL",
    "MAG",
    "VEL"
  ],
  "PIDs": [
    [
      40,
      60,
      23,
      60
    ],
    [
      44,
      75,
      25,
      60
    ],
    [
      35,
      80,
      0,
      60
    ],
    [
      50,
      0,
      0,
      0
    ],
    [
      65,
      0,
      0,
      0
    ],
    [
      40,
      15,
      100,
      40
    ],
    [
      0,
      0,
      0,
      0
    ],
    [
      20,
      15,
      75,
      0
    ],
    [
      60,
      0,
      0,
      0
    ],
    [
      100,
      50,
      10,
      0
    ],
    [
      0,
      0,
      0,
      0
    ]
  ],
  "RC_MAP": [
    0,
    1,
    3,
    2
  ],
  "RC": {
    "active_channels": 18,
    "channels": [
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      1500,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  },
  "RC_tuning": {
    "RC_RATE": 100,
    "RC_EXPO": 0.7,
    "roll_pitch_rate": 0,
    "roll_rate": 700,
    "pitch_rate": 700,
    "yaw_rate": 600,
    "dynamic_THR_PID": 20,
    "throttle_MID": 0.5,
    "throttle_EXPO": 0,
    "dynamic_THR_breakpoint": 1200,
    "RC_YAW_EXPO": 0.7,
    "manual_RC_EXPO": 0.7,
    "manual_RC_YAW_EXPO": 0.2,
    "manual_roll_rate": 100,
    "manual_pitch_rate": 100,
    "manual_yaw_rate": 100
  },
  "AUX_CONFIG": [
    "ARM",
    "ANGLE",
    "HORIZON",
    "TURN ASSIST",
    "HEADING HOLD",
    "HEADFREE",
    "HEADADJ",
    "FPV ANGLE MIX",
    "CAMSTAB",
    "NAV ALTHOLD",
    "SURFACE",
    "MC BRAKING",
    "BEEPER",
    "OSD SW",
    "BLACKBOX",
    "KILLSWITCH",
    "FAILSAFE",
    "CAMERA CONTROL 1",
    "CAMERA CONTROL 2",
    "CAMERA CONTROL 3",
    "USER1",
    "USER2",
    "OSD ALT 1",
    "OSD ALT 2",
    "OSD ALT 3"
  ],
  "AUX_CONFIG_IDS": [
    0,
    1,
    2,
    35,
    5,
    6,
    7,
    32,
    8,
    3,
    33,
    46,
    13,
    19,
    26,
    38,
    27,
    39,
    40,
    41,
    47,
    48,
    42,
    43,
    44
  ],
  "MODE_RANGES": [
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    },
    {
      "id": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      }
    }
  ],
  "ADJUSTMENT_RANGES": [
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    },
    {
      "slotIndex": 0,
      "auxChannelIndex": 0,
      "range": {
        "start": 900,
        "end": 900
      },
      "adjustmentFunction": 0,
      "auxSwitchChannelIndex": 0
    }
  ],
  "SERVO_CONFIG": [
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    },
    {
      "min": 1000,
      "max": 2000,
      "middle": 1500,
      "rate": 100,
      "indexOfChannelToForward": -1
    }
  ],
  "SERVO_RULES": {},
  "MOTOR_RULES": {},
  "LOGIC_CONDITIONS": {},
  "LOGIC_CONDITIONS_STATUS": {},
  "GLOBAL_VARIABLES_STATUS": {},
  "PROGRAMMING_PID": {},
  "PROGRAMMING_PID_STATUS": {},
  "SERIAL_CONFIG": {
    "ports": [
      {
        "identifier": 20,
        "functions": [
          "MSP"
        ],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 0,
        "functions": [
          "MSP"
        ],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 1,
        "functions": [],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 2,
        "functions": [],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 3,
        "functions": [],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 5,
        "functions": [
          "RX_SERIAL"
        ],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 6,
        "functions": [],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      },
      {
        "identifier": 7,
        "functions": [],
        "msp_baudrate": "115200",
        "sensors_baudrate": "115200",
        "telemetry_baudrate": "AUTO",
        "blackbox_baudrate": "115200"
      }
    ],
    "mspBaudRate": 0,
    "gpsBaudRate": 0,
    "gpsPassthroughBaudRate": 0,
    "cliBaudRate": 0
  },
  "SENSOR_DATA": {
    "gyroscope": [
      0,
      0,
      0
    ],
    "accelerometer": [
      -0.029296875,
      0.166015625,
      1.181640625
    ],
    "magnetometer": [
      0,
      0,
      0
    ],
    "altitude": 0,
    "barometer": 1.01,
    "sonar": 0,
    "air_speed": 0,
    "kinematics": [
      7.9,
      1.3,
      346
    ],
    "temperature": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "debug": [
      0,
      0,
      0,
      0
    ]
  },
  "MOTOR_DATA": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ],
  "SERVO_DATA": [
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500,
    1500
  ],
  "GPS_DATA": {
    "fix": 0,
    "numSat": 0,
    "lat": 0,
    "lon": 0,
    "alt": 0,
    "speed": 0,
    "ground_course": 0,
    "distanceToHome": 0,
    "ditectionToHome": 0,
    "update": 0,
    "hdop": 0,
    "eph": 0,
    "epv": 0,
    "messageDt": 0,
    "errors": 0,
    "timeouts": 0,
    "packetCount": 0
  },
  "MISSION_PLANER": {},
  "ANALOG": {
    "board_vcc": 0,
    "voltage": 0,
    "mAhdrawn": 5,
    "mWhdrawn": 0,
    "rssi": 0,
    "amperage": 0.03,
    "power": 0,
    "cell_count": 1,
    "battery_percentage": 0,
    "battery_full_when_plugged_in": false,
    "use_capacity_thresholds": false,
    "battery_remaining_capacity": 0,
    "battery_flags": 0,
    "battery_state": 3
  },
  "ARMING_CONFIG": {
    "auto_disarm_delay": 0,
    "disarm_kill_switch": 1
  },
  "FC_CONFIG": {
    "loopTime": "500"
  },
  "MISC": {
    "midrc": 1500,
    "minthrottle": 0,
    "maxthrottle": 1850,
    "mincommand": 1000,
    "failsafe_throttle": 1000,
    "gps_type": 1,
    "sensors_baudrate": 0,
    "gps_ubx_sbas": 5,
    "multiwiicurrentoutput": 0,
    "rssi_channel": 0,
    "placeholder2": 0,
    "mag_declination": 0,
    "battery_cells": 0,
    "vbatscale": 110,
    "vbatdetectcellvoltage": 4.3,
    "vbatmincellvoltage": 3.3,
    "vbatmaxcellvoltage": 4.2,
    "vbatwarningcellvoltage": 3.5,
    "battery_capacity": 0,
    "battery_capacity_warning": 0,
    "battery_capacity_critical": 0,
    "battery_capacity_unit": "mAh",
    "voltage_source": 0
  },
  "REVERSIBLE_MOTORS": {
    "deadband_low": 1406,
    "deadband_high": 1514,
    "neutral": 1460,
    "deadband_throttle": 50
  },
  "DATAFLASH": {
    "ready": false,
    "supported": false,
    "sectors": 0,
    "totalSize": 0,
    "usedSize": 0
  },
  "SDCARD": {
    "supported": true,
    "state": 4,
    "filesystemLastError": 0,
    "freeSizeKB": 4190240,
    "totalSizeKB": 30375936
  },
  "BLACKBOX": {
    "supported": true,
    "blackboxDevice": 2,
    "blackboxRateNum": 256,
    "blackboxRateDenom": 512
  },
  "TRANSPONDER": {
    "supported": false,
    "data": []
  },
  "RC_deadband": {
    "deadband": 5,
    "yaw_deadband": 5,
    "alt_hold_deadband": 50
  },
  "SENSOR_ALIGNMENT": {
    "align_gyro": 0,
    "align_acc": 0,
    "align_mag": 0,
    "align_opflow": 5
  },
  "RX_CONFIG": {
    "receiver_type": 2,
    "serialrx_provider": 2,
    "maxcheck": 1900,
    "midrc": 1500,
    "mincheck": 1100,
    "spektrum_sat_bind": 0,
    "rx_min_usec": 885,
    "rx_max_usec": 2115,
    "spirx_protocol": 0,
    "spirx_id": 0,
    "spirx_channel_count": 0
  },
  "FAILSAFE_CONFIG": {
    "failsafe_delay": 5,
    "failsafe_off_delay": 200,
    "failsafe_throttle": 1000,
    "failsafe_kill_switch": 0,
    "failsafe_throttle_low_delay": 0,
    "failsafe_procedure": 0,
    "failsafe_recovery_delay": 5,
    "failsafe_fw_roll_angle": 65336,
    "failsafe_fw_pitch_angle": 100,
    "failsafe_fw_yaw_rate": 65491,
    "failsafe_stick_motion_threshold": 50,
    "failsafe_min_distance": 0,
    "failsafe_min_distance_procedure": 1
  },
  "RXFAIL_CONFIG": [],
  "VTX_CONFIG": {
    "device_type": 255,
    "band": 0,
    "channel": 1,
    "power": 0,
    "pitmode": 0,
    "low_power_disarm": 0
  },
  "ADVANCED_CONFIG": {
    "gyroSyncDenominator": 1,
    "pidProcessDenom": 1,
    "useUnsyncedPwm": 1,
    "motorPwmProtocol": 1,
    "motorPwmRate": 400,
    "servoPwmRate": 50,
    "gyroSync": 1
  },
  "INAV_PID_CONFIG": {
    "asynchronousMode": 0,
    "accelerometerTaskFrequency": 0,
    "attitudeTaskFrequency": 0,
    "magHoldRateLimit": 90,
    "magHoldErrorLpfFrequency": 2,
    "yawJumpPreventionLimit": 0,
    "gyroscopeLpf": 0,
    "accSoftLpfHz": 15
  },
  "PID_ADVANCED": {
    "rollPitchItermIgnoreRate": 0,
    "yawItermIgnoreRate": 0,
    "yawPLimit": 0,
    "axisAccelerationLimitRollPitch": 0,
    "axisAccelerationLimitYaw": 1000,
    "dtermSetpointWeight": 0,
    "pidSumLimit": 500
  },
  "FILTER_CONFIG": {
    "gyroSoftLpfHz": 60,
    "dtermLpfHz": 110,
    "yawLpfHz": 0,
    "gyroNotchHz1": 0,
    "gyroNotchCutoff1": 1,
    "dtermNotchHz": 0,
    "dtermNotchCutoff": 1,
    "gyroNotchHz2": 0,
    "gyroNotchCutoff2": 1,
    "accNotchHz": 0,
    "accNotchCutoff": 1,
    "gyroStage2LowpassHz": 0
  },
  "SENSOR_STATUS": {
    "isHardwareHealthy": 1,
    "gyroHwStatus": 1,
    "accHwStatus": 1,
    "magHwStatus": 0,
    "baroHwStatus": 1,
    "gpsHwStatus": 0,
    "rangeHwStatus": 0,
    "speedHwStatus": 1,
    "flowHwStatus": 0
  },
  "SENSOR_CONFIG": {
    "accelerometer": 7,
    "barometer": 4,
    "magnetometer": 0,
    "pitot": 3,
    "rangefinder": 0,
    "opflow": 0
  },
  "NAV_POSHOLD": {
    "userControlMode": null,
    "maxSpeed": null,
    "maxClimbRate": null,
    "maxManualSpeed": null,
    "maxManualClimbRate": null,
    "maxBankAngle": null,
    "useThrottleMidForAlthold": null,
    "hoverThrottle": null
  },
  "CALIBRATION_DATA": {
    "acc": {
      "Pos0": 0,
      "Pos1": 0,
      "Pos2": 0,
      "Pos3": 0,
      "Pos4": 0,
      "Pos5": 0
    },
    "accZero": {
      "X": 0,
      "Y": 0,
      "Z": 0
    },
    "accGain": {
      "X": 4096,
      "Y": 4096,
      "Z": 4096
    },
    "magZero": {
      "X": 0,
      "Y": 0,
      "Z": 0
    },
    "opflow": {
      "Scale": 10.5
    },
    "magGain": {
      "X": 1024,
      "Y": 1024,
      "Z": 1024
    }
  },
  "POSITION_ESTIMATOR": {
    "w_z_baro_p": null,
    "w_z_gps_p": null,
    "w_z_gps_v": null,
    "w_xy_gps_p": null,
    "w_xy_gps_v": null,
    "gps_min_sats": null,
    "use_gps_velned": null
  },
  "RTH_AND_LAND_CONFIG": {
    "minRthDistance": null,
    "rthClimbFirst": null,
    "rthClimbIgnoreEmergency": null,
    "rthTailFirst": null,
    "rthAllowLanding": null,
    "rthAltControlMode": null,
    "rthAbortThreshold": null,
    "rthAltitude": null,
    "landDescentRate": null,
    "landSlowdownMinAlt": null,
    "landSlowdownMaxAlt": null,
    "emergencyDescentRate": null
  },
  "FW_CONFIG": {
    "cruiseThrottle": null,
    "minThrottle": null,
    "maxThrottle": null,
    "maxBankAngle": null,
    "maxClimbAngle": null,
    "maxDiveAngle": null,
    "pitchToThrottle": null,
    "loiterRadius": null
  },
  "MIXER_CONFIG": {
    "yawMotorDirection": 0,
    "yawJumpPreventionLimit": 0,
    "platformType": 0,
    "hasFlaps": 0,
    "appliedMixerPreset": -1,
    "numberOfMotors": 12,
    "numberOfServos": 16
  },
  "BATTERY_CONFIG": {
    "vbatscale": 0,
    "vbatdetectcellvoltage": 0,
    "vbatmincellvoltage": 0,
    "vbatmaxcellvoltage": 0,
    "vbatwarningcellvoltage": 0,
    "current_offset": 0,
    "current_scale": 0,
    "capacity": 0,
    "capacity_warning": 0,
    "capacity_critical": 0,
    "capacity_unit": 0
  },
  "OUTPUT_MAPPING": {},
  //-----------------------------------------------------------
  "BRAKING_CONFIG": {
    "speedThreshold": null,
    "disengageSpeed": null,
    "timeout": null,
    "boostFactor": null,
    "boostTimeout": null,
    "boostSpeedThreshold": null,
    "boostDisengageSpeed": null,
    "bankAngle": null
  },
  "SAFEHOMES": {}
};