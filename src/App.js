import React, { useState, useMemo, useEffect } from "react";

/*
==================== SIMPLE PWA SETUP ====================
(Do this AFTER creating your React app)

1️⃣ In public folder create manifest.json:

{
  "name": "Almond Costing Calculator",
  "short_name": "AlmondCalc",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2c3e50",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

2️⃣ Inside public/index.html <head> add:

<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
<meta name="theme-color" content="#2c3e50" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/icon-192.png" />

3️⃣ Create public/sw.js

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('almond-cache-v1').then(function (cache) {
      return cache.addAll(['./']);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
===========================================================
*/

export default function AlmondCostingCalculator() {
  const [cifRate, setCifRate] = useState("");
  const [usdRate, setUsdRate] = useState("");
  const [cdPercent, setCdPercent] = useState("");

  // Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js");
    }
  }, []);

  const results = useMemo(() => {
    const CIF = parseFloat(cifRate);
    const USD = parseFloat(usdRate);
    const CD_input = parseFloat(cdPercent);

    if (isNaN(CIF) || isNaN(USD) || isNaN(CD_input)) {
      return { inshellRate: "", kernelRate: "" };
    }

    const CD = CD_input / 100;

    const base = CIF * 2.20462 * USD + 35;
    const withInsurance = base + 0.05 * base;
    const totalCost = withInsurance + 6;

    const inshellRate = totalCost * 40 + CD * (totalCost * 40);

    const kernelRaw = (inshellRate + 300) / 0.7 / 40;
    const kernelRate = Math.ceil(kernelRaw * 10) / 10;

    return {
      inshellRate: inshellRate.toFixed(2),
      kernelRate: kernelRate.toFixed(1),
    };
  }, [cifRate, usdRate, cdPercent]);

  const containerStyle = {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const resultBox = {
    background: "#f4f4f4",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2c3e50",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>
        Almond Import Costing Calculator
      </h2>

      <label>CIF Rate ($)</label>
      <input
        type="number"
        value={cifRate}
        onChange={(e) => setCifRate(e.target.value)}
        style={inputStyle}
        placeholder="Enter CIF rate"
      />

      <label>USD/INR Rate</label>
      <input
        type="number"
        value={usdRate}
        onChange={(e) => setUsdRate(e.target.value)}
        style={inputStyle}
        placeholder="Enter USD rate"
      />

      <label>Cash Discount (%)</label>
      <input
        type="number"
        value={cdPercent}
        onChange={(e) => setCdPercent(e.target.value)}
        style={inputStyle}
        placeholder="Example: 2 for 2%"
      />

      <div style={resultBox}>
        <p>
          <strong>Inshell Rate / 40 Kg:</strong>{" "}
          {results.inshellRate ? `₹ ${results.inshellRate}` : "-"}
        </p>
        <p>
          <strong>Kernel Rate / Kg:</strong>{" "}
          {results.kernelRate ? `₹ ${results.kernelRate}` : "-"}
        </p>
      </div>

      <button
        style={buttonStyle}
        onClick={() => {
          setCifRate("");
          setUsdRate("");
          setCdPercent("");
        }}
      >
        Reset Calculator
      </button>
    </div>
  );
}
