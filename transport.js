/****************************************************************************************
 *
 * @file transport.js
 *
 * @brief
 *
 * Copyright (C) Ambiq Micro
 *
 *
 ****************************************************************************************
 */

/**
 * @brief
 */
function transport_send(port, type, subType, buf)
{
    let remain    = 0;
    let mtu       = 0;
    let transport = null;
    let crcSize   = 0;
    let header    = new transMsgHdr();
    let headerMsg = new Uint8Array(TRANS_MSG_HDR_SIZE);

    if (msgCrcFlag === CRC_FLAG.CRC_ON)
    {
        let crcMsg = new Uint8Array(CRC_SIZE);
        crcSize    = CRC_SIZE;
    }

    if (buf)
    {
        remain = buf.byteLength;
    }

    header.IdType = (type << 4) | MODULE_ID.MODULE_AUDIO_TOOL;
    switch (type)
    {
    case MSG_TYPE.REQ:
        // Choose control port.
        transport   = port.req;
        mtu         = LL_MTU_REQ;
        header.trid = reqTrid++;
        if (reqTrid > 0xFFFF)
        {
            reqTrid = 0;
        }
        break;

    case MSG_TYPE.DLS:
        // Choose bulk port.
        transport   = port.dls;
        mtu         = LL_MTU_DLS;
        header.trid = dlsTrid++;
        if (dlsTrid > 0xFFFF)
        {
            dlsTrid = 0;
        }
        break;

    default:
        break;
    }

    header.subTypeFlag = header.subTypeFlag | (FLUSH_FLAG.FLUSH_AUTO << 6) |
                         (msgCrcFlag << 7) | subType;
    let frameLen = TRANS_MSG_HDR_SIZE + remain + crcSize;
    if (frameLen <= mtu)
    {
        header.subTypeFlag = header.subTypeFlag | (PB_FLAG.PB_CPL << 4);
        header.length      = remain;
        setMsg(headerMsg, header);

        let frame = new Uint8Array(frameLen);
        frame.set(headerMsg, 0);
        if (buf)
        {
            frame.set(buf, headerMsg.length);
        }

        if (msgCrcFlag === CRC_FLAG.CRC_ON)
        {
            let tempMsg = frame.slice(-crcSize);
            let crc32   = CRC32.buf(tempMsg);
            UINT32_TO_BSTREAM_LSB(crc32, crcMsg);
            frame.set(crcMsg, headerMsg.length + buf.length);
        }

        transport.send(frame);
    }
    else
    {
        let offset = 0;

        header.subTypeFlag = header.subTypeFlag | (PB_FLAG.PB_FRAG_HEAD << 4);
        header.length      = buf.length;
        setMsg(headerMsg, header);

        let frame  = new Uint8Array(mtu);
        let bufLen = mtu - TRANS_MSG_HDR_SIZE - crcSize;
        let temp   = buf.slice(offset, offset + bufLen);
        frame.set(headerMsg, 0);
        frame.set(temp, headerMsg.length);
        if (msgCrcFlag === CRC_FLAG.CRC_ON)
        {
            let tempMsg = frame.slice(-crcSize);
            let crc32   = CRC32.buf(tempMsg);
            UINT32_TO_BSTREAM_LSB(crc32, crcMsg);
            frame.set(crcMsg, headerMsg.length + buf.length);
        }
        transport.send(frame);

        remain -= bufLen;
        offset += bufLen;

        while (remain > bufLen)
        {
            header.subTypeFlag =
                header.subTypeFlag & (~PB_FLAG_MASK) | (PB_FLAG.PB_FRAG << 4);
            header.length = bufLen;
            setMsg(headerMsg, header);
            temp = buf.slice(offset, offset + bufLen);

            frame.set(headerMsg, 0);
            frame.set(temp, headerMsg.length);
            if (msgCrcFlag === CRC_FLAG.CRC_ON)
            {
                let tempMsg = frame.slice(-crcSize);
                let crc32   = CRC32.buf(tempMsg);
                UINT32_TO_BSTREAM_LSB(crc32, crcMsg);
                frame.set(crcMsg, headerMsg.length + buf.length);
            }
            transport.send(frame);

            remain -= bufLen;
            offset += bufLen;
        }

        frame = new Uint8Array(TRANS_MSG_HDR_SIZE + bufLen + crcSize);
        header.subTypeFlag =
            header.subTypeFlag & (~PB_FLAG_MASK) | (PB_FLAG.PB_FRAG_LAST << 4);
        header.length = remain;
        setMsg(headerMsg, header);
        temp = buf.slice(offset, offset + remain);

        frame.set(headerMsg, 0);
        frame.set(temp, headerMsg.byteLength);
        if (msgCrcFlag === CRC_FLAG.CRC_ON)
        {
            let tempMsg = frame.slice(-crcSize);
            let crc32   = CRC32.buf(tempMsg);
            UINT32_TO_BSTREAM_LSB(crc32, crcMsg);
            frame.set(crcMsg, headerMsg.length + buf.length);
        }
        transport.send(frame);
    }
}

function transport_handle_ll_rsp(header, buf, id, len)
{
    let crcSize = 0;
    let pbFlag  = header.subTypeFlag & PB_FLAG_MASK;
    let crcFlag = header.subTypeFlag & CRC_FLAG_MASK;
    let subType = header.subTypeFlag & MESSAGE_SUB_TYPE_MASK;

    if (crcFlag === CRC_FLAG.CRC_ON)
    {
        crcSize = CRC_SIZE;
    }

    if (pbFlag === PB_FLAG.PB_CPL)
    {
        msgSpecData = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
    }
    else if (pbFlag === PB_FLAG.PB_FRAG_HEAD)
    {
        reqTrid     = id;
        msgSubType  = subType;
        msgSpecData = new Uint8Array(len);
        let msg     = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
        msgSpecData.set(msg, 0);
        msgSpecDataOffset += msg.byteLength;
    }
    else if (pbFlag === PB_FLAG.PB_FRAG)
    {
        // PB-FRAG and PB-FRAG-LAST must use the same Transaction-ID of their
        // PB-FRAG-HEAD.
        if (reqTrid === id)
        {
            let msg = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
            msgSpecData.set(msg, msgSpecDataOffset);
            msgSpecDataOffset += msg.byteLength;
            return 0;
        }
        else
        {
            console.log("ERROR: Response miss packet.");
            return -1;
        }
    }
    else if (pbFlag === PB_FLAG.PB_FRAG_LAST)
    {
        // PB-FRAG and PB-FRAG-LAST must use the same Transaction-ID of their
        // PB-FRAG-HEAD.
        if (reqTrid === id)
        {
            let msg = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
            msgSpecData.set(msg, msgSpecDataOffset);
            msgSpecData       = null;
            msgSpecDataOffset = 0;
        }
        else
        {
            console.log("ERROR: Response miss packet.");
            return -1;
        }
    }

    switch (subType)
    {
    case RSP_SUB_TYPE.RSP_SUCCESS:
        // generic_msg_management(msgSpecData);
        break;

    case RSP_SUB_TYPE.RSP_ERR_CRC:
    case RSP_SUB_TYPE.RSP_ERR_LEN:
    case RSP_SUB_TYPE.RSP_ERR_PB:
    case RSP_SUB_TYPE.RSP_ERR_TRID:
        console.log("ERROR: Response error subtype: .", subType);
        break;

    case RSP_SUB_TYPE.RSP_ULS_START:
    case RSP_SUB_TYPE.RSP_ULS_STOP:
        uls_rep_manager(msgSpecData);
        break;

    default:
        break;
    }

    return 0;
}

function transport_handle_ll_uls(header, buf, id, len)
{
    let crcSize = 0;
    let pbFlag  = header.subTypeFlag & PB_FLAG_MASK;
    let crcFlag = header.subTypeFlag & CRC_FLAG_MASK;
    let subType = header.subTypeFlag & MESSAGE_SUB_TYPE_MASK;

    if (crcFlag === CRC_FLAG.CRC_ON)
    {
        crcSize = CRC_SIZE;
    }

    if (pbFlag === PB_FLAG.PB_CPL)
    {
        msgSpecData = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
    }
    else if (pbFlag === PB_FLAG.PB_FRAG_HEAD)
    {
        reqTrid     = id;
        msgSubType  = subType;
        msgSpecData = new Uint8Array(len);
        let msg     = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
        msgSpecData.set(msg, 0);
        msgSpecDataOffset += msg.byteLength;
    }
    else if (pbFlag === PB_FLAG.PB_FRAG)
    {
        // PB-FRAG and PB-FRAG-LAST must use the same Transaction-ID of their
        // PB-FRAG-HEAD.
        if (reqTrid === id)
        {
            let msg = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
            msgSpecData.set(msg, msgSpecDataOffset);
            msgSpecDataOffset += msg.byteLength;
            return 0;
        }
        else
        {
            console.log("ERROR: Response miss packet.");
            return -1;
        }
    }
    else if (pbFlag === PB_FLAG.PB_FRAG_LAST)
    {
        // PB-FRAG and PB-FRAG-LAST must use the same Transaction-ID of their
        // PB-FRAG-HEAD.
        if (reqTrid === id)
        {
            let msg = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
            msgSpecData.set(msg, msgSpecDataOffset);
            msgSpecData       = null;
            msgSpecDataOffset = 0;
        }
        else
        {
            console.log("ERROR: Response miss packet.");
            return -1;
        }
    }

    switch (subType)
    {
    case ULS_SUB_TYPE.ULS_GENERIC:
        uls_generic_manager(msgSpecData);
        break;

    default:
        console.log("Error: ULS Subtype.");
        break;
    }

    return 0;
}

function transport_handle_ll_ntf(header, buf, id, len)
{
    let crcSize = 0;
    let pbFlag  = header.subTypeFlag & PB_FLAG_MASK;
    let crcFlag = header.subTypeFlag & CRC_FLAG_MASK;
    let subType = header.subTypeFlag & MESSAGE_SUB_TYPE_MASK;

    if (crcFlag === CRC_FLAG.CRC_ON)
    {
        crcSize = CRC_SIZE;
    }

    if (pbFlag === PB_FLAG.PB_CPL)
    {
        if ((buf.byteLength - crcSize) > 0)
        {
            msgSpecData =
                buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
        }
    }
    else if (pbFlag === PB_FLAG.PB_FRAG_HEAD)
    {
        reqTrid     = id;
        msgSubType  = subType;
        msgSpecData = new Uint8Array(len);
        let msg     = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
        msgSpecData.set(msg, 0);
        msgSpecDataOffset = msg.byteLength;
    }
    else if (pbFlag === PB_FLAG.PB_FRAG)
    {
        // PB-FRAG and PB-FRAG-LAST must use the same Transaction-ID of their
        // PB-FRAG-HEAD.
        if (reqTrid === id)
        {
            let msg = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
            msgSpecData.set(msg, msgSpecDataOffset);
            msgSpecDataOffset += msg.byteLength;
            return 0;
        }
        else
        {
            console.log("ERROR: Response miss packet.");
            return -1;
        }
    }
    else if (pbFlag === PB_FLAG.PB_FRAG_LAST)
    {
        // PB-FRAG and PB-FRAG-LAST must use the same Transaction-ID of their
        // PB-FRAG-HEAD.
        if (reqTrid === id)
        {
            let msg = buf.slice(TRANS_MSG_HDR_SIZE, buf.byteLength - crcSize);
            msgSpecData.set(msg, msgSpecDataOffset);
            msgSpecData       = null;
            msgSpecDataOffset = 0;
        }
        else
        {
            console.log("ERROR: Response miss packet.");
            return -1;
        }
    }

    // NTF-BUFF-TOTAL, NTF-BUFF-IDLE and NTF-BUFF-CLEAN have no TRID field. TRID
    // field is used to identify buffer size.
    switch (subType)
    {
    case NTF_SUB_TYPE.NTF_GENERIC:
        ntf_generic_manager(msgSpecData);
        break;

    case NTF_SUB_TYPE.NTF_BUF_TOTAL:
    case NTF_SUB_TYPE.NTF_BUF_IDLE:
        dls_manager(subType, id);
        return 0;

    case NTF_SUB_TYPE.NTF_BUF_CLEAN:
        dls_manager(subType, 0);
        return 0;

    default:
        console.log("ERROR: NTF Subtype.");
        break;
    }

    return 0;
}

/**
 * @brief
 */
function transport_ll_msg_handler(buf)
{
    let crcSize    = 0;
    let header     = new transMsgHdr();
    let tempHeader = buf.slice(0, TRANS_MSG_HDR_SIZE);
    BSTREAM_TO_OBJECT(tempHeader, header);

    let id = header.IdType & MESSAGE_ID_MASK;
    if (id != MODULE_ID.AUDIO_TOOL)
    {
        console.log("ERROR ID : ", id);
        return -1;
    }

    let type    = header.IdType & MESSAGE_TYPE_MASK;
    let pbFlag  = header.subTypeFlag & PB_FLAG_MASK;
    let crcFlag = header.subTypeFlag & CRC_FLAG_MASK;

    let msgLen = BSTREAM_TO_UINT16_LSB(header.length);
    let trid   = BSTREAM_TO_UINT16_LSB(header.trid);

    if (crcFlag === CRC_FLAG.CRC_ON)
    {
        crcSize = CRC_SIZE;
    }

    // Checkout message length.
    if ((TRANS_MSG_HDR_SIZE + msgLen + crcSize) != buf.byteLength)
    {
        if (pbFlag !== PB_FLAG.PB_FRAG_HEADER)
        {
            console.log("ERROR buffer length.");
            return -1;
        }
    }

    // Checkout CRC32
    if (crcFlag === CRC_FLAG.CRC_ON)
    {
        let crcMsg = buf.slice(-CRC_SIZE);
        let bufMsg = buf.slice(0, buf.byteLength - CRC_SIZE);
        let crc32  = CRC32.buf(bufMsg);
        if (BSTREAM_TO_UINT32_LSB(crcMsg) !== crc32)
        {
            console.log("ERROR: crc32 validation failed.");
            return -1;
        }
    }

    switch (type)
    {
    case MSG_TYPE.RSP:
        if (reqTrid !== trid)
        {
            console.log("ERROR: The Transaction ID of Request : ", reqTrid,
                        "and Response : ", trid, " isn't equal.");
            return -1;
        }

        if ((pbFlag === PB_FLAG.PB_CPL) || (pbFlag === PB_FLAG.PB_FRAG_LAST))
        {
            reqTrid++;
        }
        if (transport_handle_ll_rsp(buf, header, trid, msgLen))
        {
            return -1;
        }
        break;

    case MSG_TYPE.NTF:
        transport_handle_ll_ntf(buf, header, trid, msgLen);
        break;

    case MSG_TYPE.ULS:
        transport_handle_ll_uls(buf, header, trid, msgLen);
        break;

    default:
        console.log("ERROR: Message Type : ", type);
        break;
    }

    return 0;
}

// Start playing audio data.
function transport_send_dls_start(port)
{
    transport_send(port, MSG_TYPE.DLS, DLS_SUB_TYPE.DLS_FIRST, buf);
}

// Stop playing audio data.
function transport_send_dls_stop(port)
{
    transport_send(port, MSG_TYPE.DLS, DLS_SUB_TYPE.DLS_LAST, buf);
}

// Send generic REQ with Message-Specific-Data.
function transport_send_req_generic(port, buf)
{
    transport_send(port, MSG_TYPE.REQ, DLS_SUB_TYPE.REQ_GENERIC, buf);
}

// Start capturing audio data.
function transport_send_uls_start(port, buf)
{
    transport_send(port, MSG_TYPE.REQ, REQ_SUB_TYPE.REQ_ULS_START, buf);
}

// Stop capturing audio data.
function transport_send_uls_stop(port, buf)
{
    transport_send(port, MSG_TYPE.REQ, REQ_SUB_TYPE.REQ_ULS_STOP, buf);
}

function dls_manager(type, size)
{
    switch (type)
    {
    case NTF_SUB_TYPE.NTF_BUF_TOTAL:
    case NTF_SUB_TYPE.NTF_BUF_IDLE:
        // send idle size to player.
        break;

    case NTF_SUB_TYPE.NTF_BUF_CLEAN:
        // Tell Player to stop playing.
        break;
    default:
        break;
    }
}

function ntf_generic_manager(buf)
{
    // Send ntf generic msg to service layer.
}

function uls_generic_manager(buf)
{
    // Send uls generic msg to service layer.
}

function uls_rep_manager(buf)
{
    // Send uls response msg to service layer.
}
