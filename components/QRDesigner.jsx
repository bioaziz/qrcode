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
import { cn } from "@/lib/utils";
import ContentTab from "@/components/qr/ContentTab";
import BorderTab from "@/components/qr/BorderTab";
import {renderOverlay} from "@/lib/customRenderer";
import { useTranslation } from "next-i18next";
import DotTypeIcon from "@/components/qr/DotTypeIcon";
import { ColorPicker } from "@/components/ui/color-picker";

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
];

const CORNER_SQUARE_TYPES = ["square", "extra-rounded"]; // removed 'circle'
const CORNER_DOT_TYPES = ["square", "dot"]; // library accepts these

// Maximum QR code preview size in pixels. Keep in sync with the non-React version
// (script.js) where the QR size is clamped to this value.
const MAX_PREVIEW = 1024;

export default function QRDesigner({embedded = false, initialSnapshot = null, onSnapshotChange = null}) {
    const ref = useRef(null);
    const qrRef = useRef(null);
    const { t } = useTranslation("common");

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
    // Circular border state
    const [circularBorder, setCircularBorder] = useState(false);
    const [borderText, setBorderText] = useState("Scan me");
    const [borderTextColor, setBorderTextColor] = useState("#333333");
    const [borderFont, setBorderFont] = useState("Arial");
    const [borderFontSize, setBorderFontSize] = useState(14);
    const [borderLogo, setBorderLogo] = useState("");
    const [borderLogoSize, setBorderLogoSize] = useState(24);
    const [borderLogoAngle, setBorderLogoAngle] = useState(0);
    const [patternColor, setPatternColor] = useState("#f0f0f0");
    const [ringBackgroundColor, setRingBackgroundColor] = useState("#ffffff");
    const defaultBorderWidth = Math.round(size / 33);
    const [innerBorderWidth, setInnerBorderWidth] = useState(defaultBorderWidth);
    const [innerBorderColor, setInnerBorderColor] = useState(ringBackgroundColor);
    const [outerBorderWidth, setOuterBorderWidth] = useState(defaultBorderWidth);
    const [outerBorderColor, setOuterBorderColor] = useState(ringBackgroundColor);
    const [innerRadius, setInnerRadius] = useState(0);
    const [outerRadius, setOuterRadius] = useState(0);
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
            margin: quietZone, // ensure library paths honor quiet zone
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
                    : {gradient: null}),
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
                    : {gradient: null}),
            },
            cornersSquareOptions: {
                color: cornerSquareColor,
                type: cornerSquareType,
            },
            cornersDotOptions: {
                color: cornerDotColor,
                type: cornerDotType,
            },
            borderOptions: {
                // Circular border options
                circularBorder,
                borderText,
                borderTextColor,
                borderFont,
                borderFontSize,
                borderLogo,
                borderLogoSize,
                borderLogoAngle,
                patternColor,
                ringBackgroundColor,
                innerRadius,
                outerRadius,
                innerBorderWidth,
                innerBorderColor,
                outerBorderWidth,
                outerBorderColor,
            }}),
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
            // Circular border dependencies
            circularBorder,
            borderText,
            borderTextColor,
            borderFont,
            borderFontSize,
            borderLogo,
            borderLogoSize,
            borderLogoAngle,
            patternColor,
            ringBackgroundColor,
            innerRadius,
            outerRadius,
            innerBorderWidth,
            innerBorderColor,
            outerBorderWidth,
            outerBorderColor,
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
        if (!ref.current || !QRCodeStyling) return;
        ref.current.style.position = 'relative';

        const ensureCanvasSize = () => {
            const canvases = ref.current?.querySelectorAll?.('canvas');
            canvases?.forEach((c) => {
                c.style.width = `${displaySize}px`;
                c.style.height = `${displaySize}px`;
                c.style.position = 'absolute';
                c.style.top = '0';
                c.style.left = '0';
            });
        };

        const libOptions = {
            ...options,
            cornersSquareOptions: {
                ...options.cornersSquareOptions,
                // Pass through type as-is; 'circle' is not used in UI anymore
                type: options.cornersSquareOptions?.type,
            },
        };

        if (!qrRef.current || qrRef.current.kind !== 'styling') {
            ref.current.innerHTML = '';
            const inst = new QRCodeStyling(libOptions);
            inst.append(ref.current);
            qrRef.current = {kind: 'styling', inst, overlay: null};
        } else {
            qrRef.current.inst.update(libOptions);
        }

        ensureCanvasSize();

        if (circularBorder) {
            if (!qrRef.current.overlay) {
                const overlay = document.createElement('canvas');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                ref.current.appendChild(overlay);
                qrRef.current.overlay = overlay;
            }
            setTimeout(() => {
                renderOverlay(qrRef.current.overlay, options);
                ensureCanvasSize();
            }, 0);
        } else if (qrRef.current.overlay) {
            ref.current.removeChild(qrRef.current.overlay);
            qrRef.current.overlay = null;
        }
    }, [options, displaySize, circularBorder, cornerSquareType]);

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

    const onBorderLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        setError("");
        const url = URL.createObjectURL(file);
        setBorderLogo(url);
    };

    const onRemoveBorderLogo = () => {
        if (borderLogo) {
            URL.revokeObjectURL(borderLogo);
            setBorderLogo("");
        }
    };

    const autoSaveDesign = async () => {
        try {
            const snapshot = buildSnapshot();
            const res = await fetch('/api/design', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(snapshot)
            });
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
        if (!circularBorder && ext === 'svg' && qrRef.current.inst?.download) {
            await qrRef.current.inst.download({extension: ext});
            return;
        }
        const canvas = ref.current?.querySelector?.('canvas');
        if (!canvas) return;
        if (ext === 'svg') {
            // Fallback to PNG when SVG requested with circular border overlay
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
        // Circular border properties
        circularBorder,
        borderText,
        borderTextColor,
        borderFont,
        borderFontSize,
        borderLogoSize,
        borderLogoAngle,
        patternColor,
        ringBackgroundColor,
        innerBorderWidth,
        innerBorderColor,
        outerBorderWidth,
        outerBorderColor,
        innerRadius,
        outerRadius,

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
        // sanitize legacy 'circle' to 'extra-rounded' since circle style is removed
        setCornerSquareType(s.cornerSquareType === 'circle' ? 'extra-rounded' : (s.cornerSquareType ?? "square"));
        setCornerSquareColor(s.cornerSquareColor ?? "#111111");
        setCornerDotType(s.cornerDotType ?? "dot");
        setCornerDotColor(s.cornerDotColor ?? "#111111");
        setErrorCorrection(s.errorCorrection ?? "M");
        setQuietZone(s.quietZone ?? 4);
        setImageSize(s.imageSize ?? 0.35);
        setHideLogoBgDots(!!s.hideLogoBgDots);
        // Circular border properties
        setCircularBorder(!!s.circularBorder);
        setBorderText(s.borderText ?? "Scan me");
        setBorderTextColor(s.borderTextColor ?? "#333333");
        setBorderFont(s.borderFont ?? "Arial");
        setBorderFontSize(s.borderFontSize ?? 14);
        setBorderLogoSize(s.borderLogoSize ?? 24);
        setBorderLogoAngle(s.borderLogoAngle ?? 0);
        setPatternColor(s.patternColor ?? "#f0f0f0");
        setRingBackgroundColor(s.ringBackgroundColor ?? "#ffffff");
        setInnerBorderWidth(s.innerBorderWidth ?? Math.round((s.size ?? 256) / 33));
        setInnerBorderColor(s.innerBorderColor ?? (s.ringBackgroundColor ?? "#ffffff"));
        setOuterBorderWidth(s.outerBorderWidth ?? Math.round((s.size ?? 256) / 33));
        setOuterBorderColor(s.outerBorderColor ?? (s.ringBackgroundColor ?? "#ffffff"));
        setInnerRadius(s.innerRadius ?? 0);
        setOuterRadius(s.outerRadius ?? 0);
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
            const name = qrName.trim() || t("designerEditor.untitled");
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
                toast.success(t("designerEditor.messages.qrSaved"));
            } else {
                toast.error(jsQ?.message || t("designerEditor.messages.failedToSave"));
            }
        } catch (e) {
            toast.error(t("designerEditor.messages.failedToSave"));
        } finally {
            setSavingDb(false);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">{t("designerEditor.customizeTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs defaultValue="content">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="content" className="flex items-center gap-2">
                                <QrCode className="size-4"/>
                                <span className="hidden sm:inline">{t("designerEditor.tabs.content")}</span>
                            </TabsTrigger>
                            <TabsTrigger value="style" className="flex items-center gap-2">
                                <Palette className="size-4"/>
                                <span className="hidden sm:inline">{t("designerEditor.tabs.style")}</span>
                            </TabsTrigger>
                            <TabsTrigger value="corners" className="flex items-center gap-2">
                                <Shapes className="size-4"/>
                                <span className="hidden sm:inline">{t("designerEditor.tabs.corners")}</span>
                            </TabsTrigger>
                            <TabsTrigger value="border" className="flex items-center gap-2">
                                <SquareIcon className="size-4"/>
                                <span className="hidden sm:inline">{t("designerEditor.tabs.border")}</span>
                            </TabsTrigger>
                            <TabsTrigger value="logo" className="flex items-center gap-2">
                                <ImageIcon className="size-4"/>
                                <span className="hidden sm:inline">{t("designerEditor.tabs.logo")}</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="space-y-4 mt-6">
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
                                    toast.success(t("designerEditor.messages.contentCopied"));
                                }}
                                copyImage={() => {
                                    copyImage();
                                    toast.success(t("designerEditor.messages.imageCopied"));
                                }}
                            />
                        </TabsContent>

                        <TabsContent value="style" className="space-y-6 mt-6">
                            {/* Basic Settings */}
                            <div>
                                <h3 className="text-sm font-medium mb-4 text-muted-foreground">{t("designerEditor.basicSettings")}</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Maximize2 className="size-4"/> {t("designerEditor.styleTab.size")}: {size}px
                                        </Label>
                                        <div className="h-10 flex items-center">
                                            <Slider min={128} max={512} value={[size]}
                                                    onValueChange={(val) => setSize(val?.[0] ?? 256)}
                                                    className="w-full"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Maximize2 className="size-4"/> {t("designerEditor.styleTab.quietZone")}: {quietZone}px
                                        </Label>
                                        <div className="h-10 flex items-center">
                                            <Slider min={0} max={32} value={[quietZone]}
                                                    onValueChange={(val) => setQuietZone(val?.[0] ?? 4)}
                                                    className="w-full"/>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Shield className="size-4"/> {t("designerEditor.styleTab.errorCorrection")}
                                        </Label>
                                        <RadioGroup value={errorCorrection} onValueChange={setErrorCorrection} className="grid grid-cols-4 gap-2">
                                            {[
                                                { v: "L", label: t("designerEditor.styleTab.errorLow") },
                                                { v: "M", label: t("designerEditor.styleTab.errorMedium") },
                                                { v: "Q", label: t("designerEditor.styleTab.errorQuartile") },
                                                { v: "H", label: t("designerEditor.styleTab.errorHigh") },
                                            ].map(({ v }) => (
                                                <label key={v} htmlFor={`ec2-${v}`} className={cn(
                                                    "flex items-center justify-center rounded-md border p-2 text-xs cursor-pointer",
                                                    "hover:bg-black/5 transition-colors",
                                                    errorCorrection === v ? "ring-2 ring-black border-black" : "border-black/20"
                                                )}>
                                                    <RadioGroupItem id={`ec2-${v}`} value={v} className="sr-only" />
                                                    <span className="font-medium">{v}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>

                            {/* Appearance */}
                            <div>
                                <h3 className="text-sm font-medium mb-4 text-muted-foreground">{t("designerEditor.appearance")}</h3>

                                {/* Toggle Controls */}
                                <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Switch id="bg-transparent" checked={bgTransparent}
                                                onCheckedChange={setBgTransparent}/>
                                        <Label htmlFor="bg-transparent" className="text-sm">{t("designerEditor.styleTab.transparentBg")}</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch id="dots-gradient" checked={dotGradEnabled}
                                                onCheckedChange={setDotGradEnabled}/>
                                        <Label htmlFor="dots-gradient" className="text-sm">{t("designerEditor.styleTab.dotsGradientToggle")}</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch id="bg-gradient" checked={bgGradEnabled}
                                                onCheckedChange={setBgGradEnabled} disabled={bgTransparent}/>
                                        <Label htmlFor="bg-gradient" className="text-sm">{t("designerEditor.styleTab.backgroundGradientToggle")}</Label>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Dots Configuration */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium">{t("designerEditor.styleTab.dotsHeading")}</h4>
                                        <div>
                                            <Label className="block mb-2 flex items-center gap-2">
                                                <Shapes className="size-4"/> {t("designerEditor.styleTab.dotsType")}
                                            </Label>
                                            <RadioGroup value={dotType} onValueChange={setDotType} className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {DOT_TYPES.map((type) => (
                                                    <label key={type} htmlFor={`dot2-${type}`} className={cn(
                                                        "flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer",
                                                        "hover:bg-black/5 transition-colors",
                                                        dotType === type ? "ring-2 ring-black border-black" : "border-black/20"
                                                    )}>
                                                        <RadioGroupItem id={`dot2-${type}`} value={type} className="sr-only" />
                                                        <DotTypeIcon type={type} />
                                                        <span className="truncate">{type}</span>
                                                    </label>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        {!dotGradEnabled ? (
                                            <div>
                                            <Label className="block mb-2 flex items-center gap-2">
                                                <Palette className="size-4"/> {t("designerEditor.styleTab.dotsColor")}
                                            </Label>
                                            <ColorPicker value={dotColor} onChange={setDotColor} />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Label className="block flex items-center gap-2">
                                                    <Palette className="size-4"/> {t("designerEditor.styleTab.dotsGradient")}
                                                </Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <ColorPicker value={dotGradStart} onChange={setDotGradStart} />
                                                    {dotGradStops === 3 && (
                                                        <ColorPicker value={dotGradMid} onChange={setDotGradMid} />
                                                    )}
                                                    <ColorPicker value={dotGradEnd} onChange={setDotGradEnd} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Select value={dotGradType} onValueChange={setDotGradType}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("designerEditor.styleTab.typePlaceholder")}/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="linear">{t("designerEditor.styleTab.linear")}</SelectItem>
                                                            <SelectItem value="radial">{t("designerEditor.styleTab.radial")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div>
                                                        <Input type="number" step={0.1} value={dotGradRotation}
                                                               onChange={(e) => setDotGradRotation(parseFloat(e.target.value) || 0)}
                                                               placeholder={t("designerEditor.styleTab.rotation")}/>
                                                    </div>
                                                </div>
                                                <RadioGroup className="flex items-center gap-4"
                                                            value={String(dotGradStops)}
                                                            onValueChange={(v) => setDotGradStops(parseInt(v, 10))}>
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem id="dotstops-2" value="2"/>
                    <Label htmlFor="dotstops-2" className="text-sm">{t("designerEditor.styleTab.stops2")}</Label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem id="dotstops-3" value="3"/>
                    <Label htmlFor="dotstops-3" className="text-sm">{t("designerEditor.styleTab.stops3")}</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}
                                    </div>

                                    {/* Background Configuration */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-medium">{t("designerEditor.styleTab.background")}</h4>
                                        {!bgGradEnabled ? (
                                            <div>
                                            <Label className="block mb-2 flex items-center gap-2">
                                                <Palette className="size-4"/> {t("designerEditor.styleTab.backgroundColor")}
                                            </Label>
                                            <ColorPicker value={bgColor} onChange={setBgColor} disabled={bgTransparent} />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Label className="block flex items-center gap-2">
                                                    <Palette className="size-4"/> {t("designerEditor.styleTab.backgroundGradientToggle")}
                                                </Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <ColorPicker value={bgGradStart} onChange={setBgGradStart} disabled={bgTransparent} />
                                                    {bgGradStops === 3 && (
                                                        <ColorPicker value={bgGradMid} onChange={setBgGradMid} disabled={bgTransparent} />
                                                    )}
                                                    <ColorPicker value={bgGradEnd} onChange={setBgGradEnd} disabled={bgTransparent} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Select value={bgGradType} onValueChange={setBgGradType}
                                                            disabled={bgTransparent}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={t("designerEditor.styleTab.typePlaceholder")}/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="linear">{t("designerEditor.styleTab.linear")}</SelectItem>
                                                            <SelectItem value="radial">{t("designerEditor.styleTab.radial")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div>
                                                        <Input type="number" step={0.1} value={bgGradRotation}
                                                               onChange={(e) => setBgGradRotation(parseFloat(e.target.value) || 0)}
                                                               disabled={bgTransparent}
                                                               placeholder={t("designerEditor.styleTab.rotation")}/>
                                                    </div>
                                                </div>
                                                <RadioGroup className="flex items-center gap-4"
                                                            value={String(bgGradStops)}
                                                            onValueChange={(v) => setBgGradStops(parseInt(v, 10))}
                                                            disabled={bgTransparent}>
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem id="bgstops-2" value="2"/>
                    <Label htmlFor="bgstops-2" className="text-sm">{t("designerEditor.styleTab.stops2")}</Label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem id="bgstops-3" value="3"/>
                    <Label htmlFor="bgstops-3" className="text-sm">{t("designerEditor.styleTab.stops3")}</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}
                                    </div>
                                </div>
                              </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="corners" className="space-y-6 mt-6">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Corner Customization</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Corner Square */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium">Corner Square</h4>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <SquareIcon className="size-4"/> Style
                                        </Label>
                                        <RadioGroup value={cornerSquareType} onValueChange={setCornerSquareType} className="grid grid-cols-2 gap-2">
                                            {CORNER_SQUARE_TYPES.map((t) => (
                                                <label key={t} htmlFor={`cs2-${t}`} className={cn(
                                                    "flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer",
                                                    "hover:bg-black/5 transition-colors",
                                                    cornerSquareType === t ? "ring-2 ring-black border-black" : "border-black/20"
                                                )}>
                                                    <RadioGroupItem id={`cs2-${t}`} value={t} className="sr-only" />
                                                    <SquareIcon className="size-4" />
                                                    <span className="truncate">{t}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    {cornerSquareType === 'circle-ring' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="block mb-1">Ring thickness</Label>
                                                <Slider min={0.3} max={1.2} step={0.05} value={[ringWidthUnits]}
                                                        onValueChange={(v) => setRingWidthUnits(v?.[0] ?? 0.6)}/>
                                                <div
                                                    className="text-xs text-muted-foreground mt-1">{ringWidthUnits.toFixed(2)} modules
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="block mb-1">Inner mark size</Label>
                                                <Slider min={0.8} max={1.8} step={0.05} value={[innerDotUnits]}
                                                        onValueChange={(v) => setInnerDotUnits(v?.[0] ?? 1.2)}/>
                                                <div
                                                    className="text-xs text-muted-foreground mt-1">{innerDotUnits.toFixed(2)} modules
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Palette className="size-4"/> Color
                                        </Label>
                                        <ColorPicker value={cornerSquareColor} onChange={setCornerSquareColor} />
                                    </div>
                                </div>

                                {/* Corner Dot */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium">Corner Dot</h4>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Circle className="size-4"/> Style
                                        </Label>
                                        <RadioGroup value={cornerDotType} onValueChange={setCornerDotType} className="grid grid-cols-2 gap-2">
                                            {CORNER_DOT_TYPES.map((t) => (
                                                <label key={t} htmlFor={`cd2-${t}`} className={cn(
                                                    "flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer",
                                                    "hover:bg-black/5 transition-colors",
                                                    cornerDotType === t ? "ring-2 ring-black border-black" : "border-black/20"
                                                )}>
                                                    <RadioGroupItem id={`cd2-${t}`} value={t} className="sr-only" />
                                                    <Circle className="size-4" />
                                                    <span className="truncate">{t}</span>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Palette className="size-4"/> Color
                                        </Label>
                                        <ColorPicker value={cornerDotColor} onChange={setCornerDotColor} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="border" className="space-y-6 mt-6">
                            <BorderTab
                                circularBorder={circularBorder} setCircularBorder={setCircularBorder}
                                borderText={borderText} setBorderText={setBorderText}
                                borderTextColor={borderTextColor} setBorderTextColor={setBorderTextColor}
                                borderFont={borderFont} setBorderFont={setBorderFont}
                                borderFontSize={borderFontSize} setBorderFontSize={setBorderFontSize}
                                borderLogo={borderLogo} setBorderLogo={setBorderLogo}
                                borderLogoSize={borderLogoSize} setBorderLogoSize={setBorderLogoSize}
        borderLogoAngle={borderLogoAngle} setBorderLogoAngle={setBorderLogoAngle}
        patternColor={patternColor} setPatternColor={setPatternColor}
        ringBackgroundColor={ringBackgroundColor} setRingBackgroundColor={setRingBackgroundColor}
        innerBorderWidth={innerBorderWidth} setInnerBorderWidth={setInnerBorderWidth}
        innerBorderColor={innerBorderColor} setInnerBorderColor={setInnerBorderColor}
        outerBorderWidth={outerBorderWidth} setOuterBorderWidth={setOuterBorderWidth}
        outerBorderColor={outerBorderColor} setOuterBorderColor={setOuterBorderColor}
        innerRadius={innerRadius} setInnerRadius={setInnerRadius}
        outerRadius={outerRadius} setOuterRadius={setOuterRadius}
        onBorderLogoUpload={onBorderLogoUpload}
        onRemoveBorderLogo={onRemoveBorderLogo}
    />
</TabsContent>


                        <TabsContent value="logo" className="space-y-6 mt-6">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Logo Settings</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Logo Upload */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <ImageIcon className="size-4"/> Upload Logo
                                        </Label>
                                        <Input type="file" accept="image/*" onChange={onUpload}/>
                                        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                                        {imageUrl && (
                                            <div className="flex items-center gap-3 mt-3 p-3 bg-muted/30 rounded-lg">
                                                <img src={imageUrl} alt="logo"
                                                     className="h-12 w-12 object-contain rounded"/>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Logo uploaded</p>
                                                    <p className="text-xs text-muted-foreground">Ready to use</p>
                                                </div>
                                                <Button type="button" variant="outline" size="sm"
                                                        onClick={() => setImageUrl("")}>Remove</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Logo Configuration */}
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block mb-2">Logo size</Label>
                                        <Slider min={0.15} max={0.45} step={0.01} value={[imageSize]}
                                                onValueChange={(val) => setImageSize(val?.[0] ?? 0.35)}/>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Current: {Math.round(imageSize * 100)}% of QR code
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                                        <div>
                                            <Label className="font-medium text-sm">Hide dots behind logo</Label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Turn off for transparent PNGs to let QR dots show through.
                                            </p>
                                        </div>
                                        <Switch checked={hideLogoBgDots} onCheckedChange={setHideLogoBgDots}/>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* QR Code Preview */}
            <Card className="flex items-center justify-center">
                <CardContent
                    className="flex items-center justify-center p-4"
                    style={{width: displaySize + 24, height: MAX_PREVIEW + 24}}
                >
                    <div
                        ref={ref}
                        className="flex items-center justify-center"
                        style={{width: displaySize, height: displaySize}}
                    />
                </CardContent>
            </Card>
            {!embedded && (
                <Card className='lg:col-span-2'>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <List className="size-4"/> {t("designerEditor.tabs.presets")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Local Presets Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.presetsTab.localTitle")}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Save Local Preset */}
                                <div className="space-y-3">
                                    <Label className="text-sm">{t("designerEditor.presetsTab.savePresetNameLabel")}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={presetName}
                                            onChange={(e) => setPresetName(e.target.value)}
                                            placeholder={t("designerEditor.presetsTab.presetNamePlaceholder")}
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="outline" onClick={savePreset}>
                                            {t("designerEditor.presetsTab.savePresetButton")}
                                        </Button>
                                    </div>
                                </div>

                                {/* Load/Manage Local Presets */}
                                <div className="space-y-3">
                                    <Label className="text-sm">{t("designerEditor.presetsTab.manageLabel")}</Label>
                                    <div className="flex gap-2">
                                        <Select value={selectedPresetId} onValueChange={setSelectedPresetId}
                                                className="flex-1">
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("designerEditor.presetsTab.selectPresetPlaceholder")}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {savedPresets.length === 0 && (
                                                    <SelectItem value="none" disabled>{t("designerEditor.presetsTab.noPresets")}</SelectItem>
                                                )}
                                                {savedPresets.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="outline" onClick={loadPreset}
                                                disabled={!selectedPresetId}>
                                            {t("designerEditor.presetsTab.loadButton")}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={deletePreset}
                                                disabled={!selectedPresetId}>
                                            {t("designerEditor.presetsTab.deleteButton")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t"></div>

                        {/* Cloud Presets Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.presetsTab.cloudTitle")}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Save to Cloud */}
                                <div className="space-y-3">
                                    <Label className="text-sm">{t("designerEditor.quickSave.cloudSaveLabel")}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={presetName}
                                            onChange={(e) => setPresetName(e.target.value)}
                                            placeholder={t("designerEditor.presetsTab.presetNamePlaceholder")}
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
                                                    body: JSON.stringify({name: presetName || t('designerEditor.untitled'), snapshot})
                                                });
                                                if (res.ok) toast.success(t("designerEditor.messages.presetSaved"));
                                                else toast.error(t("designerEditor.messages.failedToSave"));
                                            }}
                                        >
                                            {t("designerEditor.quickSave.saveToCloud")}
                                        </Button>
                                    </div>
                                </div>

                                {/* Load/Manage Cloud Presets */}
                                <div className="space-y-3">
                                    <Label className="text-sm">{t("designerEditor.quickSave.cloudLoadLabel")}</Label>
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
                                            <option value="">{t("designerEditor.quickSave.selectCloudPreset")}</option>
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
                                            {t("designerEditor.presetsTab.deleteButton")}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={refreshCloudPresets}>
                                            {t("designerEditor.quickSave.refresh")}
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
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">{t("designerEditor.saveAndExport")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Save QR to Library Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.saveToLibrary")}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                                <div className="lg:col-span-2">
                                    <Label className="mb-2 block text-sm">{t("designerEditor.qrName")}</Label>
                                    <Input
                                        value={qrName}
                                        onChange={(e) => setQrName(e.target.value)}
                                        placeholder={t("designerEditor.qrNamePlaceholder")}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button onClick={saveQrToDb} disabled={savingDb} className="w-full">
                                        {savingDb ? t("designerEditor.saving") : t("designerEditor.saveQr")}
                                    </Button>
                                    {savedQr?.slug && (
                                        <a className="text-sm text-center underline text-muted-foreground hover:text-foreground transition-colors"
                                           href="/qrs">
                                            {t("designerEditor.viewInMyQrs")}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t"></div>

                        {/* Download Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.downloadOptions")}</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        download('png');
                                        toast.success(t("designerEditor.messages.downloadStarted", { format: 'PNG' }));
                                    }}
                                >
                                    {t("designerEditor.logoTab.downloadPng")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        download('svg');
                                        toast.success(t("designerEditor.messages.downloadStarted", { format: 'SVG' }));
                                    }}
                                >
                                    {t("designerEditor.logoTab.downloadSvg")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        downloadPDF();
                                        toast.success(t("designerEditor.messages.downloadStarted", { format: 'PDF' }));
                                    }}
                                >
                                    {t("designerEditor.logoTab.downloadPdf")}
                                </Button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t"></div>

                        {/* Quick Save Preset Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">{t("designerEditor.quickSave.title")}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Save to Cloud */}
                                <div className="space-y-3">
                                    <Label className="text-sm">{t("designerEditor.quickSave.cloudSaveLabel")}</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={presetName}
                                            onChange={(e) => setPresetName(e.target.value)}
                                            placeholder={t("designerEditor.presetsTab.presetNamePlaceholder")}
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
                                                    body: JSON.stringify({name: presetName || t('designerEditor.untitled'), snapshot})
                                                });
                                                if (res.ok) toast.success(t("designerEditor.messages.presetSaved"));
                                                else toast.error(t("designerEditor.messages.failedToSave"));
                                            }}
                                        >
                                            {t("designerEditor.quickSave.saveToCloud")}
                                        </Button>
                                    </div>
                                </div>

                                {/* Load from Cloud */}
                                <div className="space-y-3">
                                    <Label className="text-sm">{t("designerEditor.quickSave.cloudLoadLabel")}</Label>
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
                                            <option value="">{t("designerEditor.quickSave.selectCloudPreset")}</option>
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
                                            {t("designerEditor.presetsTab.deleteButton")}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={refreshCloudPresets}>
                                            {t("designerEditor.quickSave.refresh")}
                                        </Button>
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
