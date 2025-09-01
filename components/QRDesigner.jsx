"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {
    Palette,
    Shapes,
    Square as SquareIcon,
    Circle,
    Image as ImageIcon,
    List,
    Link as LinkIcon,
    Phone as PhoneIcon,
    Mail,
    Wifi as WifiIcon,
    Save,
    QrCode,
    Maximize2,
    Shield,
} from "lucide-react";
import ContentTab from "@/components/qr/ContentTab";
import { renderCustomQR } from "@/lib/customRenderer";

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

const CORNER_SQUARE_TYPES = ["square", "extra-rounded", "circle"];
const CORNER_DOT_TYPES = ["square", "dot"]; // library accepts these

export default function QRDesigner({embedded = false, initialSnapshot = null, onSnapshotChange = null}) {
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
    const [hideLogoBgDots, setHideLogoBgDots] = useState(false); // let transparent logos show QR dots
    const [error, setError] = useState("");
    // Save to DB
    const [qrName, setQrName] = useState("");
    const [savingDb, setSavingDb] = useState(false);
    const [savedQr, setSavedQr] = useState(null);

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
                ...(bgGradEnabled && !bgTransparent
                    ? {
                        gradient: {
                            type: bgGradType,
                            rotation: bgGradRotation,
                            colorStops:
                                bgGradStops === 3
                                    ? [
                                        {offset: 0, color: bgGradStart},
                                        {offset: 0.5, color: bgGradMid},
                                        {offset: 1, color: bgGradEnd},
                                    ]
                                    : [
                                        {offset: 0, color: bgGradStart},
                                        {offset: 1, color: bgGradEnd},
                                    ],
                        },
                    }
                    : { gradient: null }),
            },
            image: imageUrl || undefined,
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize,
                hideBackgroundDots: hideLogoBgDots,
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
                                        {offset: 0, color: dotGradStart},
                                        {offset: 0.5, color: dotGradMid},
                                        {offset: 1, color: dotGradEnd},
                                    ]
                                    : [
                                        {offset: 0, color: dotGradStart},
                                        {offset: 1, color: dotGradEnd},
                                    ],
                        },
                    }
                    : { gradient: null }),
            },
            cornersSquareOptions: {
                color: cornerSquareColor,
                // Map custom-only types to closest library type for non-custom path
                type: (cornerSquareType === 'circle') ? 'extra-rounded' : cornerSquareType,
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
            hideLogoBgDots,
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

    // Responsive preview sizing
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );
    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    const displaySize = useMemo(() => {
        const gutter = 72; // approximate page padding
        const maxForMobile = Math.max(160, viewportWidth - gutter);
        const isSmall = viewportWidth < 640; // sm breakpoint
        return Math.round(isSmall ? Math.min(size, maxForMobile) : size);
    }, [viewportWidth, size]);

    // Live validation message
    const validation = useMemo(() => {
        const value = presetData();
        if (!value) return {ok: false, msg: "Enter content to generate a QR."};
        if (mode === "link") {
            if (!/^https?:\/\//i.test(value)) return {ok: true, msg: "No scheme found, using https automatically."};
        }
        if (mode === "email") {
            if (!/^mailto:/i.test(value)) return {ok: false, msg: "Invalid email format."};
        }
        if (mode === "phone") {
            if (!/^tel:/i.test(value)) return {ok: false, msg: "Phone should start with tel:."};
        }
        if (mode === "wifi") {
            if (!/^WIFI:/i.test(value)) return {ok: false, msg: "Wi‑Fi string malformed."};
        }
        return {ok: true, msg: "Ready."};
    }, [mode, linkUrl, phone, email, emailSubject, emailBody, wifiSsid, wifiPass, wifiHidden, wifiType, data, firstName, lastName, contactPhone, contactEmail, org, url, note, street, city, state, zip, country]);

    useEffect(() => {
        if (!ref.current) return;
        const wantCustom = cornerSquareType === 'circle' ;
        const ensureCanvasSize = () => {
            const canvas = ref.current?.querySelector?.("canvas");
            if (canvas) {
                canvas.style.width = `${displaySize}px`;
                canvas.style.height = `${displaySize}px`;
            }
        };
        if (wantCustom) {
            // Switch to custom renderer when circle eyes are requested
            if (!qrRef.current || qrRef.current.kind !== 'custom') {
                // Clear previous renderer DOM
                ref.current.innerHTML = '';
                const canvas = document.createElement('canvas');
                ref.current.appendChild(canvas);
                qrRef.current = { kind: 'custom', canvas };
            }
            const canvas = qrRef.current.canvas;
            renderCustomQR(canvas, options);
            ensureCanvasSize();
            return;
        }
        // Default to qr-code-styling
        if (!QRCodeStyling) return;
        if (!qrRef.current || qrRef.current.kind !== 'styling') {
            // Clear previous renderer DOM
            ref.current.innerHTML = '';
            const inst = new QRCodeStyling(options);
            inst.append(ref.current);
            qrRef.current = { kind: 'styling', inst };
        } else {
            qrRef.current.inst.update(options);
        }
        ensureCanvasSize();
    }, [options, displaySize, cornerSquareType]);

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

    const autoSaveDesign = async () => {
        try {
            const snapshot = buildSnapshot();
            const res = await fetch('/api/design', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot) });
            if (res.status === 401) {
                toast.message('Sign in to save designs');
            } else if (res.ok) {
                // optional: silent success
            }
        } catch (_) {
            // ignore errors; do not block download
        }
    };

    const download = async (ext) => {
        if (!qrRef.current) return;
        // Save design snapshot automatically
        await autoSaveDesign();
        if (qrRef.current.kind === 'styling' && qrRef.current.inst?.download) {
            await qrRef.current.inst.download({ extension: ext });
            return;
        }
        // Custom renderer path: only PNG supported directly
        const canvas = ref.current?.querySelector?.('canvas');
        if (!canvas) return;
        if (ext === 'svg') {
            // Fallback to PNG when SVG requested in custom mode
            ext = 'png';
        }
        const blob = await new Promise((res) => canvas.toBlob(res));
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
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
                const item = new ClipboardItem({"image/png": blob});
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
        await autoSaveDesign();
        try {
            const blob = await getPngBlob();
            const url = URL.createObjectURL(blob);
            const img = new Image();
            await new Promise((res, rej) => {
                img.onload = res;
                img.onerror = rej;
                img.src = url;
            });
            const {jsPDF} = await import("jspdf");
            const pdf = new jsPDF({orientation: "p", unit: "pt", format: [size, size]});
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
        hideLogoBgDots,
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
        setHideLogoBgDots(!!s.hideLogoBgDots);
    };

    const savePreset = () => {
        const snapshot = buildSnapshot();
        const id = Date.now().toString(36);
        const list = [...savedPresets, {id, ...snapshot}];
        persistPresets(list);
        setPresetName("");
    };

    const [selectedPresetId, setSelectedPresetId] = useState("");
    // Cloud presets
    const [cloudPresets, setCloudPresets] = useState([]);
    const [cloudSelectedId, setCloudSelectedId] = useState("");
    const refreshCloudPresets = async () => {
        try {
            const r = await fetch('/api/presets');
            const js = await r.json();
            if (js?.success) setCloudPresets(js.items || []);
        } catch (_) {
        }
    };
    useEffect(() => {
        refreshCloudPresets();
    }, []);
    const loadPreset = () => {
        const p = savedPresets.find((x) => x.id === selectedPresetId);
        if (p) applySnapshot(p);
    };
    const deletePreset = () => {
        const list = savedPresets.filter((x) => x.id !== selectedPresetId);
        persistPresets(list);
        setSelectedPresetId("");
    };

    const saveQrToDb = async () => {
        try {
            setSavingDb(true);
            setSavedQr(null);
            const name = qrName.trim() || "Untitled";
            const designBody = buildSnapshot();
            let designRef = null;
            try {
                const resD = await fetch("/api/design", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(designBody),
                });
                const jsD = await resD.json();
                if (jsD?.success) designRef = jsD.item?._id || null;
            } catch (_) {
            }
            const payload = presetData();
            const body = {
                type: "static",
                staticPayload: payload,
                meta: {name},
                ...(designRef ? {designRef} : {}),
            };
            const resQ = await fetch("/api/qr", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            const jsQ = await resQ.json();
            if (jsQ?.success) {
                setSavedQr(jsQ.item);
                toast.success("QR saved");
            } else {
                toast.error(jsQ?.message || "Failed to save");
            }
        } catch (e) {
            toast.error("Failed to save");
        } finally {
            setSavingDb(false);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customize</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs defaultValue="content">
                        <TabsList>
                            <TabsTrigger value="content" className="flex items-center gap-2">
                                <QrCode className="size-4"/>
                                Content
                            </TabsTrigger>
                            <TabsTrigger value="style" className="flex items-center gap-2">
                                <Palette className="size-4"/>
                                Style
                            </TabsTrigger>
                            <TabsTrigger value="corners" className="flex items-center gap-2">
                                <Shapes className="size-4"/>
                                Corners
                            </TabsTrigger>
                            <TabsTrigger value="logo" className="flex items-center gap-2">
                                <ImageIcon className="size-4"/>
                                Logo
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4">
                            <ContentTab
                                mode={mode} setMode={setMode}
                                data={data} setData={setData}
                                linkUrl={linkUrl} setLinkUrl={setLinkUrl}
                                phone={phone} setPhone={setPhone}
                                email={email} setEmail={setEmail}
                                emailSubject={emailSubject} setEmailSubject={setEmailSubject}
                                emailBody={emailBody} setEmailBody={setEmailBody}
                                firstName={firstName} setFirstName={setFirstName}
                                lastName={lastName} setLastName={setLastName}
                                contactPhone={contactPhone} setContactPhone={setContactPhone}
                                contactEmail={contactEmail} setContactEmail={setContactEmail}
                                org={org} setOrg={setOrg}
                                url={url} setUrl={setUrl}
                                note={note} setNote={setNote}
                                street={street} setStreet={setStreet}
                                city={city} setCity={setCity}
                                state={state} setState={setState}
                                zip={zip} setZip={setZip}
                                country={country} setCountry={setCountry}
                                wifiSsid={wifiSsid} setWifiSsid={setWifiSsid}
                                wifiType={wifiType} setWifiType={setWifiType}
                                wifiPass={wifiPass} setWifiPass={setWifiPass}
                                wifiHidden={wifiHidden} setWifiHidden={setWifiHidden}
                                validation={validation}
                                copyContent={() => {
                                    copyContent();
                                    toast.success("Content copied");
                                }}
                                copyImage={() => {
                                    copyImage();
                                    toast.success("Image copied");
                                }}
                            />
                        </TabsContent>

                        <TabsContent value="style" className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="block mb-1 flex items-center gap-2"><Maximize2
                                        className="size-4"/> Size: {size}px</Label>
                                    <Slider min={128} max={512} value={[size]}
                                            onValueChange={(val) => setSize(val?.[0] ?? 256)}/>
                                </div>
                                <div>
                                    <Label className="block mb-1 flex items-center gap-2"><Maximize2
                                        className="size-4"/> Quiet zone: {quietZone}px</Label>
                                    <Slider min={0} max={32} value={[quietZone]}
                                            onValueChange={(val) => setQuietZone(val?.[0] ?? 4)}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="block mb-1 flex items-center gap-2"><Shield
                                        className="size-4"/> Error correction</Label>
                                    <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                                        <SelectTrigger className="w-full"><SelectValue
                                            placeholder="Level"/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">L (Lowest)</SelectItem>
                                            <SelectItem value="M">M</SelectItem>
                                            <SelectItem value="Q">Q</SelectItem>
                                            <SelectItem value="H">H (Highest)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="block mb-1 flex items-center gap-2"><Shapes
                                        className="size-4"/> Dots type</Label>
                                    <Select value={dotType} onValueChange={setDotType}>
                                        <SelectTrigger className="w-full"><SelectValue
                                            placeholder="Type"/></SelectTrigger>
                                        <SelectContent>
                                            {DOT_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {!dotGradEnabled && (
                                    <div>
                                        <label
                                            className="block text-sm font-medium mb-1 flex items-center gap-2"><Palette
                                            className="size-4"/> Dots color</label>
                                        <Input type="color" value={dotColor}
                                               onChange={(e) => setDotColor(e.target.value)}
                                               className="h-10 w-full cursor-pointer"/>
                                    </div>
                                )}
                                {dotGradEnabled && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium flex items-center gap-2"><Palette
                                            className="size-4"/> Dots gradient</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input type="color" value={dotGradStart}
                                                   onChange={(e) => setDotGradStart(e.target.value)}/>
                                            {dotGradStops === 3 ? (
                                                <Input type="color" value={dotGradMid}
                                                       onChange={(e) => setDotGradMid(e.target.value)}/>
                                            ) : (
                                                <div/>
                                            )}
                                            <Input type="color" value={dotGradEnd}
                                                   onChange={(e) => setDotGradEnd(e.target.value)}/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Select value={dotGradType} onValueChange={setDotGradType}>
                                                <SelectTrigger className="w-full"><SelectValue
                                                    placeholder="Type"/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="linear">Linear</SelectItem>
                                                    <SelectItem value="radial">Radial</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div>
                                                <Label className="block text-xs mb-1">Rotation (radians)</Label>
                                                <Input type="number" step={0.1} value={dotGradRotation}
                                                       onChange={(e) => setDotGradRotation(parseFloat(e.target.value) || 0)}/>
                                            </div>
                                        </div>
                                        <RadioGroup className="flex items-center gap-3 text-xs"
                                                    value={String(dotGradStops)}
                                                    onValueChange={(v) => setDotGradStops(parseInt(v, 10))}>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem id="dotstops-2" value="2"/>
                                                <Label htmlFor="dotstops-2">2 stops</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem id="dotstops-3" value="3"/>
                                                <Label htmlFor="dotstops-3">3 stops</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Palette
                                        className="size-4"/> Background</label>
                                    {!bgGradEnabled && (
                                        <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                                               className="h-10 w-full cursor-pointer" disabled={bgTransparent}/>
                                    )}
                                    {bgGradEnabled && (
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input type="color" value={bgGradStart}
                                                       onChange={(e) => setBgGradStart(e.target.value)}
                                                       disabled={bgTransparent}/>
                                                {bgGradStops === 3 ? (
                                                    <Input type="color" value={bgGradMid}
                                                           onChange={(e) => setBgGradMid(e.target.value)}
                                                           disabled={bgTransparent}/>
                                                ) : (
                                                    <div/>
                                                )}
                                                <Input type="color" value={bgGradEnd}
                                                       onChange={(e) => setBgGradEnd(e.target.value)}
                                                       disabled={bgTransparent}/>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Select value={bgGradType} onValueChange={setBgGradType}
                                                        disabled={bgTransparent}>
                                                    <SelectTrigger className="w-full"><SelectValue placeholder="Type"/></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="linear">Linear</SelectItem>
                                                        <SelectItem value="radial">Radial</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div>
                                                    <Label className="block text-xs mb-1">Rotation (radians)</Label>
                                                    <Input type="number" step={0.1} value={bgGradRotation}
                                                           onChange={(e) => setBgGradRotation(parseFloat(e.target.value) || 0)}
                                                           disabled={bgTransparent}/>
                                                </div>
                                            </div>
                                            <RadioGroup className="flex items-center gap-3 text-xs"
                                                        value={String(bgGradStops)}
                                                        onValueChange={(v) => setBgGradStops(parseInt(v, 10))}
                                                        disabled={bgTransparent}>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <RadioGroupItem id="bgstops-2" value="2"/>
                                                    <Label htmlFor="bgstops-2">2 stops</Label>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <RadioGroupItem id="bgstops-3" value="3"/>
                                                    <Label htmlFor="bgstops-3">3 stops</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}
                                    <div
                                        className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 mt-2 w-full">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Switch id="bg-transparent" checked={bgTransparent}
                                                    onCheckedChange={setBgTransparent}/>
                                            <Label htmlFor="bg-transparent">Transparent</Label>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Switch id="dots-gradient" checked={dotGradEnabled}
                                                    onCheckedChange={setDotGradEnabled}/>
                                            <Label htmlFor="dots-gradient">Dots gradient</Label>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Switch id="bg-gradient" checked={bgGradEnabled}
                                                    onCheckedChange={setBgGradEnabled} disabled={bgTransparent}/>
                                            <Label htmlFor="bg-gradient">Background gradient</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="corners" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="block mb-1 flex items-center gap-2"><SquareIcon
                                        className="size-4"/> Corner square</Label>
                                    <Select value={cornerSquareType} onValueChange={setCornerSquareType}>
                                        <SelectTrigger className="w-full"><SelectValue
                                            placeholder="Type"/></SelectTrigger>
                                        <SelectContent>
                                            {CORNER_SQUARE_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-1 flex items-center gap-2"><SquareIcon
                                        className="size-4"/> Corner square color</label>
                                    <Input type="color" value={cornerSquareColor}
                                           onChange={(e) => setCornerSquareColor(e.target.value)}
                                           className="h-10 w-full cursor-pointer"/>
                                </div>
                                <div>
                                    <Label className="block mb-1 flex items-center gap-2"><Circle
                                        className="size-4"/> Corner dot</Label>
                                    <Select value={cornerDotType} onValueChange={setCornerDotType}>
                                        <SelectTrigger className="w-full"><SelectValue
                                            placeholder="Type"/></SelectTrigger>
                                        <SelectContent>
                                            {CORNER_DOT_TYPES.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>


                                <div>
                                    <label className="block text-sm font-medium mb-1 flex items-center gap-2"><Circle
                                        className="size-4"/> Corner dot color</label>
                                    <Input type="color" value={cornerDotColor}
                                           onChange={(e) => setCornerDotColor(e.target.value)}
                                           className="h-10 w-full cursor-pointer"/>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="logo" className="space-y-4">
                            <div>
                                <Label className="block mb-1 flex items-center gap-2"><ImageIcon
                                    className="size-4"/> Logo (optional)</Label>
                                <Input type="file" accept="image/*" onChange={onUpload}/>
                                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                                {imageUrl && (
                                    <div
                                        className="flex items-center gap-3 mt-2 text-xs text-black/60 dark:text-white/60">
                                        <img src={imageUrl} alt="logo" className="h-8 w-8 object-contain rounded"/>
                                        <Button type="button" variant="outline" size="sm"
                                                onClick={() => setImageUrl("")}>Remove</Button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label className="block mb-1">Logo size</Label>
                                <Slider min={0.15} max={0.45} step={0.01} value={[imageSize]}
                                        onValueChange={(val) => setImageSize(val?.[0] ?? 0.35)}/>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <Label className="block mb-1">Hide dots behind logo</Label>
                                    <div className="text-xs opacity-70">Turn off for transparent PNGs to let QR dots show through.</div>
                                </div>
                                <Switch checked={hideLogoBgDots} onCheckedChange={setHideLogoBgDots} />
                            </div>
                            
                        </TabsContent>

                    </Tabs>
                </CardContent>
            </Card>
            <Card className="flex items-center justify-center">
                <CardContent
                    className="flex items-center justify-center p-4"
                    style={{width: displaySize + 24, height: displaySize + 24}}
                >
                    <div ref={ref} className="flex items-center justify-center"/>
                </CardContent>
            </Card>
            
            {/*{!embedded && (*/}
            {/*    <Card className='lg:col-span-2'>*/}
            {/*        <CardHeader className="pb-2">*/}
            {/*            <CardTitle className="text-base flex items-center gap-2"><List*/}
            {/*                className="size-4"/> Presets</CardTitle>*/}
            {/*        </CardHeader>*/}
            {/*        <CardContent>*/}
            {/*            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">*/}
            {/*                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">*/}
            {/*                    <div>*/}
            {/*                        <Label className="mb-1 block">Save preset name</Label>*/}
            {/*                        <Input value={presetName} onChange={(e) => setPresetName(e.target.value)}*/}
            {/*                               placeholder="My preset"/>*/}
            {/*                    </div>*/}
            {/*                    <Button type="button" variant="outline" onClick={savePreset}>Save Preset</Button>*/}
            {/*                </div>*/}
            {/*                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">*/}
            {/*                    <div className="md:col-span-2">*/}
            {/*                        <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>*/}
            {/*                            <SelectTrigger className="w-full"><SelectValue*/}
            {/*                                placeholder="Select saved preset"/></SelectTrigger>*/}
            {/*                            <SelectContent>*/}
            {/*                                {savedPresets.length === 0 && (*/}
            {/*                                    <SelectItem value="none" disabled>No saved presets</SelectItem>*/}
            {/*                                )}*/}
            {/*                                {savedPresets.map((p) => (*/}
            {/*                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>*/}
            {/*                                ))}*/}
            {/*                            </SelectContent>*/}
            {/*                        </Select>*/}
            {/*                    </div>*/}
            {/*                    <div className="flex flex-wrap gap-2">*/}
            {/*                        <Button type="button" variant="outline" onClick={loadPreset}>Load</Button>*/}
            {/*                        <Button type="button" variant="outline" onClick={deletePreset}>Delete</Button>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">*/}
            {/*                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">*/}
            {/*                        <div>*/}
            {/*                            <Label className="mb-1 block">Save to cloud (name)</Label>*/}
            {/*                            <Input value={presetName} onChange={(e) => setPresetName(e.target.value)}*/}
            {/*                                   placeholder="Company default"/>*/}
            {/*                        </div>*/}
            {/*                        <Button type="button" variant="outline" onClick={async () => {*/}
            {/*                            const snapshot = buildSnapshot();*/}
            {/*                            const res = await fetch('/api/presets', {*/}
            {/*                                method: 'POST',*/}
            {/*                                headers: {'Content-Type': 'application/json'},*/}
            {/*                                body: JSON.stringify({name: presetName || 'Untitled', snapshot})*/}
            {/*                            });*/}
            {/*                            if (res.ok) toast.success('Preset saved to cloud'); else toast.error('Failed to save');*/}
            {/*                        }}>Save to Cloud</Button>*/}
            {/*                    </div>*/}
            {/*                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">*/}
            {/*                        <div className="md:col-span-2">*/}
            {/*                            <select*/}
            {/*                                className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"*/}
            {/*                                onChange={async (e) => {*/}
            {/*                                    const id = e.target.value;*/}
            {/*                                    if (!id) return;*/}
            {/*                                    const r = await fetch(`/api/presets/${id}`);*/}
            {/*                                    const js = await r.json();*/}
            {/*                                    if (js?.success) applySnapshot(js.item.snapshot);*/}
            {/*                                }}>*/}
            {/*                                <option value="">Load from cloud…</option>*/}
            {/*                                {cloudPresets.map(p => (*/}
            {/*                                    <option key={p._id} value={p._id}>{p.name}</option>))}*/}
            {/*                            </select>*/}
            {/*                        </div>*/}
            {/*                        <div className="flex flex-wrap gap-2">*/}
            {/*                            <Button type="button" variant="outline" onClick={async () => {*/}
            {/*                                if (!cloudSelectedId) return;*/}
            {/*                                await fetch(`/api/presets/${cloudSelectedId}`, {method: "DELETE"});*/}
            {/*                                refreshCloudPresets();*/}
            {/*                                setCloudSelectedId("");*/}
            {/*                            }}>Delete</Button>*/}
            {/*                            <Button type="button" variant="outline"*/}
            {/*                                    onClick={refreshCloudPresets}>Refresh</Button>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </CardContent>*/}
            {/*    </Card>*/}
            {/*)}*/}

            {!embedded && (
    <Card className='lg:col-span-2'>
        <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
                <List className="size-4"/> Presets
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Local Presets Section */}
            <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Local Presets</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Save Local Preset */}
                    <div className="space-y-3">
                        <Label className="text-sm">Save new preset</Label>
                        <div className="flex gap-2">
                            <Input
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                placeholder="Enter preset name"
                                className="flex-1"
                            />
                            <Button type="button" variant="outline" onClick={savePreset}>
                                Save
                            </Button>
                        </div>
                    </div>

                    {/* Load/Manage Local Presets */}
                    <div className="space-y-3">
                        <Label className="text-sm">Manage saved presets</Label>
                        <div className="flex gap-2">
                            <Select value={selectedPresetId} onValueChange={setSelectedPresetId} className="flex-1">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select preset" />
                                </SelectTrigger>
                                <SelectContent>
                                    {savedPresets.length === 0 && (
                                        <SelectItem value="none" disabled>No saved presets</SelectItem>
                                    )}
                                    {savedPresets.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="button" variant="outline" onClick={loadPreset} disabled={!selectedPresetId}>
                                Load
                            </Button>
                            <Button type="button" variant="outline" onClick={deletePreset} disabled={!selectedPresetId}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t"></div>

            {/* Cloud Presets Section */}
            <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Cloud Presets</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Save to Cloud */}
                    <div className="space-y-3">
                        <Label className="text-sm">Save to cloud</Label>
                        <div className="flex gap-2">
                            <Input
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                placeholder="Enter cloud preset name"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    const snapshot = buildSnapshot();
                                    const res = await fetch('/api/presets', {
                                        method: 'POST',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({name: presetName || 'Untitled', snapshot})
                                    });
                                    if (res.ok) toast.success('Preset saved to cloud');
                                    else toast.error('Failed to save');
                                }}
                            >
                                Save to Cloud
                            </Button>
                        </div>
                    </div>

                    {/* Load/Manage Cloud Presets */}
                    <div className="space-y-3">
                        <Label className="text-sm">Manage cloud presets</Label>
                        <div className="flex gap-2">
                            <select
                                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={cloudSelectedId}
                                onChange={async (e) => {
                                    const id = e.target.value;
                                    setCloudSelectedId(id);
                                    if (!id) return;
                                    const r = await fetch(`/api/presets/${id}`);
                                    const js = await r.json();
                                    if (js?.success) applySnapshot(js.item.snapshot);
                                }}
                            >
                                <option value="">Select cloud preset...</option>
                                {cloudPresets.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    if (!cloudSelectedId) return;
                                    await fetch(`/api/presets/${cloudSelectedId}`, {method: "DELETE"});
                                    refreshCloudPresets();
                                    setCloudSelectedId("");
                                }}
                                disabled={!cloudSelectedId}
                            >
                                Delete
                            </Button>
                            <Button type="button" variant="outline" onClick={refreshCloudPresets}>
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
)}
            {!embedded && (
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Save to Library</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label className="mb-1 block">QR name</Label>
                            <Input value={qrName} onChange={(e) => setQrName(e.target.value)} placeholder="My QR"/>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 w-full">
                            <Button onClick={saveQrToDb} disabled={savingDb}>{savingDb ? "Saving…" : "Save QR"}</Button>
                            {savedQr?.slug && (
                                <a className="text-sm underline" href="/qrs">
                                    View in My QR Codes
                                </a>
                            )}

                            <div className="flex flex-wrap gap-3 mt-4">
                                <Button type="button" onClick={() => { download('png'); toast.success('PNG download started'); }}>Download PNG</Button>
                                <Button type="button" variant="outline" onClick={() => { download('svg'); toast.success('SVG download started'); }}>Download SVG</Button>
                                <Button type="button" variant="outline" onClick={() => { downloadPDF(); toast.success('PDF download started'); }}>Download PDF</Button>
                            </div>

                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                                    <div>
                                        <Label className="mb-1 block">Save to cloud (name)</Label>
                                        <Input value={presetName} onChange={(e) => setPresetName(e.target.value)}
                                               placeholder="Company default"/>
                                    </div>
                                    <Button type="button" variant="outline" onClick={async () => {
                                        const snapshot = buildSnapshot();
                                        const res = await fetch('/api/presets', {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json'},
                                            body: JSON.stringify({name: presetName || 'Untitled', snapshot})
                                        });
                                        if (res.ok) toast.success('Preset saved to cloud'); else toast.error('Failed to save');
                                    }}>Save to Cloud</Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                                    <div className="md:col-span-2">
                                        <select
                                            className="w-full rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 py-2"
                                            onChange={async (e) => {
                                                const id = e.target.value;
                                                if (!id) return;
                                                const r = await fetch(`/api/presets/${id}`);
                                                const js = await r.json();
                                                if (js?.success) applySnapshot(js.item.snapshot);
                                            }}>
                                            <option value="">Load from cloud…</option>
                                            {cloudPresets.map(p => (
                                                <option key={p._id} value={p._id}>{p.name}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={async () => {
                                            if (!cloudSelectedId) return;
                                            await fetch(`/api/presets/${cloudSelectedId}`, {method: "DELETE"});
                                            refreshCloudPresets();
                                            setCloudSelectedId("");
                                        }}>Delete</Button>
                                        <Button type="button" variant="outline"
                                                onClick={refreshCloudPresets}>Refresh</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
