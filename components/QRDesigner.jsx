"use client";

import { useEffect, useMemo, useRef, useState } from "react";

let QRCodeStyling;
// Lazy-load to avoid SSR issues
if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  QRCodeStyling = require("qr-code-styling");
}

const DOT_TYPES = [
  "square",
  "dots",
  "rounded",
  "classy",
  "classy-rounded",
  "extra-rounded",
];

const CORNER_SQUARE_TYPES = ["square", "extra-rounded"];
const CORNER_DOT_TYPES = ["square", "dot"]; // library accepts these

export default function QRDesigner() {
  const ref = useRef(null);
  const qrRef = useRef(null);

  // Controls
  const [data, setData] = useState("");
  const [mode, setMode] = useState("freeform"); // freeform | link | phone | email | wifi | mecard | vcard
  const [size, setSize] = useState(256);
  const [dotType, setDotType] = useState("square");
  const [dotColor, setDotColor] = useState("#111111");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgTransparent, setBgTransparent] = useState(false);
  // Gradients
  const [dotGradEnabled, setDotGradEnabled] = useState(false);
  const [dotGradType, setDotGradType] = useState("linear"); // linear | radial
  const [dotGradStart, setDotGradStart] = useState("#111111");
  const [dotGradMid, setDotGradMid] = useState("#333333");
  const [dotGradEnd, setDotGradEnd] = useState("#555555");
  const [dotGradStops, setDotGradStops] = useState(2); // 2 or 3
  const [dotGradRotation, setDotGradRotation] = useState(0); // radians expected by lib

  const [bgGradEnabled, setBgGradEnabled] = useState(false);
  const [bgGradType, setBgGradType] = useState("linear");
  const [bgGradStart, setBgGradStart] = useState("#ffffff");
  const [bgGradMid, setBgGradMid] = useState("#f0f0f0");
  const [bgGradEnd, setBgGradEnd] = useState("#e5e5e5");
  const [bgGradStops, setBgGradStops] = useState(2); // 2 or 3
  const [bgGradRotation, setBgGradRotation] = useState(0);
  const [cornerSquareType, setCornerSquareType] = useState("square");
  const [cornerSquareColor, setCornerSquareColor] = useState("#111111");
  const [cornerDotType, setCornerDotType] = useState("dot");
  const [cornerDotColor, setCornerDotColor] = useState("#111111");
  const [errorCorrection, setErrorCorrection] = useState("M"); // L M Q H
  const [quietZone, setQuietZone] = useState(4);
  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState(0.35); // ratio (0..1)
  const [error, setError] = useState("");

  // Preset fields
  const [linkUrl, setLinkUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [wifiType, setWifiType] = useState("WPA"); // WEP | WPA | nopass
  // Contact (MeCard / vCard)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [org, setOrg] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // Compose data based on preset mode (hoisted as function for early use)
  function presetData() {
    switch (mode) {
      case "link": {
        if (!linkUrl) return "";
        const hasScheme = /^(https?:)?\/\//i.test(linkUrl);
        return hasScheme ? linkUrl : `https://${linkUrl}`;
      }
      case "phone":
        return phone ? `tel:${phone.replace(/\s+/g, "")}` : "";
      case "email": {
        if (!email) return "";
        const params = new URLSearchParams();
        if (emailSubject) params.set("subject", emailSubject);
        if (emailBody) params.set("body", emailBody);
        const qs = params.toString();
        return qs ? `mailto:${email}?${qs}` : `mailto:${email}`;
      }
      case "wifi": {
        if (!wifiSsid) return "";
        const T = wifiType === "nopass" ? "nopass" : wifiType;
        const P = wifiType === "nopass" ? "" : `P:${wifiPass};`;
        const H = wifiHidden ? "H:true;" : "";
        const esc = (v) => v.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,");
        return `WIFI:T:${T};S:${esc(wifiSsid)};${P}${H};`;
      }
      case "mecard": {
        const esc = (v) => v.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,");
        const parts = [];
        const n = [lastName, firstName].filter(Boolean).join(",");
        if (n) parts.push(`N:${esc(n)}`);
        if (contactPhone) parts.push(`TEL:${esc(contactPhone)}`);
        if (contactEmail) parts.push(`EMAIL:${esc(contactEmail)}`);
        if (org) parts.push(`ORG:${esc(org)}`);
        if (url) parts.push(`URL:${esc(url)}`);
        if (note) parts.push(`NOTE:${esc(note)}`);
        const adr = [street, city, state, zip, country].filter(Boolean).join(",");
        if (adr) parts.push(`ADR:${esc(adr)}`);
        if (!parts.length) return "";
        return `MECARD:${parts.join(";")};`;
      }
      case "vcard": {
        const lines = [];
        lines.push("BEGIN:VCARD");
        lines.push("VERSION:3.0");
        const n = `${lastName || ""};${firstName || ""};;;`;
        lines.push(`N:${n}`);
        const fn = [firstName, lastName].filter(Boolean).join(" ");
        if (fn) lines.push(`FN:${fn}`);
        if (org) lines.push(`ORG:${org}`);
        if (contactPhone) lines.push(`TEL;TYPE=CELL:${contactPhone}`);
        if (contactEmail) lines.push(`EMAIL:${contactEmail}`);
        const adr = ["", "", street || "", city || "", state || "", zip || "", country || ""].join(";");
        if (street || city || state || zip || country) lines.push(`ADR;TYPE=HOME:${adr}`);
        if (url) lines.push(`URL:${url}`);
        if (note) lines.push(`NOTE:${note}`);
        lines.push("END:VCARD");
        return lines.join("\n");
      }
      default:
        return data || "";
    }
  }

  const options = useMemo(
    () => ({
      width: size,
      height: size,
      type: "canvas",
      data: presetData() || "https://",
      backgroundOptions: {
        color: bgTransparent ? "transparent" : bgColor,
        ...(bgGradEnabled
          ? {
              gradient: {
                type: bgGradType,
                rotation: bgGradRotation,
                colorStops:
                  bgGradStops === 3
                    ? [
                        { offset: 0, color: bgGradStart },
                        { offset: 0.5, color: bgGradMid },
                        { offset: 1, color: bgGradEnd },
                      ]
                    : [
                        { offset: 0, color: bgGradStart },
                        { offset: 1, color: bgGradEnd },
                      ],
              },
            }
          : {}),
      },
      image: imageUrl || undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        imageSize,
        hideBackgroundDots: true,
        margin: 2,
      },
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
        margin: quietZone,
      },
      dotsOptions: {
        color: dotGradEnabled ? undefined : dotColor,
        type: dotType,
        ...(dotGradEnabled
          ? {
              gradient: {
                type: dotGradType,
                rotation: dotGradRotation,
                colorStops:
                  dotGradStops === 3
                    ? [
                        { offset: 0, color: dotGradStart },
                        { offset: 0.5, color: dotGradMid },
                        { offset: 1, color: dotGradEnd },
                      ]
                    : [
                        { offset: 0, color: dotGradStart },
                        { offset: 1, color: dotGradEnd },
                      ],
              },
            }
          : {}),
      },
      cornersSquareOptions: {
        color: cornerSquareColor,
        type: cornerSquareType,
      },
      cornersDotOptions: {
        color: cornerDotColor,
        type: cornerDotType,
      },
    }),
    [
      size,
      data,
      bgTransparent,
      bgColor,
      bgGradEnabled,
      bgGradType,
      bgGradStart,
      bgGradMid,
      bgGradEnd,
      bgGradStops,
      bgGradRotation,
      imageUrl,
      imageSize,
      errorCorrection,
      quietZone,
      dotColor,
      dotType,
      dotGradEnabled,
      dotGradType,
      dotGradStart,
      dotGradMid,
      dotGradEnd,
      dotGradStops,
      dotGradRotation,
      cornerSquareColor,
      cornerSquareType,
      cornerDotColor,
      cornerDotType,
    ]
  );

  // end presetData

  // Live validation message
  const validation = useMemo(() => {
    const value = presetData();
    if (!value) return { ok: false, msg: "Enter content to generate a QR." };
    if (mode === "link") {
      if (!/^https?:\/\//i.test(value)) return { ok: true, msg: "No scheme found, using https automatically." };
    }
    if (mode === "email") {
      if (!/^mailto:/i.test(value)) return { ok: false, msg: "Invalid email format." };
    }
    if (mode === "phone") {
      if (!/^tel:/i.test(value)) return { ok: false, msg: "Phone should start with tel:." };
    }
    if (mode === "wifi") {
      if (!/^WIFI:/i.test(value)) return { ok: false, msg: "Wi‑Fi string malformed." };
    }
    return { ok: true, msg: "Ready." };
  }, [mode, linkUrl, phone, email, emailSubject, emailBody, wifiSsid, wifiPass, wifiHidden, wifiType, data, firstName, lastName, contactPhone, contactEmail, org, url, note, street, city, state, zip, country]);

  useEffect(() => {
    if (!ref.current || !QRCodeStyling) return;
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(ref.current);
    } else {
      qrRef.current.update(options);
    }
  }, [options]);

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const download = async (ext) => {
    if (!qrRef.current) return;
    await qrRef.current.download({ extension: ext });
  };

  const copyContent = async () => {
    try {
      const value = presetData();
      await navigator.clipboard.writeText(value || "");
    } catch (e) {
      // ignore
    }
  };

  const getPngBlob = async () => {
    if (!qrRef.current) return null;
    if (qrRef.current.getRawData) {
      try {
        const blob = await qrRef.current.getRawData("png");
        if (blob) return blob;
      } catch (e) {
        // fallback below
      }
    }
    // Fallback: find canvas and convert
    const canvas = ref.current?.querySelector?.("canvas");
    if (!canvas) return null;
    const blob = await new Promise((res) => canvas.toBlob(res));
    return blob;
  };

  const copyImage = async () => {
    if (!qrRef.current) return;
    try {
      const blob = await getPngBlob();
      if (!blob) return;
      if ("ClipboardItem" in window) {
        // eslint-disable-next-line no-undef
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
      } else {
        // Fallback: trigger a temporary download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // ignore
    }
  };

  const downloadPDF = async () => {
    if (!qrRef.current) return;
    try {
      const blob = await getPngBlob();
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: [size, size] });
      pdf.addImage(img, "PNG", 0, 0, size, size);
      pdf.save("qrcode.pdf");
      URL.revokeObjectURL(url);
    } catch (e) {
      // ignore
    }
  };

  // Preset save/load to localStorage
  const [savedPresets, setSavedPresets] = useState([]);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("qr_presets_v1");
      if (raw) setSavedPresets(JSON.parse(raw));
    } catch (_) {
      // ignore
    }
  }, []);

  const persistPresets = (list) => {
    setSavedPresets(list);
    try {
      localStorage.setItem("qr_presets_v1", JSON.stringify(list));
    } catch (_) {
      // ignore
    }
  };

  const buildSnapshot = () => ({
    name: presetName || `Preset ${new Date().toLocaleString()}`,
    mode,
    data,
    linkUrl,
    phone,
    email,
    emailSubject,
    emailBody,
    wifiSsid,
    wifiPass,
    wifiHidden,
    wifiType,
    firstName,
    lastName,
    contactPhone,
    contactEmail,
    org,
    url,
    note,
    street,
    city,
    state,
    zip,
    country,
    size,
    dotType,
    dotColor,
    bgColor,
    bgTransparent,
    dotGradEnabled,
    dotGradType,
    dotGradStart,
    dotGradMid,
    dotGradEnd,
    dotGradStops,
    dotGradRotation,
    bgGradEnabled,
    bgGradType,
    bgGradStart,
    bgGradMid,
    bgGradEnd,
    bgGradStops,
    bgGradRotation,
    cornerSquareType,
    cornerSquareColor,
    cornerDotType,
    cornerDotColor,
    errorCorrection,
    quietZone,
    imageSize,
    // imageUrl intentionally skipped
  });

  const applySnapshot = (s) => {
    setMode(s.mode ?? mode);
    setData(s.data ?? "");
    setLinkUrl(s.linkUrl ?? "");
    setPhone(s.phone ?? "");
    setEmail(s.email ?? "");
    setEmailSubject(s.emailSubject ?? "");
    setEmailBody(s.emailBody ?? "");
    setWifiSsid(s.wifiSsid ?? "");
    setWifiPass(s.wifiPass ?? "");
    setWifiHidden(!!s.wifiHidden);
    setWifiType(s.wifiType ?? "WPA");
    setFirstName(s.firstName ?? "");
    setLastName(s.lastName ?? "");
    setContactPhone(s.contactPhone ?? "");
    setContactEmail(s.contactEmail ?? "");
    setOrg(s.org ?? "");
    setUrl(s.url ?? "");
    setNote(s.note ?? "");
    setStreet(s.street ?? "");
    setCity(s.city ?? "");
    setState(s.state ?? "");
    setZip(s.zip ?? "");
    setCountry(s.country ?? "");
    setSize(s.size ?? 256);
    setDotType(s.dotType ?? "square");
    setDotColor(s.dotColor ?? "#111111");
    setBgColor(s.bgColor ?? "#ffffff");
    setBgTransparent(!!s.bgTransparent);
    setDotGradEnabled(!!s.dotGradEnabled);
    setDotGradType(s.dotGradType ?? "linear");
    setDotGradStart(s.dotGradStart ?? "#111111");
    setDotGradMid(s.dotGradMid ?? "#333333");
    setDotGradEnd(s.dotGradEnd ?? "#555555");
    setDotGradStops(s.dotGradStops ?? 2);
    setDotGradRotation(s.dotGradRotation ?? 0);
    setBgGradEnabled(!!s.bgGradEnabled);
    setBgGradType(s.bgGradType ?? "linear");
    setBgGradStart(s.bgGradStart ?? "#ffffff");
    setBgGradMid(s.bgGradMid ?? "#f0f0f0");
    setBgGradEnd(s.bgGradEnd ?? "#e5e5e5");
    setBgGradStops(s.bgGradStops ?? 2);
    setBgGradRotation(s.bgGradRotation ?? 0);
    setCornerSquareType(s.cornerSquareType ?? "square");
    setCornerSquareColor(s.cornerSquareColor ?? "#111111");
    setCornerDotType(s.cornerDotType ?? "dot");
    setCornerDotColor(s.cornerDotColor ?? "#111111");
    setErrorCorrection(s.errorCorrection ?? "M");
    setQuietZone(s.quietZone ?? 4);
    setImageSize(s.imageSize ?? 0.35);
  };

  const savePreset = () => {
    const snapshot = buildSnapshot();
    const id = Date.now().toString(36);
    const list = [...savedPresets, { id, ...snapshot }];
    persistPresets(list);
    setPresetName("");
  };

  const [selectedPresetId, setSelectedPresetId] = useState("");
  const loadPreset = () => {
    const p = savedPresets.find((x) => x.id === selectedPresetId);
    if (p) applySnapshot(p);
  };
  const deletePreset = () => {
    const list = savedPresets.filter((x) => x.id !== selectedPresetId);
    persistPresets(list);
    setSelectedPresetId("");
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Preset</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"
              >
                <option value="freeform">Freeform</option>
                <option value="link">Link</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="wifi">Wi‑Fi</option>
                <option value="mecard">MeCard</option>
                <option value="vcard">vCard</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={copyContent} className="h-10 px-3 rounded-md border border-black/10 dark:border-white/15 text-sm">Copy Content</button>
              <button onClick={copyImage} className="h-10 px-3 rounded-md border border-black/10 dark:border-white/15 text-sm">Copy Image</button>
            </div>
          </div>

          {mode === "freeform" && (
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <input
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="Enter text, URL, phone, etc."
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
              />
            </div>
          )}
          {mode === "link" && (
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
              />
            </div>
          )}
          {mode === "phone" && (
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+123456789"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
              />
            </div>
          )}
          {mode === "email" && (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
              />
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Hello"
                    className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <input
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Message..."
                    className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
          {(mode === "mecard" || mode === "vcard") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">First name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organization</label>
                <input value={org} onChange={(e) => setOrg(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Street</label>
                <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP</label>
                <input value={zip} onChange={(e) => setZip(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Note</label>
                <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
              </div>
            </div>
          )}
          {mode === "wifi" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">SSID</label>
                <input
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Network name"
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Security</label>
                <select
                  value={wifiType}
                  onChange={(e) => setWifiType(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No password</option>
                </select>
              </div>
              {wifiType !== "nopass" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="password"
                    className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none"
                  />
                </div>
              )}
              <label className="flex items-center gap-2 text-sm mt-2">
                <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} />
                Hidden network
              </label>
            </div>
          )}

          <p className={`text-xs ${validation.ok ? "text-emerald-600" : "text-amber-600"}`}>
            {validation.msg}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Size: {size}px</label>
            <input
              type="range"
              min={128}
              max={512}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo size</label>
            <input
              type="range"
              min={0.15}
              max={0.45}
              step={0.01}
              value={imageSize}
              onChange={(e) => setImageSize(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Error correction</label>
            <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2">
              <option value="L">L (Lowest)</option>
              <option value="M">M</option>
              <option value="Q">Q</option>
              <option value="H">H (Highest)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quiet zone: {quietZone}px</label>
            <input type="range" min={0} max={32} value={quietZone} onChange={(e) => setQuietZone(parseInt(e.target.value, 10))} className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Save preset name</label>
              <input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="My preset" className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 outline-none" />
            </div>
            <button type="button" onClick={savePreset} className="h-10 px-3 rounded-md border border-black/10 dark:border-white/15 text-sm">Save Preset</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <select value={selectedPresetId} onChange={(e) => setSelectedPresetId(e.target.value)} className="md:col-span-2 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2">
              <option value="">Select saved preset</option>
              {savedPresets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={loadPreset} className="px-3 h-10 rounded-md border border-black/10 dark:border-white/15 text-sm">Load</button>
              <button type="button" onClick={deletePreset} className="px-3 h-10 rounded-md border border-black/10 dark:border-white/15 text-sm">Delete</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dots type</label>
            <select
              value={dotType}
              onChange={(e) => setDotType(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"
            >
              {DOT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {!dotGradEnabled && (
            <div>
              <label className="block text-sm font-medium mb-1">Dots color</label>
              <input
                type="color"
                value={dotColor}
                onChange={(e) => setDotColor(e.target.value)}
                className="h-10 w-full cursor-pointer"
              />
            </div>
          )}
          {dotGradEnabled && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Dots gradient</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="color" value={dotGradStart} onChange={(e) => setDotGradStart(e.target.value)} />
                {dotGradStops === 3 ? (
                  <input type="color" value={dotGradMid} onChange={(e) => setDotGradMid(e.target.value)} />
                ) : (
                  <div />
                )}
                <input type="color" value={dotGradEnd} onChange={(e) => setDotGradEnd(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={dotGradType} onChange={(e) => setDotGradType(e.target.value)} className="rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2">
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
                <div>
                  <label className="block text-xs mb-1">Rotation (radians)</label>
                  <input type="number" step={0.1} value={dotGradRotation} onChange={(e) => setDotGradRotation(parseFloat(e.target.value) || 0)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-1" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={dotGradStops === 2} onChange={() => setDotGradStops(2)} /> 2 stops
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={dotGradStops === 3} onChange={() => setDotGradStops(3)} /> 3 stops
                </label>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Background</label>
            {!bgGradEnabled && (
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-full cursor-pointer"
                disabled={bgTransparent}
              />
            )}
            {bgGradEnabled && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input type="color" value={bgGradStart} onChange={(e) => setBgGradStart(e.target.value)} disabled={bgTransparent} />
                  {bgGradStops === 3 ? (
                    <input type="color" value={bgGradMid} onChange={(e) => setBgGradMid(e.target.value)} disabled={bgTransparent} />
                  ) : (
                    <div />
                  )}
                  <input type="color" value={bgGradEnd} onChange={(e) => setBgGradEnd(e.target.value)} disabled={bgTransparent} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={bgGradType} onChange={(e) => setBgGradType(e.target.value)} className="rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2" disabled={bgTransparent}>
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                  <div>
                    <label className="block text-xs mb-1">Rotation (radians)</label>
                    <input type="number" step={0.1} value={bgGradRotation} onChange={(e) => setBgGradRotation(parseFloat(e.target.value) || 0)} className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-1" disabled={bgTransparent} />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={bgGradStops === 2} onChange={() => setBgGradStops(2)} disabled={bgTransparent} /> 2 stops
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={bgGradStops === 3} onChange={() => setBgGradStops(3)} disabled={bgTransparent} /> 3 stops
                  </label>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 mt-2">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={bgTransparent} onChange={(e) => setBgTransparent(e.target.checked)} />
                Transparent
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={dotGradEnabled} onChange={(e) => setDotGradEnabled(e.target.checked)} />
                Dots gradient
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={bgGradEnabled} onChange={(e) => setBgGradEnabled(e.target.checked)} disabled={bgTransparent} />
                Background gradient
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Corner square</label>
            <select
              value={cornerSquareType}
              onChange={(e) => setCornerSquareType(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"
            >
              {CORNER_SQUARE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Corner square color</label>
            <input
              type="color"
              value={cornerSquareColor}
              onChange={(e) => setCornerSquareColor(e.target.value)}
              className="h-10 w-full cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Corner dot</label>
            <select
              value={cornerDotType}
              onChange={(e) => setCornerDotType(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"
            >
              {CORNER_DOT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Corner dot color</label>
            <input
              type="color"
              value={cornerDotColor}
              onChange={(e) => setCornerDotColor(e.target.value)}
              className="h-10 w-full cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Logo (optional)</label>
          <input type="file" accept="image/*" onChange={onUpload} />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          {imageUrl && (
            <div className="flex items-center gap-3 mt-2 text-xs text-black/60 dark:text-white/60">
              <img src={imageUrl} alt="logo" className="h-8 w-8 object-contain rounded" />
              <button
                type="button"
                className="px-2 py-1 rounded border border-black/10 dark:border-white/15"
                onClick={() => setImageUrl("")}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => download("png")}
            className="rounded-md bg-foreground text-background px-4 py-2 text-sm"
          >
            Download PNG
          </button>
          <button
            type="button"
            onClick={() => download("svg")}
            className="rounded-md border border-black/10 dark:border-white/15 px-4 py-2 text-sm"
          >
            Download SVG
          </button>
          <button
            type="button"
            onClick={downloadPDF}
            className="rounded-md border border-black/10 dark:border-white/15 px-4 py-2 text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div
          className="rounded-lg border border-black/10 dark:border-white/15 p-4 bg-white dark:bg-black"
          style={{ width: size + 24, height: size + 24 }}
        >
          <div ref={ref} className="flex items-center justify-center" />
        </div>
      </div>
    </div>
  );
}
