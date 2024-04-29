/**
 * @brief Acore object ID
 */
let OBJ = {
    INVALID : 0,
    USER : 1,
    ACORE_TOOL : 2,
    ACORE_CODER_SRC : 3,
    ACORE_CODER_SINK : 4,
    ACORE_DSP_SRC : 5,
    ACORE_DSP_SINK : 6,
    ACORE_DSP_GAIN : 7,
    ACORE_DSP_AGC : 8,
    ACORE_DSP_DRC_UL : 9,
    ACORE_DSP_DRC_DL : 10,
    ACORE_DSP_PEQ_UL : 11,
    ACORE_DSP_PEQ_DL : 12,
    ACORE_DSP_AEC : 13,
    ACORE_DSP_NS : 14,
    ACORE_DSP_ASP : 15,
    ACORE_DSP : 16,
    ACORE_DSP_MBDRC : 17,
    ACORE_DSP_IIR_FILTER : 18,
};

/**
 * @brief Direction
 */
let DIRECTION = {
    IN : 0,
    OUT : 1,
};

/**
 * @brief Mode
 */
let MODE = {
    MONO : 0,
    STEREO : 1,
};

/**
 * @brief The port of austreamer element pad
 */
let SNIFFER_INDEX = {
    PAD_0 : 0, // default port
    PAD_1 : 1,
    PAD_2 : 2,
};

let AUDIO_TOOL = {
    NULL : 0,
    FILE : 1,
};

let SNIFFER_ENABLE_MASK    = 0xFE;
let SNIFFER_DIRECTION_MASK = 0xFD;
let SNIFFER_INDEX_MASK     = 0xC3;

/**
 * @brief Macros for converting integers to a big endian byte stream, with
 * increment.
 * @param n The integers.
 * @param p The big endian byte stream.
 */
function UINT16_TO_BSTREAM(n, p)
{
    p[0] = (n >> 8) & 0xFF;
    p[1] = n & 0xFF;
}

function UINT32_TO_BSTREAM(n, p)
{

    p[0] = (n >> 24) & 0xFF;
    p[1] = (n >> 16) & 0xFF;
    p[2] = (n >> 8) & 0xFF;
    p[3] = n & 0xFF;
}

/**
 * @brief Convert a big endian byte stream to integers, with
 * increment.
 * @param p The big endian byte stream.
 */
function BSTREAM_TO_UINT16(p)
{
    return (p[0] << 8) | p[1];
}

function BSTREAM_TO_UINT32(p)
{
    return (p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3];
}

/**
 * @brief Message Endpoint
 */
let MSG_EP_AGENT = {
    DSP : 0x01 << 2,
    MCU : 0x02 << 2,
    PC : 0x03 << 2,
};

/**
 * @brief The type of frame.
 */
let FRAME_TYPE = {
    INVALID : 0,
    ACORE_MESSAGE : 1,
    AUDIO_DATA : 2,
}

/**
 * @brief Message IDs
 */
let HAL_Audio_HW_Control_Request     = 0x1B;
let HAL_Audio_HW_Control_Response    = 0x1C;
let HAL_Audio_HW_Read_Request        = 0x1D;
let HAL_Audio_HW_Read_Response       = 0x1E;
let HAL_Audio_Buffers_Request        = 0x30;
let HAL_Audio_Buffers_Response       = 0x31;
let HAL_Audio_Config_Request         = 0x32;
let HAL_Audio_Config_Response        = 0x33;
let HAL_Audio_Playback_Data_Request  = 0x34;
let HAL_Audio_Playback_Data_Response = 0x35;
let HAL_Audio_Record_Data_Request    = 0x36;
let HAL_Audio_Record_Data_Response   = 0x37;
let HAL_Audio_Node_Data_Notify       = 0x38;
let HAL_Audio_Tone_Generate_Request  = 0x00;

/**
 * @brief Audio Sub-Block IDs
 */
let HAL_Audio_SB_Primary_Spkr_Settings       = 0x0002;
let HAL_Audio_SB_UL_AGC_Flag                 = 0x0009;
let HAL_Audio_SB_UL_AGC_Attack_Time_ms       = 0x0010;
let HAL_Audio_SB_UL_AGC_Decay_Time_ms        = 0x0011;
let HAL_Audio_SB_UL_AGC_Target               = 0x0012;
let HAL_Audio_SB_UL_DRC_Attack_Time_ms       = 0x0013;
let HAL_Audio_SB_UL_DRC_Decay_Time_ms        = 0x0014;
let HAL_Audio_SB_UL_DRC_Gain                 = 0x0015;
let HAL_Audio_SB_UL_DRC_Knee_Threshold       = 0x0016;
let HAL_Audio_SB_UL_DRC_Noise_Gate           = 0x0017;
let HAL_Audio_SB_UL_DRC_Slope                = 0x0018;
let HAL_Audio_SB_UL_PEQ_Center_Freq          = 0x0019;
let HAL_Audio_SB_UL_PEQ_Qfactor              = 0x001a;
let HAL_Audio_SB_UL_PEQ_Gain                 = 0x001b;
let HAL_Audio_SB_MCPS                        = 0x0032;
let HAL_Audio_SB_Sniffer_Enable              = 0x0034;
let HAL_Audio_SB_Sniffer_Activate            = 0x0035;
let HAL_Audio_SB_Bypass                      = 0x0036;
let HAL_Audio_SB_UL_MBDRC_Bound_High         = 0x001c;
let HAL_Audio_SB_UL_MBDRC_Compress_Threshold = 0x001d;
let HAL_Audio_SB_UL_MBDRC_Compress_Slope     = 0x001e;
let HAL_Audio_SB_UL_NS_LEVEL                 = 0x001f;
let HAL_Audio_SB_UL_AEC                      = 0x0020;
/**
 * @brief Phonet protocol header length offset
 */
let PHONET_LEN_OFFSET = 6;

/**
 * @brief Convert the members of object to the message stream
 * @param sbMsg The message stream.
 * @param settings The members of object.
 */
function setMsg(sbMsg, settings)
{
    let offset = 0;
    for (let prop in settings)
    {
        let array = settings[prop];
        sbMsg.set(array, offset);
        offset += array.BYTES_PER_ELEMENT * array.length;
    }
}

/**
 * @brief Transfer AEC parameter via serial port
 * @param port The port of serial
 * @param filter_len_str The AEC filter length.
 * @param fixed_delay_str The AEC fixed delay.
 * @param nlp_enable_str The AEC NLP state.
 * @param nlp_level_str The AEC NLP level.
 */
function setAec(port, filter_len_str, fixed_delay_str, nlp_enable_str,
                nlp_level_str)
{
    if (!port)
    {
        log("Please check WebUSB connection.");
        return;
    }

    console.log("set Aec Filter Length: [" + filter_len_str + "]\n");
    console.log("set Aec Fixed Delay: [" + fixed_delay_str + "]\n");
    console.log("set Aec Nlp Enable: [" + nlp_enable_str + "]\n");
    console.log("set Aec Nlp level: [" + nlp_level_str + "]\n");

    // Coverts the string to a decimal int
    let filter_len = parseInt(filter_len_str, 10);
    // 32 bytes * 4ms / 2 bytes.
    filter_len      = filter_len * 32 * 4 / 2;
    let fixed_delay = parseInt(fixed_delay_str, 10);
    let nlp_level   = parseInt(nlp_level_str, 10);

    let frameTypeSize  = 2;
    let numOfSubblocks = 1;
    let frameType      = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block AGC attack time
    let aec = {
        block_id : new Uint8Array(2),    /**< Block id */
        block_len : new Uint8Array(2),   /**< Block length */
        enable : new Uint8Array(2),      /**< AEC enable */
        filter_len : new Uint8Array(2),  /**< Filter length */
        fixed_delay : new Uint8Array(2), /**< Fixed_delay */
        nlp_enable : new Uint8Array(2),  /**< NLP enable */
        nlp_level : new Uint8Array(2),   /**< NLP level */

    };

    // Count aec size
    let aec_size = 0;
    for (let prop in aec)
    {
        let array = aec[prop];
        aec_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + aec_size - PHONET_LEN_OFFSET;

    // Set the type of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = OBJ.ACORE_DSP_AEC;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of agc_attack_time
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_AEC, aec.block_id);
    UINT16_TO_BSTREAM(aec_size, aec.block_len);
    UINT16_TO_BSTREAM(true, aec.enable);
    UINT16_TO_BSTREAM(filter_len, aec.filter_len);
    UINT16_TO_BSTREAM(filter_len, aec.filter_len);
    UINT16_TO_BSTREAM(fixed_delay, aec.fixed_delay);
    UINT16_TO_BSTREAM(nlp_enable_str, aec.nlp_enable);
    UINT16_TO_BSTREAM(nlp_level, aec.nlp_level);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy aec data to aecMsg
    let aecMsg = new Uint8Array(aec_size);
    setMsg(aecMsg, aec);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(aecMsg, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Transfer NS parameter via serial port
 * @param port The port of serial
 * @param ns_level The NS level.
 */
function setNs(port, ns_level_str)
{
    if (!port)
    {
        log("Please check WebUSB connection.");
        return;
    }

    console.log("set NS Level Length: [" + ns_level_str + "]\n");

    // Coverts the string to a decimal int
    let ns_level = parseInt(ns_level_str, 10);

    let frameTypeSize  = 2;
    let numOfSubblocks = 1;
    let frameType      = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block AGC attack time
    let ns = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        level : new Uint8Array(2),     /**< NS level */
    };

    // Count ns size
    let ns_size = 0;
    for (let prop in ns)
    {
        let array = ns[prop];
        ns_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + ns_size - PHONET_LEN_OFFSET;

    // Set the type of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = OBJ.ACORE_DSP_NS;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of agc_attack_time
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_NS_LEVEL, ns.block_id);
    UINT16_TO_BSTREAM(ns_size, ns.block_len);
    UINT16_TO_BSTREAM(ns_level, ns.level);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy ns data to nsMsg
    let nsMsg = new Uint8Array(ns_size);
    setMsg(nsMsg, ns);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(nsMsg, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Transfer Gain parameter via serial port
 * @param string The Gain parameter.
 * @param port The port of serial
 */
function setGain(string, port)
{
    if ((string.length === 0) || (!port))
    {
        log("Please check Gain parameter or WebUSB connection.");
        return;
    }

    console.log("set gain: [" + string + "]\n");

    // Coverts the string to a decimal int
    let temp           = parseInt(string, 10);
    let temp1          = Math.pow(10, temp * 0.05) * (1 << 7) + 0.5;
    let gain           = Math.floor(temp1);
    let frameTypeSize  = 2;
    let numOfSubblocks = 1;

    let frameType = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block primary speaker settings
    let prim_spk_settings = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        ep_mode : new Uint8Array(1),   /**< Endpoint mode */
        ep_id : new Uint8Array(1),     /**< Endpoint id */
        logic_vol : new Uint8Array(2), /**< Logic volume, range 0 to 9 */
        ctl_obj : new Uint8Array(2),   /**< Controlled object */
        gain_left :
            new Uint8Array(2), /**< Left channel gain, Q14.1 value in dB */
        gain_right :
            new Uint8Array(2), /**< Right channel gain, Q14.1 value in dB */
        filter1 : new Uint8Array(2),
        sidetone : new Uint8Array(2), /**< Linear factor, 0~2.0, Q1.14 */
        filter2 : new Uint8Array(2),
    };

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // count prim_spk_settings size
    let prim_spk_settings_size = 0;
    for (let prop in prim_spk_settings)
    {
        let array = prim_spk_settings[prop];
        prim_spk_settings_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + prim_spk_settings_size - PHONET_LEN_OFFSET;
    // The size of frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = OBJ.ACORE_DSP_GAIN;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of prim_spk_settings
    UINT16_TO_BSTREAM(HAL_Audio_SB_Primary_Spkr_Settings,
                      prim_spk_settings.block_id);
    UINT16_TO_BSTREAM(prim_spk_settings_size, prim_spk_settings.block_len);
    UINT16_TO_BSTREAM(gain, prim_spk_settings.gain_left);
    UINT16_TO_BSTREAM(gain, prim_spk_settings.gain_right);

    // copy acore_msg parameters to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    let offset   = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acoreMsg.set(array, offset);
        offset += array.BYTES_PER_ELEMENT * array.length;
    }

    // copy prim_spk_settings parameters to primSpkSettingsMsg
    let primSpkSettingsMsg = new Uint8Array(prim_spk_settings_size);
    offset                 = 0;
    for (let prop in prim_spk_settings)
    {
        let array = prim_spk_settings[prop];
        primSpkSettingsMsg.set(array, offset);
        offset += array.BYTES_PER_ELEMENT * array.length;
    }

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(primSpkSettingsMsg, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
};

/**
 * @brief Transfer DRC parameters via serial port
 * @param dir The direction of audio stream.
 * @param attack_time_str The attack time parameter.
 * @param decay_time_str The decay time parameter.
 * @param knee_threshold_str The knee threshold parameter.
 * @param noise_gate_str The noise gate parameter.
 * @param slope_str The slope parameter.
 * @param port The port of serial
 */
function setDrc(port, dir, attack_time_str, decay_time_str, knee_threshold_str,
                noise_gate_str, slope_str)
{
    if ((!port) || (dir.length === 0) || (attack_time_str.length === 0) ||
        (decay_time_str.length === 0) || (knee_threshold_str.length === 0) ||
        (noise_gate_str.length === 0) || (slope_str.length === 0))
    {
        log("Please check DRC parameters or WebUSB connection.");
        return;
    }

    console.log("set Drc Attack Time: [" + attack_time_str + "]\n");
    console.log("set Drc Decay Time: [" + decay_time_str + "]\n");
    console.log("set Drc Knee Threshold: [" + knee_threshold_str + "]\n");
    console.log("set Drc Noise Gate: [" + noise_gate_str + "]\n");
    console.log("set Drc Slope: [" + slope_str + "]\n");

    // Coverts the string to a decimal int
    let attack_time    = parseInt(attack_time_str, 10);
    let decay_time     = parseInt(decay_time_str, 10);
    let knee_threshold = parseInt(knee_threshold_str, 10);
    let noise_gate     = parseInt(noise_gate_str, 10);

    // Coverts the string to float
    let slope_temp = parseFloat(slope_str);
    slope_temp     = slope_temp * (1 << 10);
    let slope      = Math.floor(slope_temp);

    let frameTypeSize  = 2;
    let numOfSubblocks = 5;
    let frameType      = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block DRC attack time
    let drc_attack_time = {
        attack_time_block_id : new Uint8Array(2),  /**< Block id */
        attack_time_block_len : new Uint8Array(2), /**< Block length */
        attack_time : new Int8Array(2), /**< Attack time in millisecond */
    };

    // Audio sub block DRC decay time
    let drc_decay_time = {
        decay_time_block_id : new Uint8Array(2),  /**< Block id */
        decay_time_block_len : new Uint8Array(2), /**< Block length */
        decay_time : new Int8Array(2), /**< Decay time in millisecond */
    };

    // Audio sub block DRC knee threshold
    let drc_knee_threshold = {
        knee_threshold_block_id : new Uint8Array(2),  /**< Block id */
        knee_threshold_block_len : new Uint8Array(2), /**< Block length */
        knee_threshold : new Int8Array(2),            /**< Knee threshold */
    };

    // Audio sub block DRC noise gate
    let drc_noise_gate = {
        noise_gate_block_id : new Uint8Array(2),  /**< Block id */
        noise_gate_block_len : new Uint8Array(2), /**< Block length */
        noise_gate : new Int8Array(2),            /**< Noise gate */
    };

    // Audio sub block DRC noise gate
    let drc_slope = {
        slope_block_id : new Uint8Array(2),  /**< Block id */
        slope_block_len : new Uint8Array(2), /**< Block length */
        slope : new Int8Array(2),            /**< Noise gate */
    };

    // count drc_attack_time size
    let drc_attack_time_size = 0;
    for (let prop in drc_attack_time)
    {
        let array = drc_attack_time[prop];
        drc_attack_time_size += array.BYTES_PER_ELEMENT * array.length;
    }
    let drc_decay_time_size     = drc_attack_time_size;
    let drc_knee_threshold_size = drc_attack_time_size;
    let drc_noise_gate_size     = drc_attack_time_size;
    let drc_slope_size          = drc_attack_time_size;

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + drc_attack_time_size + drc_decay_time_size +
                   drc_knee_threshold_size + drc_noise_gate_size +
                   drc_slope_size - PHONET_LEN_OFFSET;

    // The size of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);

    if (dir === "uplink")
    {
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_DRC_UL;
    }
    else if (dir === "downlink")
    {
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_DRC_DL;
    }

    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of drc_attack_time
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_DRC_Attack_Time_ms,
                      drc_attack_time.attack_time_block_id);
    UINT16_TO_BSTREAM(drc_attack_time_size,
                      drc_attack_time.attack_time_block_len);
    UINT16_TO_BSTREAM(attack_time, drc_attack_time.attack_time);

    // Set the parameters of drc_decay_time
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_DRC_Decay_Time_ms,
                      drc_decay_time.decay_time_block_id);
    UINT16_TO_BSTREAM(drc_decay_time_size, drc_decay_time.decay_time_block_len);
    UINT16_TO_BSTREAM(decay_time, drc_decay_time.decay_time);

    // Set the parameters of drc_knee_threshold
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_DRC_Knee_Threshold,
                      drc_knee_threshold.knee_threshold_block_id);
    UINT16_TO_BSTREAM(drc_knee_threshold_size,
                      drc_knee_threshold.knee_threshold_block_len);
    UINT16_TO_BSTREAM(knee_threshold, drc_knee_threshold.knee_threshold);

    // Set the parameters of drc_noise_gate
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_DRC_Noise_Gate,
                      drc_noise_gate.noise_gate_block_id);
    UINT16_TO_BSTREAM(drc_noise_gate_size, drc_noise_gate.noise_gate_block_len);
    UINT16_TO_BSTREAM(noise_gate, drc_noise_gate.noise_gate);

    // Set the parameters of drc_slope
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_DRC_Slope, drc_slope.slope_block_id);
    UINT16_TO_BSTREAM(drc_slope_size, drc_slope.slope_block_len);
    UINT16_TO_BSTREAM(slope, drc_slope.slope);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy drc_attack_time data to drcAttackTimeMsg
    let drcAttackTimeMsg = new Uint8Array(drc_attack_time_size);
    setMsg(drcAttackTimeMsg, drc_attack_time);

    // copy drc_decay_time data to drcDecayTimeMsg
    let drcDecayTimeMsg = new Uint8Array(drc_decay_time_size);
    setMsg(drcDecayTimeMsg, drc_decay_time);

    // copy drc_knee_threshold data to drcKneeThresholdMsg
    let drcKneeThresholdMsg = new Uint8Array(drc_knee_threshold_size);
    setMsg(drcKneeThresholdMsg, drc_knee_threshold);

    // copy drc_noise_gate data to drcNoiseGateMsg
    let drcNoiseGateMsg = new Uint8Array(drc_noise_gate_size);
    setMsg(drcNoiseGateMsg, drc_noise_gate);

    // copy drc_slope data to drcSlopeMsg
    let drcSlopeMsg = new Uint8Array(drc_slope_size);
    setMsg(drcSlopeMsg, drc_slope);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(drcAttackTimeMsg, frameType.length + acoreMsg.length);
    frame.set(drcDecayTimeMsg,
              frameType.length + acoreMsg.length + drcAttackTimeMsg.length);
    frame.set(drcKneeThresholdMsg, frameType.length + acoreMsg.length +
                                       drcAttackTimeMsg.length +
                                       drcDecayTimeMsg.length);
    frame.set(drcNoiseGateMsg,
              frameType.length + acoreMsg.length + drcAttackTimeMsg.length +
                  drcDecayTimeMsg.length + drcKneeThresholdMsg.length);
    frame.set(drcSlopeMsg,
              frameType.length + acoreMsg.length + drcAttackTimeMsg.length +
                  drcDecayTimeMsg.length + drcKneeThresholdMsg.length +
                  drcNoiseGateMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Transfer AGC parameters via serial port
 * @param attack_time_str The attack time parameter.
 * @param decay_time_str The decay time parameter.
 * @param target_str The target parameter.
 */
function setAgc(port, attack_time_str, decay_time_str, target_str)
{
    if ((!port) || (attack_time_str.length === 0) ||
        (decay_time_str.length === 0) || (target_str.length === 0))
    {
        log("Please check DRC parameters or WebUSB connection.");
        return;
    }

    console.log("set Agc Attack Time: [" + attack_time_str + "]\n");
    console.log("set Agc Decay Time: [" + decay_time_str + "]\n");
    console.log("set Agc Target: [" + target_str + "]\n");

    // Coverts the string to a decimal int
    let attack_time = parseInt(attack_time_str, 10);
    let decay_time  = parseInt(decay_time_str, 10);
    let target      = parseInt(target_str, 10);

    let frameTypeSize  = 2;
    let numOfSubblocks = 3;
    let frameType      = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block AGC attack time
    let agc_attack_time = {
        block_id : new Uint8Array(2),    /**< Block id */
        block_len : new Uint8Array(2),   /**< Block length */
        attack_time : new Uint8Array(2), /**< Attack time in millisecond */
    };

    // Audio sub block AGC decay time
    let agc_decay_time = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        decay_time : new Int8Array(2), /**< Decay time in millisecond */
    };

    // Audio sub block AGC target
    let agc_target = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        target : new Int8Array(2),     /**< Target level */
    };

    // Count agc_attack_time size
    let agc_attack_time_size = 0;
    for (let prop in agc_attack_time)
    {
        let array = agc_attack_time[prop];
        agc_attack_time_size += array.BYTES_PER_ELEMENT * array.length;
    }
    let agc_decay_time_size = agc_attack_time_size;
    let agc_target_size     = agc_attack_time_size;

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + agc_attack_time_size + agc_decay_time_size +
                   agc_target_size - PHONET_LEN_OFFSET;

    // Set the type of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = OBJ.ACORE_DSP_AGC;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of agc_attack_time
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_AGC_Attack_Time_ms,
                      agc_attack_time.block_id);
    UINT16_TO_BSTREAM(agc_attack_time_size, agc_attack_time.block_len);
    UINT16_TO_BSTREAM(attack_time, agc_attack_time.attack_time);

    // Set the parameters of agc_decay_time
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_AGC_Decay_Time_ms,
                      agc_decay_time.block_id);
    UINT16_TO_BSTREAM(agc_decay_time_size, agc_decay_time.block_len);
    UINT16_TO_BSTREAM(decay_time, agc_decay_time.decay_time);

    // Set the parameters of agc_target
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_AGC_Target, agc_target.block_id);
    UINT16_TO_BSTREAM(agc_target_size, agc_target.block_len);
    UINT16_TO_BSTREAM(target, agc_target.target);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy agc_attack_time data to agcAttackTimeMsg
    let agcAttackTimeMsg = new Uint8Array(agc_attack_time_size);
    setMsg(agcAttackTimeMsg, agc_attack_time);

    // copy agc_decay_time data to agcDecayTimeMsg
    let agcDecayTimeMsg = new Uint8Array(agc_decay_time_size);
    setMsg(agcDecayTimeMsg, agc_decay_time);

    // copy agc_decay_time data to agcDecayTimeMsg
    let agcTargetMsg = new Uint8Array(agc_target_size);
    setMsg(agcTargetMsg, agc_target);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(agcAttackTimeMsg, frameType.length + acoreMsg.length);
    frame.set(agcDecayTimeMsg,
              frameType.length + acoreMsg.length + agcAttackTimeMsg.length);
    frame.set(agcTargetMsg, frameType.length + acoreMsg.length +
                                agcAttackTimeMsg.length +
                                agcDecayTimeMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Transfer MBDRC parameters via serial port.
 * @param port The port of serial.
 * @param band_num_str The band number parameter.
 * @param high_bound_str The frequency high bound parameter.
 * @param compress_threshold_str The compress threshold parameter.
 * @param compress_slope_str The compress slope parameter.
 */
function setMbdrc(port, band_num_str, high_bound_str, compress_threshold_str,
                  compress_slope_str)
{
    if ((!port) || (high_bound_str.length === 0) ||
        (compress_threshold_str.length === 0) ||
        (compress_slope_str.length === 0))
    {
        log("Please check MBDRC parameters or WebUSB connection.");
        return;
    }
    // Coverts the string to a decimal int
    let band_num = parseInt(band_num_str, 10);

    let frameTypeSize  = 2;
    let numOfSubblocks = 3;
    let frameType      = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block frequency high bound settings
    let mbdrc_high_bound = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        number : new Uint8Array(2),    /**< Number of band */
        // 36 = band_num * sizeof(float), band_num = 9
        high_bound : new Int8Array(36), /**< High bound */
    };

    // Audio sub block compress threshold settings
    let mbdrc_compress_threshold = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        number : new Uint8Array(2),    /**< Number of band */
        // 18 = band_num * sizeof(short), band_num = 9
        compress_threshold : new Int8Array(18), /**< Threshold */
    };

    // Audio sub block compress slope settings
    let mbdrc_compress_slope = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        number : new Uint8Array(2),    /**< Number of band */
        // 36 = band_num * sizeof(float), band_num = 9
        compress_slope : new Int8Array(36), /**< Slope */
    };

    // count high_bound size
    let mbdrc_high_bound_size = 0;
    for (let prop in mbdrc_high_bound)
    {
        let array = mbdrc_high_bound[prop];
        mbdrc_high_bound_size += array.BYTES_PER_ELEMENT * array.length;
    }
    let mbdrc_compress_threshold_size = mbdrc_high_bound_size;
    let mbdrc_compress_slope_size     = mbdrc_high_bound_size;

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + mbdrc_high_bound_size +
                   mbdrc_compress_threshold_size + mbdrc_compress_slope_size -
                   PHONET_LEN_OFFSET;

    // The size of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = OBJ.ACORE_DSP_MBDRC;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of mbdrc_high_bound
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_MBDRC_Bound_High,
                      mbdrc_high_bound.block_id);
    UINT16_TO_BSTREAM(mbdrc_high_bound_size, mbdrc_high_bound.block_len);
    UINT16_TO_BSTREAM(band_num, mbdrc_high_bound.number);
    for (let i = 0; i < band_num; i++)
    {
        console.log(high_bound_str[i].value);
        let high_bound = parseInt(high_bound_str[i].value, 10);
        // 4 = sizeof(int)
        let temp_buf = new Int8Array(4);
        UINT32_TO_BSTREAM(high_bound, temp_buf);
        mbdrc_high_bound.high_bound.set(temp_buf, i * temp_buf.length);
    }

    // Set the parameters of mbdrc_compress_threshold
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_MBDRC_Compress_Threshold,
                      mbdrc_compress_threshold.block_id);
    UINT16_TO_BSTREAM(mbdrc_compress_threshold_size,
                      mbdrc_compress_threshold.block_len);
    UINT16_TO_BSTREAM(band_num, mbdrc_compress_threshold.number);
    for (let i = 0; i < band_num; i++)
    {
        console.log(compress_threshold_str[i].value);
        let compress_threshold = parseInt(compress_threshold_str[i].value, 10);
        // 2 = sizeof(short)
        let temp_buf = new Int8Array(2);
        UINT16_TO_BSTREAM(compress_threshold, temp_buf);
        mbdrc_compress_threshold.compress_threshold.set(temp_buf,
                                                        i * temp_buf.length);
    }

    // Set the parameters of mbdrc_compress_slope
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_MBDRC_Compress_Slope,
                      mbdrc_compress_slope.block_id);
    UINT16_TO_BSTREAM(mbdrc_compress_slope_size,
                      mbdrc_compress_slope.block_len);
    UINT16_TO_BSTREAM(band_num, mbdrc_compress_slope.number);
    for (let i = 0; i < band_num; i++)
    {
        console.log(compress_slope_str[i].value);
        let compress_slope     = parseFloat(compress_slope_str[i].value);
        let compress_slope_buf = Float32Array.from([ compress_slope ]).buffer;
        let temp_buf           = new Int8Array(compress_slope_buf);
        mbdrc_compress_slope.compress_slope.set(temp_buf, i * temp_buf.length);
    }

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy mbdrc_high_bound data to mbdrcHighBoundMsg
    let mbdrcHighBoundMsg = new Uint8Array(mbdrc_high_bound_size);
    setMsg(mbdrcHighBoundMsg, mbdrc_high_bound);

    // copy mbdrc_compress_threshold data to mbdrcCompressThresholdMsg
    let mbdrcCompressThresholdMsg =
        new Uint8Array(mbdrc_compress_threshold_size);
    setMsg(mbdrcCompressThresholdMsg, mbdrc_compress_threshold);

    // copy mbdrc_compress_slope data to mbdrcCompressSlopeMsg
    let mbdrcCompressSlopeMsg = new Uint8Array(mbdrc_compress_slope_size);
    setMsg(mbdrcCompressSlopeMsg, mbdrc_compress_slope);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(mbdrcHighBoundMsg, frameType.length + acoreMsg.length);
    frame.set(mbdrcCompressThresholdMsg,
              frameType.length + acoreMsg.length + mbdrcHighBoundMsg.length);
    frame.set(mbdrcCompressSlopeMsg, frameType.length + acoreMsg.length +
                                         mbdrcHighBoundMsg.length +
                                         mbdrcCompressThresholdMsg.length);
    console.log(frame);

    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Transfer PEQ parameters via serial port.
 * @param port The port of serial.
 * @param dir The direction of audio stream.
 * @param band_num_str The band number parameter.
 * @param band_center_freq_str The band center frequency parameter.
 * @param band_qfactor_str The band qfactor parameter.
 * @param band_gain_str The band gain parameter.
 */
function setPeq(port, dir, band_num_str, band_center_freq_str, band_qfactor_str,
                band_gain_str)
{
    if ((!port) || (dir.length === 0) || (band_center_freq_str.length === 0) ||
        (band_qfactor_str.length === 0) || (band_gain_str.length === 0))
    {
        log("Please check DRC parameters or WebUSB connection.");
        return;
    }

    // Coverts the string to a decimal int
    let band_num = parseInt(band_num_str, 10);

    let frameTypeSize  = 2;
    let numOfSubblocks = 3;
    let frameType      = new Uint8Array(frameTypeSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // Audio sub block speaker left EQ center frequency settings
    let peq_band_center_freq = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        number : new Uint8Array(2),    /**< Number of band */
        // 36 = band_num * sizeof(float), band_num = 9
        band_center_freq : new Int8Array(36), /**< Center frequency */
    };

    // Audio sub block speaker left EQ Q factor settings
    let peq_band_qfactor = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        number : new Uint8Array(2),    /**< Number of band */
        // 36 = band_num * sizeof(float), band_num = 9
        band_qfactor : new Int8Array(36), /**< Q factor */
    };

    // Audio sub block speaker left EQ gain settings
    let peq_band_gain = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        number : new Uint8Array(2),    /**< Number of band */
        // 36 = band_num * sizeof(float), band_num = 9
        band_gain : new Int8Array(36), /**< Gain list of every band */
    };

    // count band_center_freq size
    let peq_band_center_freq_size = 0;
    for (let prop in peq_band_center_freq)
    {
        let array = peq_band_center_freq[prop];
        peq_band_center_freq_size += array.BYTES_PER_ELEMENT * array.length;
    }
    let peq_band_qfactor_size = peq_band_center_freq_size;
    let peq_band_gain_size    = peq_band_center_freq_size;

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + peq_band_center_freq_size +
                   peq_band_qfactor_size + peq_band_gain_size -
                   PHONET_LEN_OFFSET;

    // The size of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);

    if (dir === "uplink")
    {
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_PEQ_UL;
    }
    else if (dir === "downlink")
    {
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_PEQ_DL;
    }

    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    // Set the parameters of peq_band_center_freq
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_PEQ_Center_Freq,
                      peq_band_center_freq.block_id);
    UINT16_TO_BSTREAM(peq_band_center_freq_size,
                      peq_band_center_freq.block_len);
    UINT16_TO_BSTREAM(band_num, peq_band_center_freq.number);
    for (let i = 0; i < band_num; i++)
    {
        console.log(band_center_freq_str[i].value);
        let band_center_freq = parseInt(band_center_freq_str[i].value, 10);
        // 4 = sizeof(int)
        let temp_buf = new Int8Array(4);
        UINT32_TO_BSTREAM(band_center_freq, temp_buf);
        peq_band_center_freq.band_center_freq.set(temp_buf,
                                                  i * temp_buf.length);
    }

    // Set the parameters of peq_band_qfactor
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_PEQ_Qfactor, peq_band_qfactor.block_id);
    UINT16_TO_BSTREAM(peq_band_qfactor_size, peq_band_qfactor.block_len);
    UINT16_TO_BSTREAM(band_num, peq_band_qfactor.number);
    for (let i = 0; i < band_num; i++)
    {
        console.log(band_qfactor_str[i].value);
        let band_qfactor     = parseFloat(band_qfactor_str[i].value);
        let band_qfactor_buf = Float32Array.from([ band_qfactor ]).buffer;
        let temp_buf         = new Int8Array(band_qfactor_buf);
        peq_band_qfactor.band_qfactor.set(temp_buf, i * temp_buf.length);
    }

    // Set the parameters of peq_band_gain
    UINT16_TO_BSTREAM(HAL_Audio_SB_UL_PEQ_Gain, peq_band_gain.block_id);
    UINT16_TO_BSTREAM(peq_band_gain_size, peq_band_gain.block_len);
    UINT16_TO_BSTREAM(band_num, peq_band_gain.number);
    for (let i = 0; i < band_num; i++)
    {
        console.log(band_gain_str[i].value);
        let band_gain = parseInt(band_gain_str[i].value, 10);
        // 4 = sizeof(int)
        let temp_buf = new Int8Array(4);
        UINT32_TO_BSTREAM(band_gain, temp_buf);
        peq_band_gain.band_gain.set(temp_buf, i * temp_buf.length);
    }

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy peq_band_center_freq data to peqBandCenterFreqMsg
    let peqBandCenterFreqMsg = new Uint8Array(peq_band_center_freq_size);
    setMsg(peqBandCenterFreqMsg, peq_band_center_freq);

    // copy peq_band_qfactor data to peqBandQfactorMsg
    let peqBandQfactorMsg = new Uint8Array(peq_band_qfactor_size);
    setMsg(peqBandQfactorMsg, peq_band_qfactor);

    // copy peq_band_gain data to peqBandGainMsg
    let peqBandGainMsg = new Uint8Array(peq_band_gain_size);
    setMsg(peqBandGainMsg, peq_band_gain);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(peqBandCenterFreqMsg, frameType.length + acoreMsg.length);
    frame.set(peqBandQfactorMsg,
              frameType.length + acoreMsg.length + peqBandCenterFreqMsg.length);
    frame.set(peqBandGainMsg, frameType.length + acoreMsg.length +
                                  peqBandCenterFreqMsg.length +
                                  peqBandQfactorMsg.length);
    console.log(frame);

    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Enable the corresponding audio pipe port on the MCU.
 * @param port The port of serial.
 * @param obj The audio pipe port id.
 * @param enable The audio pipe port status.
 * @param dir THe direction of audio pipe port.
 */
function snifferEnable(port, obj, enable, dir)
{
    let numOfSub      = 1;
    let frameTypeSize = 2;
    let frameType     = new Uint8Array(frameTypeSize);
    if (obj.length === 0)
    {
        return;
    }

    let acore_msg = {
        pn_media : new Uint8Array(1),
        pn_rdev : new Uint8Array(1),
        pn_sdev : new Uint8Array(1),
        pn_res : new Uint8Array(1),
        pn_length : new Uint8Array(2),
        pn_robj : new Uint8Array(1),
        pn_sobj : new Uint8Array(1),
        trans_id : new Uint8Array(1),
        msg_id : new Uint8Array(1),
        num_of_subblocks : new Uint8Array(2),
    };

    let sniffer_enable = {
        block_id : new Uint8Array(2),
        block_len : new Uint8Array(2),
        state : new Uint8Array(1),
        reserved : new Uint8Array(1), // TODO: ASW-131
    };

    // count sniffer_enable size
    let sniffer_enable_size = 0;
    for (let prop in sniffer_enable)
    {
        let array = sniffer_enable[prop];
        sniffer_enable_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    switch (obj)
    {
    case "ACORE_DSP_GAIN_IN":
    case "ACORE_DSP_GAIN_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_GAIN;
        break;

    case "ACORE_DSP_AGC_IN":
    case "ACORE_DSP_AGC_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_AGC;
        break;

    case "ACORE_DSP_DRC_UL_IN":
    case "ACORE_DSP_DRC_UL_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_DRC_UL;
        break;

    case "ACORE_DSP_DRC_DL_IN":
    case "ACORE_DSP_DRC_DL_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_DRC_DL;
        break;

    case "ACORE_DSP_MBDRC_IN":
    case "ACORE_DSP_MBDRC_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_MBDRC;
        break;

    case "ACORE_DSP_PEQ_UL_IN":
    case "ACORE_DSP_PEQ_UL_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_PEQ_UL;
        break;

    case "ACORE_DSP_PEQ_DL_IN":
    case "ACORE_DSP_PEQ_DL_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_PEQ_DL;
        break;

    case "ACORE_DSP_AEC_MIC_IN":
    case "ACORE_DSP_AEC_MIC_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_AEC;
        break;

    case "ACORE_DSP_AEC_REF_IN":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_AEC;
        sniffer_enable.state[0] =
            (sniffer_enable.state[0] & SNIFFER_INDEX_MASK) |
            (SNIFFER_INDEX.PAD_1 << 2);
        break;

    case "ACORE_DSP_NS_IN":
    case "ACORE_DSP_NS_OUT":
        acore_msg.pn_robj[0] = OBJ.ACORE_DSP_NS;
        break;

    default:
        console.log("The wrong object.");
        return;
    }

    // acore_msg.state[0] bit definition
    // {
    //     uint8_t enable    : 1; /**< Sniffer enable flag */
    //     uint8_t direction : 1; /**< Sniffer input/output flag */
    //     uint8_t index     : 4; /**< Sniffer node index */
    //     uint8_t reserved  : 2; /**< Reserved */
    // }
    if (enable === true)
    {
        sniffer_enable.state[0] =
            (sniffer_enable.state[0] & SNIFFER_ENABLE_MASK) | true;
    }
    else if (enable === false)
    {
        sniffer_enable.state[0] =
            (sniffer_enable.state[0] & SNIFFER_ENABLE_MASK) | false;
    }

    if (dir === "input")
    {
        sniffer_enable.state[0] =
            (sniffer_enable.state[0] & SNIFFER_DIRECTION_MASK) |
            (DIRECTION.IN << 1);
    }
    else if (dir === "output")
    {
        sniffer_enable.state[0] =
            (sniffer_enable.state[0] & SNIFFER_DIRECTION_MASK) |
            (DIRECTION.OUT << 1);
    }

    let pnLength   = acore_msg_size + sniffer_enable_size - PHONET_LEN_OFFSET;
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSub, acore_msg.num_of_subblocks);

    UINT16_TO_BSTREAM(HAL_Audio_SB_Sniffer_Enable, sniffer_enable.block_id);
    UINT16_TO_BSTREAM(sniffer_enable_size, sniffer_enable.block_len);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy sniffer_enable data to snifferEnableMsg
    let snifferEnableMsg = new Uint8Array(sniffer_enable_size);
    setMsg(snifferEnableMsg, sniffer_enable);

    // Combine several message into one message
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(snifferEnableMsg, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
};

/**
 * @brief Sniffer start capturing or not.
 * @param port The port of serial
 * @param active Sniffer status.
 */
function snifferActive(port, active)
{
    let numOfSub      = 1;
    let pointState    = 0;
    let frameTypeSize = 2;
    let frameType     = new Uint8Array(frameTypeSize);

    if (active.length === 0)
    {
        return;
    }

    if (active === true)
    {
        pointState       = 1;
        function_modules = AUDIO_TOOL.FILE;
    }
    else if (active === false)
    {
        pointState       = 0;
        function_modules = AUDIO_TOOL.NULL;
    }

    let acore_msg = {
        pn_media : new Uint8Array(1),
        pn_rdev : new Uint8Array(1),
        pn_sdev : new Uint8Array(1),
        pn_res : new Uint8Array(1),
        pn_length : new Uint8Array(2),
        pn_robj : new Uint8Array(1),
        pn_sobj : new Uint8Array(1),
        trans_id : new Uint8Array(1),
        msg_id : new Uint8Array(1),
        num_of_subblocks : new Uint8Array(2),
    };

    let sniffer_active = {
        block_id : new Uint8Array(2),
        block_len : new Uint8Array(2),
        active : new Uint8Array(2),
    };

    // count sniffer_active size
    let sniffer_active_size = 0;
    for (let prop in sniffer_active)
    {
        let array = sniffer_active[prop];
        sniffer_active_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    let pnLength   = acore_msg_size + sniffer_active_size - PHONET_LEN_OFFSET;
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = OBJ.ACORE_DSP;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSub, acore_msg.num_of_subblocks);

    UINT16_TO_BSTREAM(HAL_Audio_SB_Sniffer_Activate, sniffer_active.block_id);
    UINT16_TO_BSTREAM(sniffer_active_size, sniffer_active.block_len);
    UINT16_TO_BSTREAM(pointState, sniffer_active.active);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy sniffer_active data to snifferEnableMsg
    let snifferActiveMsg = new Uint8Array(sniffer_active_size);
    setMsg(snifferActiveMsg, sniffer_active);

    // Combine several message into one message
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(snifferActiveMsg, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
};

/**
 * @brief Algorithms set bypass states.
 * @param port The port of serial
 * @param state Bypass state. "true" enables bypass.
 * "false" disables bypass.
 */
function setBypass(port, objectId, state)
{
    let numOfSub      = 1;
    let frameTypeSize = 2;
    let frameType     = new Uint8Array(frameTypeSize);

    if (!port)
    {
        log("Please check WebUSB connection.");
        return;
    }

    let acore_msg = {
        pn_media : new Uint8Array(1),
        pn_rdev : new Uint8Array(1),
        pn_sdev : new Uint8Array(1),
        pn_res : new Uint8Array(1),
        pn_length : new Uint8Array(2),
        pn_robj : new Uint8Array(1),
        pn_sobj : new Uint8Array(1),
        trans_id : new Uint8Array(1),
        msg_id : new Uint8Array(1),
        num_of_subblocks : new Uint8Array(2),
    };

    let bypass = {
        block_id : new Uint8Array(2),  /**< Block id */
        block_len : new Uint8Array(2), /**< Block length */
        state : new Uint8Array(1), /**< true bypass, false algorithm process */
        reserved : new Uint8Array(1), /**< Reserved for alignment */
    };

    // count bypass_size size
    let bypass_size = 0;
    for (let prop in bypass)
    {
        let array = bypass[prop];
        bypass_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    let pnLength   = acore_msg_size + bypass_size - PHONET_LEN_OFFSET;
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = objectId;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Control_Request;
    UINT16_TO_BSTREAM(numOfSub, acore_msg.num_of_subblocks);

    UINT16_TO_BSTREAM(HAL_Audio_SB_Bypass, bypass.block_id);
    UINT16_TO_BSTREAM(bypass_size, bypass.block_len);

    bypass.state[0] = state;

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // copy bypass data to snifferEnableMsg
    let bypassMsg = new Uint8Array(bypass_size);
    setMsg(bypassMsg, bypass);

    // Combine several message into one message
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(bypassMsg, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
};

function setSniffer(port, obj_str)
{
    for (let i = 0; i < obj_str.length; i++)
    {
        snifferEnable(port, obj_str[i].id, obj_str[i].checked, obj_str[i].value)
    }
}

/**
 * @brief Read the MCPS of the algorithm from AP5.
 */
function readMcps(port, object)
{
    if (!port)
    {
        log("Please check WebUSB connection.");
        return;
    }

    let frameTypeSize  = 2;
    let numOfSubblocks = 1;
    let subblocksSize  = 2;
    let frameType      = new Uint8Array(frameTypeSize);
    let subblockId     = new Uint8Array(subblocksSize);

    // Audio core message format
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1),  /**< Receiver object ID */
        pn_sobj : new Uint8Array(1),  /**< Sender object ID */
        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
    };

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    // The length of audio core message
    let pnLength = acore_msg_size + subblocksSize - PHONET_LEN_OFFSET;

    // Set the type of Frame
    let totalBytes = pnLength + frameTypeSize + PHONET_LEN_OFFSET;

    // Set the type of Frame
    UINT16_TO_BSTREAM(FRAME_TYPE.ACORE_MESSAGE, frameType);

    // Set the parameters of acore_msg
    acore_msg.pn_rdev[0] = MSG_EP_AGENT.DSP;
    acore_msg.pn_sdev[0] = MSG_EP_AGENT.DSP;
    UINT16_TO_BSTREAM(pnLength, acore_msg.pn_length);
    acore_msg.pn_robj[0] = object;
    acore_msg.pn_sobj[0] = OBJ.ACORE_TOOL;
    acore_msg.msg_id[0]  = HAL_Audio_HW_Read_Request;
    UINT16_TO_BSTREAM(numOfSubblocks, acore_msg.num_of_subblocks);

    UINT16_TO_BSTREAM(HAL_Audio_SB_MCPS, subblockId);

    // copy acore_msg data to acoreMsg
    let acoreMsg = new Uint8Array(acore_msg_size);
    setMsg(acoreMsg, acore_msg);

    // Combine messages to one frame
    let frame = new Uint8Array(totalBytes);
    frame.set(frameType, 0);
    frame.set(acoreMsg, frameType.length);
    frame.set(subblockId, frameType.length + acoreMsg.length);

    console.log(frame);
    if (port)
    {
        port.send(frame);
    }
}

/**
 * @brief Update the MCPS of algorithms from AP5.
 */
function updateMcps(port)
{
    readMcps(port, OBJ.ACORE_DSP_AEC);
    readMcps(port, OBJ.ACORE_DSP_NS);
    readMcps(port, OBJ.ACORE_DSP_PEQ_UL);
    readMcps(port, OBJ.ACORE_DSP_PEQ_DL);
    readMcps(port, OBJ.ACORE_DSP_MBDRC);
}

function parseMsg(buf)
{
    let acore_msg = {
        pn_media : new Uint8Array(1), /**< Media type (link-layer identifier) */
        pn_rdev : new Uint8Array(1),  /**< Receiver device ID */
        pn_sdev : new Uint8Array(1),  /**< Sender device ID */
        pn_res : new Uint8Array(1),   /**< Resource ID or function */
        pn_length :
            new Uint8Array(2), /**< Big-endian message byte length (minus 6) */
        pn_robj : new Uint8Array(1), /**< Receiver object ID */
        pn_sobj : new Uint8Array(1), /**< Sender object ID */

        trans_id : new Uint8Array(1), /**< Transaction id */
        msg_id : new Uint8Array(1),   /**< Message id */
        num_of_subblocks :
            new Uint8Array(2), /**< Number of sub blocks to be request */
        subblocks_id : new Uint8Array(2),  /**< Sub Block id */
        subblocks_len : new Uint8Array(2), /**< Sub Block length */
        mcps : new Int8Array(4),           /**< The mcps of algorithm */
    };

    // count acore_msg size
    let acore_msg_size = 0;
    for (let prop in acore_msg)
    {
        let array = acore_msg[prop];
        acore_msg_size += array.BYTES_PER_ELEMENT * array.length;
    }

    BSTREAM_TO_OBJECT(buf, acore_msg);
    if ((acore_msg.pn_rdev[0] == MSG_EP_AGENT.DSP) &&
        (acore_msg.pn_sdev[0] == MSG_EP_AGENT.DSP))
    {
        // Determine whether it is Audio Hardware Read Response
        if (acore_msg.msg_id[0] == HAL_Audio_HW_Read_Response)
        {
            switch (acore_msg.pn_sobj[0])
            {
            case OBJ.ACORE_DSP_AEC:
                mcps.aec = BSTREAM_TO_UINT32(acore_msg.mcps);
                mcps.number++;
                break;

            case OBJ.ACORE_DSP_NS:
                mcps.ns = BSTREAM_TO_UINT32(acore_msg.mcps);
                mcps.number++;
                break;

            case OBJ.ACORE_DSP_PEQ_UL:
                mcps.peqUl = BSTREAM_TO_UINT32(acore_msg.mcps);
                mcps.number++;
                break;

            case OBJ.ACORE_DSP_PEQ_DL:
                mcps.peqDl = BSTREAM_TO_UINT32(acore_msg.mcps);
                mcps.number++;
                break;

            case OBJ.ACORE_DSP_MBDRC:
                mcps.mbdrc = BSTREAM_TO_UINT32(acore_msg.mcps);
                mcps.number++;
                break;

            default:
                break;
            }

            if (mcps.number === 5)
            {
                mcps.number = 0;
                updateMcpsChart();
            }
        }
    }
}
/**
 * @brief Receive acore message from AP5 through webUSB.
 */
function receiveMsg(buf)
{
    if (function_modules === AUDIO_TOOL.FILE)
    {
        if (snifferState === SNIFFER.ENABLE)
        {
            console.log("buf.byteLength " + buf.byteLength);
            snifferFile.write(buf);
        }
    }
    else
    {
        let uint8Buf = new Uint8Array(buf.byteLength);
        for (let i = 0; i < buf.byteLength; i++)
        {
            uint8Buf[i] = buf.getUint8(i);
        }
        parseMsg(uint8Buf);
    }
};
