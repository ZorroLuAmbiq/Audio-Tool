/****************************************************************************************
 *
 * @file logs.js
 *
 * @brief Useful functions for debugging.
 *
 * Copyright (C) Ambiq Micro
 *
 *
 ****************************************************************************************
 */

//  Sniffer state
//  Only in the enable state can a file be written to.
let SNIFFER = {
    DISABLE : 0,
    ENABLE : 1,
};

/*global variables */
let handleMcpsChart;
let snifferFile;
let snifferState = SNIFFER.DISABLE;
let snifferFileHandle;
let snifferDirectoryHandle;
// Player timer.
let playInterval = {id : 0};
// Read MCPS timer.
let mcpsInterval     = {id : 0};
let function_modules = AUDIO_TOOL.NULL;

/**
 * @brief The MCPS of algorithm.
 */
let mcps = {
    number : 0, // The number of MCPS that have been read.
    aec : 0,    // The MCPS of AEC.
    ns : 0,     // The MCPS of NS.
    peqUl : 0,  // The MCPS of PEQ UL
    peqDl : 0,  // The MCPS of PEQ DL
    mbdrc : 0,  // The MCPS of MBDRC
};

// MCPS Chart Data Tables
let mcpsChartData = {
    timeLables : [
        '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '0s'
    ],                                        // Time labels
    aec : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],   // AEC MCPS table
    ns : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],    // NS MCPS table
    peqUl : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // PEQ_UL MCPS table
    peqDl : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // PEQ_DL MCPS table
    mbdrc : [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], // MBDRC MCPS table
}

// MCPS chart configuration
let mcpsChartConfig = {
    type : 'line',
    data : {
        labels : mcpsChartData.timeLables,
        datasets : [
            {
                label : 'AEC',
                data : mcpsChartData.aec,
                backgroundColor : 'rgb(255, 99, 132)',
                borderColor : 'rgb(255, 99, 132)',
                fill : false,
            },
            {
                label : 'NS',
                data : mcpsChartData.ns,
                backgroundColor : 'rgb(75, 192, 192)',
                borderColor : 'rgb(75, 192, 192)',
                fill : false,
            },
            {
                label : 'PEQ_UL',
                data : mcpsChartData.peqUl,
                backgroundColor : 'rgb(207, 154, 38)',
                borderColor : 'rgb(207, 154, 38)',
                fill : false,
            },
            {
                label : 'PEQ_DL',
                data : mcpsChartData.peqDl,
                backgroundColor : 'rgb(13, 16, 219)',
                borderColor : 'rgb(13, 16, 219)',
                fill : false,
            },
            {
                label : 'MBDRC',
                data : mcpsChartData.mbdrc,
                backgroundColor : 'rgb(9, 212, 70)',
                borderColor : 'rgb(9, 212, 70)',
                fill : false,
            }
        ]
    },
    options : {
        responsive : true,
        animation : false,
        title : {display : true, text : 'MCPS Real Time Display'},
        scales : {
            y : {
                suggestedMin : 0,
                suggestedMax : 50,
            }
        },
    }
};

const MODULE_ID = {
    MODULE_SCAN : 0x00,
    MODULE_AUDIO_TOOL : 0x01,
    MODULE_BROADCAST : 0x0F,
};

const MSG_TYPE = {
    REQ : 0x00,
    RSP : 0x01,
    NTF : 0x02,
    DLS : 0x03,
    ULS : 0x04,
};

const REQ_SUB_TYPE = {
    REQ_GENERIC : 0,
    REQ_ULS_START : 1,
    REQ_ULS_STOP : 2,
};

const NTF_SUB_TYPE = {
    NTF_GENERIC : 0,   /**< Generic NTF with Message-Specific-Data */
    NTF_BUF_TOTAL : 1, /**< NTF for DLS Total Buffer Size. DLS-Total-Buffer
                          use the Transaction-ID field */
    NTF_BUF_IDLE : 2,  /**< NTF for DLS Idle Buffer Size. DLS-Idle-Buffer use
                          the Transaction-ID field */
    NTF_BUF_CLEAN : 3, /**< NTF for DLS Buffer Clean. DLS-Idle-Buffer use
                          the Transaction-ID field */
};

const DLS_SUB_TYPE = {
    DLS_RESERVED : 0, /**< Reserved */
    DLS_FIRST : 1,    /**< First DLS without Message-Specific-Data.
                      Message-Data-Length should 0. */
    DLS_MIDDLE : 2,   /**< Middle DLS with Message-Specific-Data.*/
    DLS_LAST : 3,     /**< Last DLS with Message-Specific-Data.*/
};

const ULS_SUB_TYPE = {
    ULS_GENERIC : 0, /**< Generic ULS with Message-Specific-Data */
};

const RSP_SUB_TYPE = {
    RSP_SUCCESS : 0,   /**< Generic RSP Success */
    RSP_ULS_START : 1, /**< RSP for REQ_ULS_START. Start ULS */
    RSP_ULS_STOP : 2,  /**< RSP for REQ_ULS_STOP. Stop ULS */
    RSP_ERR_PB : 3,    /**< PB-Flag Incorrect */
    RSP_ERR_TRID : 4,  /**< Transaction-ID Incorrect */
    RSP_ERR_LEN : 5,   /**< Message-Data-Length Incorrect */
    RSP_ERR_CRC : 6,   /**< CRC Incorrect */
};

const PB_FLAG = {
    PB_CPL : 0x00,
    PB_FRAG_HEADER : 0x01,
    PB_FRAG : 0x02,
    PB_FRAG_LAST : 0x03,
};

const FLUSH_FLAG = {
    FLUSH_AUTO : 0x00,
    FLUSH_IMT : 0x01,
};

const CRC_FLAG = {
    CRC_OFF : 0x00,
    CRC_ON : 0x01,
};

const CRC_SIZE           = 4;
const TRANS_MSG_HDR_SIZE = 6;

// Message Link Layer MTU(Maximum Transmission Unit)
const LL_MTU_REQ = 64;
const LL_MTU_DLS = 512;

const MESSAGE_ID_MASK       = 0x0F;
const MESSAGE_TYPE_MASK     = 0xF0;
const MESSAGE_SUB_TYPE_MASK = 0x0F;
const PB_FLAG_MASK          = 0x30;
const FLUSH_FLAG_MASK       = 0x40;
const CRC_FLAG_MASK         = 0x80;
// 6 bytes header in every Transport Message
class transMsgHdr
{
    constructor()
    {
        this.IdType      = new Uint8Array(1);
        this.subTypeFlag = new Uint8Array(1);
        this.trid        = new Uint8Array(2);
        this.length      = new Uint8Array(2);
    }
}

let reqTrid = 0;
let ntfTrid = 0;
let ulsTrid = 0;
let dlsTrid = 0;
let msgSpecData;
let msgSpecDataOffset = 0;
let msgSubType        = 0;
let msgCrcFlag        = CRC_FLAG.CRC_OFF;

// Clean all status
function cleanStatus()
{
    // Stop all timing operations
    clearInterval(playInterval.id);
    clearInterval(mcpsInterval.id);
    playInterval.id = 0;
    mcpsInterval.id = 0;

    function_modules = AUDIO_TOOL.NULL;
}

/**
 * @brief Convert integers to a little endian byte stream, with
 * increment.
 * @param n The integers.
 * @param p The little endian byte stream.
 */
function UINT32_TO_BSTREAM_LSB(n, p)
{
    p[0] = n & 0xFF;
    p[1] = (n >> 8) & 0xFF;
    p[2] = (n >> 16) & 0xFF;
    p[3] = (n >> 24) & 0xFF;
}

/**
 * @brief Convert a little endian byte stream to integers, with
 * increment.
 * @param p The little endian byte stream.
 */
function BSTREAM_TO_UINT16_LSB(p)
{
    return (p[1] << 8) | p[0];
}

/**
 * @brief Convert a little endian byte stream to integers, with
 * increment.
 * @param p The little endian byte stream.
 */
function BSTREAM_TO_UINT32_LSB(p)
{
    return (p[1] << 24) | (p[1] << 16) | (p[1] << 8) | p[0];
}
