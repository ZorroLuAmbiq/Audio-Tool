/****************************************************************************************
 *
 * @file mcps.js
 *
 * @brief Display AP5 MCPS
 *
 * Copyright (C) Ambiq Micro
 *
 *
 ****************************************************************************************
 */

/**
 * @brief Get AP5 MCPS through webUSB.
 */
function getRandomNum(min, max)
{
    let range = max - min;
    let rand  = Math.random();
    return (min + Math.round(rand * range));
}

function updateMcps(chart, config, dataLabels, aecMcps, nsMcps)
{
    if (config.data.datasets.length > 0)
    {

        let last  = parseInt(dataLabels[dataLabels.length - 1]);
        let label = last + 1;
        if (last >= 9)
        {
            label = 0;
        }
        label = label + 's';

        aecMcpsRandom = getRandomNum(100, 200);
        nsMcpsRandom  = getRandomNum(10, 90);

        dataLabels.push(label);
        aecMcps.push(aecMcpsRandom);
        nsMcps.push(nsMcpsRandom);

        dataLabels.shift();
        aecMcps.shift();
        nsMcps.shift();

        chart.update();
    }

    let aecMcpsValue = "AEC MCPS: " + aecMcpsRandom + "MHz";
    let nsMcpsValue  = "NS MCPS: " + nsMcpsRandom + "MHz";

    document.getElementById("aec-mcps").textContent = aecMcpsValue;
    document.getElementById("ns-mcps").textContent  = nsMcpsValue;
}
