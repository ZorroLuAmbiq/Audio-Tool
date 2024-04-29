//*****************************************************************************
//
//! @file application.js
//!
//! @brief Handle web operation.
//!
//
//*****************************************************************************

(function() {
'use strict';

document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

    /**
     * @brief Connect PC with MCU through WebUSB
     *
     */
    function connect()
    {
        port.connect().then(
            () => {
                statusDisplay.textContent = '';
                connectButton.textContent = 'Disconnect';

                // Invoked when port receive data
                port.onReceive = data => {
                    // Recive message from AP5
                    receiveMsg(data);
                };
                port.onReceiveError = error => {
                    console.error(error);
                    log("webUSB disconnect.");

                    cleanStatus();
                    connectButton.textContent = 'Connect';
                    statusDisplay.textContent = '';
                    port                      = null;
                };
            },
            error => {
                statusDisplay.textContent = error;
            });
    }

    // Invoked when connect Button is clicked
    connectButton.addEventListener('click', function() {
        if (port)
        {
            port.disconnect();
            connectButton.textContent = 'Connect';
            statusDisplay.textContent = '';
            port                      = null;
        }
        else
        {
            serial.requestPort()
                .then(selectedPort => {
                    port = selectedPort;
                    // Connect Audio Tool with MCU
                    connect();
                })
                .catch(error => {
                    statusDisplay.textContent = error;
                });
        }
    });

    // Creat MCPS chart
    const ctx       = document.getElementById('McpsChart').getContext('2d');
    handleMcpsChart = new Chart(ctx, mcpsChartConfig);

    // Display default MCPS
    document.getElementById("aec-mcps").textContent    = "AEC : 0MCPS";
    document.getElementById("ns-mcps").textContent     = "NS : 0MCPS";
    document.getElementById("peq-ul-mcps").textContent = "PEQ_UL : 0MCPS";
    document.getElementById("peq-dl-mcps").textContent = "PEQ_DL : 0MCPS";
    document.getElementById("mbdrc-mcps").textContent  = "MBDRC : 0MCPS";

    // Invoked when Read MCPS Button is clicked
    document.querySelector("#show_popup").onclick = () => {
        let overlay           = document.getElementById("overlay");
        overlay.style.display = "block";

        if (!port)
        {
            log("Failed to read MCPS, please check WebUSB connection.");
            return;
        }
        mcpsInterval.id = setInterval(updateMcps, 1000, port);
    };

    // Invoked when Close Button is clicked
    document.querySelector("#hide_popup").onclick = () => {
        // Clear MCPS interval.
        clearInterval(mcpsInterval.id);
        mcpsInterval.id = null;

        let overlay           = document.getElementById("overlay");
        overlay.style.display = "none";
    };

    // Invoked when GAIN Bypass Checkbox is selected.
    document.querySelector("#gain").addEventListener("change", function(event) {
        if (event.target.checked)
        {
            console.log("Enable GAIN.");
            setBypass(port, OBJ.ACORE_DSP_GAIN, false);
        }
        else
        {
            console.log("Disable GAIN.");
            setBypass(port, OBJ.ACORE_DSP_GAIN, true);
        }
    });

    // Invoked when DRC_UL Bypass Checkbox is selected
    document.querySelector("#drc_ul").addEventListener(
        "change", function(event) {
            if (event.target.checked)
            {
                console.log("Enable DRC UL.");
                setBypass(port, OBJ.ACORE_DSP_DRC_UL, false);
            }
            else
            {
                console.log("Disable DRC UL.");
                setBypass(port, OBJ.ACORE_DSP_DRC_UL, true);
            }
        });

    // Invoked when DRC_DL Bypass Checkbox is selected
    document.querySelector("#drc_dl").addEventListener(
        "change", function(event) {
            if (event.target.checked)
            {
                console.log("Enable DRC DL.");
                setBypass(port, OBJ.ACORE_DSP_DRC_DL, false);
            }
            else
            {
                console.log("Disable DRC DL.");
                setBypass(port, OBJ.ACORE_DSP_DRC_DL, true);
            }
        });

    // Invoked when MBDRC Bypass Checkbox is selected
    document.querySelector("#mbdrc").addEventListener(
        "change", function(event) {
            if (event.target.checked)
            {
                console.log("Enable mbdrc.");
                setBypass(port, OBJ.ACORE_DSP_MBDRC, false);
            }
            else
            {
                console.log("Disable mbdrc.");
                setBypass(port, OBJ.ACORE_DSP_MBDRC, true);
            }
        });

    // Invoked when AGC Bypass Checkbox is selected
    document.querySelector("#agc").addEventListener("change", function(event) {
        if (event.target.checked)
        {
            console.log("Enable AGC.");
            setBypass(port, OBJ.ACORE_DSP_AGC, false);
        }
        else
        {
            console.log("Disable AGC.");
            setBypass(port, OBJ.ACORE_DSP_AGC, true);
        }
    });

    // Invoked when PEQ_UL Bypass Checkbox is selected
    document.querySelector("#peq_ul").addEventListener(
        "change", function(event) {
            if (event.target.checked)
            {
                console.log("Enable PEQ UL.");
                setBypass(port, OBJ.ACORE_DSP_PEQ_UL, false);
            }
            else
            {
                console.log("Disable PEQ UL.");
                setBypass(port, OBJ.ACORE_DSP_PEQ_UL, true);
            }
        });

    // Invoked when PEQ_DL Bypass Checkbox is selected
    document.querySelector("#peq_dl").addEventListener(
        "change", function(event) {
            if (event.target.checked)
            {
                console.log("Enable PEQ DL.");
                setBypass(port, OBJ.ACORE_DSP_PEQ_DL, false);
            }
            else
            {
                console.log("Disable PEQ DL.");
                setBypass(port, OBJ.ACORE_DSP_PEQ_DL, true);
            }
        });

    // Invoked when AEC Bypass Checkbox is selected
    document.querySelector("#aec").addEventListener("change", function(event) {
        if (event.target.checked)
        {
            console.log("Enable AEC.");
            setBypass(port, OBJ.ACORE_DSP_AEC, false);
        }
        else
        {
            console.log("Disable AEC.");
            setBypass(port, OBJ.ACORE_DSP_AEC, true);
        }
    });

    // Invoked when NS Bypass Checkbox is selected
    document.querySelector("#ns").addEventListener("change", function(event) {
        if (event.target.checked)
        {
            console.log("Enable NS.");
            setBypass(port, OBJ.ACORE_DSP_NS, false);
        }
        else
        {
            console.log("Disable NS.");
            setBypass(port, OBJ.ACORE_DSP_NS, true);
        }
    });

    // Invoked when IIR_FILTER Bypass Checkbox is selected
    document.querySelector("#iir_filter")
        .addEventListener("change", function(event) {
            if (event.target.checked)
            {
                console.log("Enable IIR FILTER.");
                setBypass(port, OBJ.ACORE_DSP_IIR_FILTER, false);
            }
            else
            {
                setBypass(port, OBJ.ACORE_DSP_IIR_FILTER, true);
                console.log("Disable IIR FILTER.");
            }
        });

    // Invoked when Aec Send Button is clicked
    document.querySelector("#aec_send").onclick = () => {
        // AEC
        let filter_len  = document.querySelector("#filter_len").value;
        let fixed_delay = document.querySelector("#fixed_delay").value;
        let nlp         = document.querySelector("#aec_nlp");
        let level       = document.querySelector("#aec_nlp_level").value;
        setAec(port, filter_len, fixed_delay, nlp.checked, level);
    };

    // Invoked when Ns Send Button is clicked
    document.querySelector("#ns_send").onclick = () => {
        // NS
        let level = document.querySelector("#ns_level").value;
        setNs(port, level);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#gain_send").onclick = () => {
        // Gain
        let gain_db = document.querySelector("#gain").value;
        setGain(gain_db, port);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#drc_ul_send").onclick = () => {
        // DRC-UL Parameters
        let dir           = "uplink";
        let drcAttackTime = document.querySelector("#DrcUlAttackTime").value;
        let drcDecayTime  = document.querySelector("#DrcUlDecayTime").value;
        let drcKneeThreshold =
            document.querySelector("#DrcUlKneeThreshold").value;
        let drcNoiseGate = document.querySelector("#DrcUlNoiseGate").value;
        let drcSlope     = document.querySelector("#DrcUlSlope").value;
        setDrc(port, dir, drcAttackTime, drcDecayTime, drcKneeThreshold,
               drcNoiseGate, drcSlope);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#drc_dl_send").onclick = () => {
        // DRC-DL Parameters
        let dir           = "downlink";
        let drcAttackTime = document.querySelector("#DrcDlAttackTime").value;
        let drcDecayTime  = document.querySelector("#DrcDlDecayTime").value;
        let drcKneeThreshold =
            document.querySelector("#DrcDlKneeThreshold").value;
        let drcNoiseGate = document.querySelector("#DrcDlNoiseGate").value;
        let drcSlope     = document.querySelector("#DrcDlSlope").value;
        setDrc(port, dir, drcAttackTime, drcDecayTime, drcKneeThreshold,
               drcNoiseGate, drcSlope);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#mbdrc_send").onclick = () => {
        // MBDRC Parameters
        let bandNumber = document.querySelector("#MbdrcBandNumber").value;
        let highBound  = document.getElementsByName("MbdrcHighBound");
        let compThd    = document.getElementsByName("MbdrcCompThd");
        let compSlope  = document.getElementsByName("MbdrcCompSlope");
        setMbdrc(port, bandNumber, highBound, compThd, compSlope);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#agc_send").onclick = () => {
        // Agc Parameters
        let agcAttackTime = document.querySelector("#AgcAttackTime").value;
        let agcDecayTime  = document.querySelector("#AgcDecayTime").value;
        let agcTarget     = document.querySelector("#AgcTarget").value;
        setAgc(port, agcAttackTime, agcDecayTime, agcTarget);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#peq_ul_send").onclick = () => {
        // PEQ Parameters
        let dir        = "uplink";
        let bandNumber = document.querySelector("#peq_ul_band_number").value;
        let bandCenterFreq =
            document.getElementsByName("peq_ul_band_center_freq");
        let bandQfactor = document.getElementsByName("peq_ul_band_qfactor");
        let bandGain    = document.getElementsByName("peq_ul_band_gain");
        setPeq(port, dir, bandNumber, bandCenterFreq, bandQfactor, bandGain);
    };

    // Invoked when Send Button is clicked
    document.querySelector("#peq_dl_send").onclick = () => {
        // PEQ Parameters
        let dir        = "downlink";
        let bandNumber = document.querySelector("#peq_dl_band_number").value;
        let bandCenterFreq =
            document.getElementsByName("peq_dl_band_center_freq");
        let bandQfactor = document.getElementsByName("peq_dl_band_qfactor");
        let bandGain    = document.getElementsByName("peq_dl_band_gain");
        setPeq(port, dir, bandNumber, bandCenterFreq, bandQfactor, bandGain);
    };

    const selectPathButton   = document.querySelector("#select_path_button");
    const startCaptureButton = document.querySelector("#start_capture_button");
    const stopCaptureButton  = document.querySelector("#stop_capture_button");
    const startPlayButton    = document.querySelector("#start_play_button");
    const stopPlayButton     = document.querySelector("#stop_play_button");

    // Disable Button
    startCaptureButton.disabled = !0;
    stopCaptureButton.disabled  = !0;

    // Invoked when Select Path Button is clicked
    selectPathButton.addEventListener(
        "click", (async () => {
            snifferDirectoryHandle = await window.showDirectoryPicker();
            snifferFileHandle = await      snifferDirectoryHandle.getFileHandle(
                "audio.bin", {create : true});
            snifferFile = await snifferFileHandle.createWritable();

            startCaptureButton.disabled = !1;

            // Enable Selected Capture Points
            let audio = document.getElementsByName("audio");
            setSniffer(port, audio);
            log("The path of audio data has been selected.")
        }))

    // Invoked when Start Capture Button is clicked
    startCaptureButton.addEventListener("click", (() => {
                                            if (snifferFile)
                                            {
                                                snifferActive(port, true);
                                                snifferState = SNIFFER.ENABLE;
                                                stopCaptureButton.disabled = !1;
                                            }
                                        }))

    // Invoked when Stop Capture Button is clicked
    stopCaptureButton.addEventListener(
        "click", (async () => {
            if (snifferFile)
            {
                snifferState = SNIFFER.DISABLE;
                await snifferFile.close();
            }

            // Stop capturing data
            snifferActive(port, false);

            const reader = new FileReader();
            let file     = await snifferFileHandle.getFile();
            // File read complete
            reader.onload = () => {
                console.log(reader.result);
                // Parse bin file to pcm file
                binToRaw(reader.result, snifferDirectoryHandle);
            };

            reader.onerror = (event) => {
                console.log("Failed to read sniffer file : " + event);
            };
            reader.readAsArrayBuffer(file);
            startCaptureButton.disabled = !0;
            stopCaptureButton.disabled  = !0,
            log("Your microphone audio has been successfully sniffed locally.")
        }))

    // Invoked when Start Play Button is clicked
    startPlayButton.addEventListener(
        "click", (() => {
            const binFile = document.getElementById('pcm_file');
            const file    = binFile.files[0];
            if (!file)
            {
                console.log("Please add pcm file");
                return;
            }

            const reader = new FileReader();
            // File read complete
            reader.onload = () => {
                console.log(reader.result);
                // Play pcm file
                playFile(reader.result, port, playInterval);
            };
            reader.readAsArrayBuffer(file);
        }))

    // Invoked when Stop Play Button is clicked
    stopPlayButton.addEventListener("click", (() => {
                                        clearInterval(playInterval.id);
                                        playInterval.id = null;
                                    }))

    // Print promise rejection
    window.onunhandledrejection = e => {
        log(`> ${e.reason}`);
    };

    // Print global error
    window.onerror = e => {
        log(`> ${e}`);
    };
});   // DOMContentLoaded
})(); // function()
