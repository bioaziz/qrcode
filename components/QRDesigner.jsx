"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import { useRouter } from "next/router";
import QRCode from 'qrcode';
import {Input} from "@/components/ui/input";
import ColorPicker from "@/components/ui/color-picker";
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
import MobileMockup from "@/components/ui/MobileMockup";
import QRViewer from "@/components/qr/QRViewer";
import EncodesToolbar from "@/components/qr/EncodesToolbar";
import ExportActions from "@/components/qr/ExportActions";
import PresetsManager from "@/components/qr/PresetsManager";
import { buildPdfPreviewUrl as buildPdfPreviewUrlUtil, buildPreviewUrl as buildPreviewUrlUtil } from "@/lib/preview";
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
import BorderTab from "@/components/qr/BorderTab";
import {renderCustomQR} from "@/lib/customRenderer";
import {useTranslation} from "next-i18next";

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

export default function QRDesigner({embedded = false, initialSnapshot = null, onSnapshotChange = null, redirectUrl: redirectUrlProp = null, slug: slugProp = null}) {
    // Viewer implementation moved to QRViewer component
    const {t} = useTranslation("common");
    const router = useRouter?.() || { query: {} };
    // Controls
    const [data, setData] = useState("");
    const [mode, setMode] = useState("freeform"); // freeform | link | phone | email | wifi | mecard | vcard | whatsapp | sms | pdf | image | mp3 | video | app | geo | maps | social
    const [size, setSize] = useState(256);
    const [dotType, setDotType] = useState("square");
    const [dotColor, setDotColor] = useState("#111111");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [bgTransparent, setBgTransparent] = useState(true);
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
    const [patternColor, setPatternColor] = useState("#02070a");
    const [borderDotType, setBorderDotType] = useState("square");
    const [ringBackgroundColor, setRingBackgroundColor] = useState("#ef7d20");
    const defaultBorderWidth = 0;
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
    const [contentSource, setContentSource] = useState('direct');
    const [redirectUrl, setRedirectUrl] = useState(redirectUrlProp || null);
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
    // WhatsApp country dialing
    const [whatsCountry, setWhatsCountry] = useState("US");
    const [whatsDialCode, setWhatsDialCode] = useState("1");
    // SMS country dialing
    const [smsCountry, setSmsCountry] = useState("US");
    const [smsDialCode, setSmsDialCode] = useState("1");
    // PDF landing options (inspired by reference)
    const [pdfTitle, setPdfTitle] = useState("");
    const [pdfDescription, setPdfDescription] = useState("");
    const [pdfCtaText, setPdfCtaText] = useState("View PDF");
    const [pdfOpenTarget, setPdfOpenTarget] = useState("newtab"); // newtab | sametab | download
    const [pdfCompany, setPdfCompany] = useState("");
    const [pdfWebsite, setPdfWebsite] = useState("");
    const [pdfTitleFont, setPdfTitleFont] = useState("System");
    const [pdfDescriptionFont, setPdfDescriptionFont] = useState("System");
    const [pdfCtaTextFont, setPdfCtaTextFont] = useState("System");
    const [pdfTextSize, setPdfTextSize] = useState(14);
    const [pdfTextFontColor, setPdfTextFontColor] = useState("#333333");
    const [pdfSubtitle, setPdfSubtitle] = useState("");
    const [pdfTextFont, setPdfTextFont] = useState("System");
    const [pdfDirect, setPdfDirect] = useState(false);
    const [pdfRequirePassword, setPdfRequirePassword] = useState(false);
    const [pdfPassword, setPdfPassword] = useState("");
    const [pdfStyle, setPdfStyle] = useState("minimal");
    const [pdfAccent, setPdfAccent] = useState("#000000");
    const [pdfAccent2, setPdfAccent2] = useState("");
    const [mediaCover, setMediaCover] = useState("");
    const [mp3SocialLinks, setMp3SocialLinks] = useState([]); // [{platform, url, text}]
    const [videoSocialLinks, setVideoSocialLinks] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [phHash, setPhHash] = useState("");
    // App Links specific
    const [appCtaIos, setAppCtaIos] = useState('App Store');
    const [appCtaAndroid, setAppCtaAndroid] = useState('Google Play');
    const [appCtaWeb, setAppCtaWeb] = useState('Open Website');
    const [appAutoRedirect, setAppAutoRedirect] = useState(true);
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
            case "pdf":
            case "image":
            case "mp3":
            case "video":
            case "maps": {
                if (!linkUrl) return "";
                const hasScheme = /^(https?:)?\/\//i.test(linkUrl);
                return hasScheme ? linkUrl : `https://${linkUrl}`;
            }
            case "instagram": {
                if (!linkUrl) return "";
                const raw = String(linkUrl).trim();
                // If user pasted a full Instagram URL, normalize scheme; otherwise treat as username
                if (/instagram\.com\//i.test(raw)) {
                    const hasScheme = /^(https?:)?\/\//i.test(raw);
                    return hasScheme ? raw : `https://${raw}`;
                }
                const username = raw.replace(/^@+/, "");
                return `https://instagram.com/${username}`;
            }
            case "facebook": {
                if (!linkUrl) return "";
                const raw = String(linkUrl).trim();
                if (/facebook\.com\//i.test(raw)) {
                    const hasScheme = /^(https?:)?\/\//i.test(raw);
                    return hasScheme ? raw : `https://${raw}`;
                }
                const slug = raw.replace(/^@+/, "");
                return `https://facebook.com/${slug}`;
            }
            case "menu":
            case "coupon": {
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
            case "whatsapp": {
                const raw = String(phone || "").trim();
                if (!raw && !whatsDialCode) return "";
                const dial = String(whatsDialCode || "").replace(/\D+/g, "");
                let digits;
                if (/^\+\d+/.test(raw)) {
                    // Full international number entered by user
                    digits = raw.replace(/\D+/g, "");
                } else {
                    const local = raw.replace(/\D+/g, "");
                    digits = `${dial}${local}`;
                }
                digits = digits.replace(/^0+/, "");
                if (!digits) return "";
                const qs = data ? `?text=${encodeURIComponent(data)}` : "";
                return `https://wa.me/${digits}${qs}`;
            }
            case "sms": {
                const raw = String(phone || "").trim();
                if (!raw && !smsDialCode) return "";
                const dial = String(smsDialCode || "").replace(/\D+/g, "");
                let digits;
                if (/^\+\d+/.test(raw)) {
                    digits = raw.replace(/\D+/g, "");
                } else {
                    const local = raw.replace(/\D+/g, "");
                    digits = `${dial}${local}`;
                }
                digits = digits.replace(/^0+/, "");
                if (!digits) return "";
                const qs = data ? `?body=${encodeURIComponent(data)}` : "";
                return `sms:${digits}${qs}`;
            }
            case "wifi": {
                if (!wifiSsid) return "";
                const T = wifiType === "nopass" ? "nopass" : wifiType;
                const P = wifiType === "nopass" ? "" : `P:${wifiPass};`;
                const H = wifiHidden ? "H:true;" : "";
                const esc = (v) => v.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,");
                return `WIFI:T:${T};S:${esc(wifiSsid)};${P}${H};`;
            }
            case "app": {
                // Temporarily encode a single target: prefer web fallback, then iOS, then Android
                const primary = (typeof window !== 'undefined' && router?.query?.device)
                  ? router.query.device === 'ios' ? (url || city || '') : router.query.device === 'android' ? (street || city || '') : (city || url || street || '')
                  : (city || url || street || '');
                if (!primary) return "";
                const hasScheme = /^(https?:)?\/\//i.test(primary);
                return hasScheme ? primary : `https://${primary}`;
            }
            case "geo": {
                const lat = String(state || "").trim();
                const lng = String(zip || "").trim();
                if (!lat || !lng) return "";
                const label = String(country || "").trim();
                const base = `geo:${lat},${lng}`;
                return label ? `${base}?q=${encodeURIComponent(label)}` : base;
            }
            case "social": {
                // Placeholder: treat as simple link for now
                if (!linkUrl) return "";
                const hasScheme = /^(https?:)?\/\//i.test(linkUrl);
                return hasScheme ? linkUrl : `https://${linkUrl}`;
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

    // Data to encode in QR: direct content or redirect URL
    const renderData = useMemo(() => {
        const direct = presetData() || "https://";
        if (contentSource === 'redirect' && (redirectUrlProp || redirectUrl)) {
            return (redirectUrlProp || redirectUrl) || direct;
        }
        return direct;
    }, [contentSource, redirectUrlProp, redirectUrl, mode, data, linkUrl, phone, email, emailSubject, emailBody, wifiSsid, wifiPass, wifiHidden, wifiType, firstName, lastName, contactPhone, contactEmail, org, url, note, street, city, state, zip, country]);

    const options = useMemo(
        () => ({
            width: size,
            height: size,
            type: "canvas",
            margin: quietZone, // ensure library paths honor quiet zone
            data: renderData,
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
                borderDotType,
                ringBackgroundColor,
                innerRadius,
                outerRadius,
                innerBorderWidth,
                innerBorderColor,
                outerBorderWidth,
                outerBorderColor,
            }
        }),
        [
            size,
            data,
            renderData,
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
            borderDotType,
            ringBackgroundColor,
            innerRadius,
            outerRadius,
            innerBorderWidth,
            innerBorderColor,
            outerBorderWidth,
            outerBorderColor,
            contentSource,
        ]
    );
    // end presetData

    // Normalize a DB Design document into a runtime snapshot shape for applySnapshot
    const normalizeSnapshot = (s) => {
        if (!s || typeof s !== 'object') return s;
        const out = { ...s };
        if (!out.contentSource && typeof s.encodesRedirect !== 'undefined') {
            out.contentSource = s.encodesRedirect ? 'redirect' : 'direct';
        }
        // Map gradient objects from DB schema to flat fields expected by applySnapshot
        if (s.dotGrad && typeof s.dotGrad === 'object') {
            out.dotGradEnabled = !!s.dotGrad.enabled;
            out.dotGradType = s.dotGrad.type ?? 'linear';
            out.dotGradStart = s.dotGrad.start ?? '#111111';
            out.dotGradMid = s.dotGrad.mid ?? '#333333';
            out.dotGradEnd = s.dotGrad.end ?? '#555555';
            out.dotGradStops = s.dotGrad.stops ?? 2;
            out.dotGradRotation = s.dotGrad.rotation ?? 0;
        }
        if (s.bgGrad && typeof s.bgGrad === 'object') {
            out.bgGradEnabled = !!s.bgGrad.enabled;
            out.bgGradType = s.bgGrad.type ?? 'linear';
            out.bgGradStart = s.bgGrad.start ?? '#ffffff';
            out.bgGradMid = s.bgGrad.mid ?? '#f0f0f0';
            out.bgGradEnd = s.bgGrad.end ?? '#e5e5e5';
            out.bgGradStops = s.bgGrad.stops ?? 2;
            out.bgGradRotation = s.bgGrad.rotation ?? 0;
        }
        return out;
    };

    // Apply initial snapshot once when provided (embedded edit page)
    const appliedInitialRef = useRef(false);
    useEffect(() => {
        if (appliedInitialRef.current) return;
        if (!initialSnapshot) return;
        const norm = normalizeSnapshot(initialSnapshot);
        applySnapshot(norm);
        appliedInitialRef.current = true;
    }, [initialSnapshot]);

    useEffect(() => {
        if (redirectUrlProp) return;
        if (typeof window === 'undefined') return;
        if (slugProp) {
            const origin = window.location.origin;
            setRedirectUrl(`${origin}/r/${slugProp}`);
        }
    }, [redirectUrlProp, slugProp]);

    // Minimum safe inner radius so the circular ring never touches the QR square
    const minInnerRadius = useMemo(() => {
        if (!circularBorder) return 0;
        try {
            const value = presetData();
            const content = value && String(value).length ? value : ' ';
            const qr = QRCode.create(content, {
                errorCorrectionLevel: errorCorrection || 'M',
                margin: 0,
            });
            const moduleCount = qr.modules.size;
            const padding = Math.max(quietZone * 4, 16);
            const totalSize = moduleCount + padding * 2;
            const moduleSize = size / totalSize;
            const qrSizePx = moduleCount * moduleSize;
            const qrHalfDiagonal = qrSizePx / Math.SQRT2;
            const minR = qrHalfDiagonal + (innerBorderWidth / 2);
            return Math.ceil(minR);
        } catch (_) {
            return 0;
        }
    }, [circularBorder, size, quietZone, innerBorderWidth, errorCorrection, data, mode, linkUrl, phone, email, emailSubject, emailBody, wifiSsid, wifiPass, wifiHidden, wifiType, firstName, lastName, contactPhone, contactEmail, org, url, note, street, city, state, zip, country]);

    // Clamp innerRadius to the minimum if needed
    useEffect(() => {
        if (!circularBorder) return;
        if (innerRadius < minInnerRadius) setInnerRadius(minInnerRadius);
    }, [circularBorder, minInnerRadius]);

    // Dynamic outerRadius bounds based on inner radius and canvas size
    const minOuterRadius = useMemo(() => {
        if (!circularBorder) return 0;
        return Math.ceil(innerRadius + (innerBorderWidth / 2) + (outerBorderWidth / 2));
    }, [circularBorder, innerRadius, innerBorderWidth, outerBorderWidth]);
    const maxOuterRadius = useMemo(() => {
        return Math.floor(size / 2 - outerBorderWidth / 2);
    }, [size, outerBorderWidth]);
    useEffect(() => {
        if (!circularBorder) return;
        if (outerRadius < minOuterRadius) setOuterRadius(minOuterRadius);
        if (outerRadius > maxOuterRadius) setOuterRadius(maxOuterRadius);
    }, [circularBorder, minOuterRadius, maxOuterRadius]);

    // Dynamic innerRadius maximum based on outer radius and strokes
    const maxInnerRadius = useMemo(() => {
        if (!circularBorder) return Number.POSITIVE_INFINITY;
        const maxByOuter = outerRadius - (innerBorderWidth / 2) - (outerBorderWidth / 2) - 14;
        return Math.max(0, Math.floor(maxByOuter));
    }, [circularBorder, outerRadius, innerBorderWidth, outerBorderWidth]);
    useEffect(() => {
        if (!circularBorder) return;
        if (innerRadius > maxInnerRadius) setInnerRadius(maxInnerRadius);
    }, [circularBorder, maxInnerRadius]);

    // Ensure a visible ring gap by default when enabling circular border
    useEffect(() => {
        if (!circularBorder) return;
        // Desired ring thickness based on font size (ensures text area visibility)
        const desiredGap = Math.max(24, Math.ceil(borderFontSize * 1.5));
        const targetOuter = Math.min(
            maxOuterRadius,
            Math.max(minOuterRadius, innerRadius + desiredGap)
        );
        if (outerRadius < targetOuter) {
            setOuterRadius(targetOuter);
        }
    }, [circularBorder, innerRadius, outerRadius, borderFontSize, minOuterRadius, maxOuterRadius]);

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

    // Integrated viewer state and ref to QR viewer
    const [viewerKind, setViewerKind] = useState('qr'); // 'qr' | 'preview'
    const [landingUrl, setLandingUrl] = useState('');
    const qrViewerRef = useRef(null);

    const buildPdfPreviewUrl = () => {
        const origin = typeof window !== 'undefined' ? location.origin : '';
        return buildPdfPreviewUrlUtil(origin, {
            url: linkUrl,
            title: pdfTitle,
            desc: pdfDescription,
            company: pdfCompany,
            site: pdfWebsite,
            cta: pdfCtaText,
            target: pdfOpenTarget,
            tf: pdfTitleFont,
            bf: pdfTextFont,
            style: pdfStyle,
            accent: pdfAccent,
            accent2: pdfAccent2,
        });
    };

    // Compute password hash for gated previews (pdf/mp3)
    useEffect(() => {
        let aborted = false;
        (async () => {
            try {
                if (pdfRequirePassword && pdfPassword) {
                    const enc = new TextEncoder();
                    const data = enc.encode(pdfPassword);
                    const digest = await crypto.subtle.digest('SHA-256', data);
                    const bytes = Array.from(new Uint8Array(digest));
                    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
                    if (!aborted) setPhHash(hex);
                } else {
                    if (!aborted) setPhHash('');
                }
            } catch {
                if (!aborted) setPhHash('');
            }
        })();
        return () => { aborted = true; };
    }, [pdfRequirePassword, pdfPassword]);

    // Auto-sync preview URL while editing when in 'preview' mode
    useEffect(() => {
        if (viewerKind !== 'preview') return;
        const origin = typeof window !== 'undefined' ? location.origin : '';
        const params = (() => {
            if (mode === 'pdf') {
                return {
                    url: linkUrl,
                    title: pdfTitle,
                    desc: pdfDescription,
                    company: pdfCompany,
                    site: pdfWebsite,
                    cta: pdfCtaText,
                    target: pdfOpenTarget,
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    style: pdfStyle,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                    ph: phHash || undefined,
                };
            }
            if (mode === 'app') {
                return {
                    ios: url,
                    android: street,
                    web: city,
                    title: pdfTitle || 'Get the app',
                    desc: pdfDescription,
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    style: pdfStyle,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                    auto: appAutoRedirect ? 'device' : undefined,
                    ctaIos: appCtaIos || undefined,
                    ctaAndroid: appCtaAndroid || undefined,
                    ctaWeb: appCtaWeb || undefined,
                };
            }
            if (mode === 'image') {
                return {
                    url: linkUrl,
                    title: pdfTitle,
                    desc: pdfDescription,
                    site: pdfWebsite,
                    cta: pdfCtaText || 'Open',
                    target: pdfOpenTarget,
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    style: pdfStyle,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'phone') {
                return {
                    to: phone,
                    title: pdfTitle || 'Call Us',
                    desc: pdfDescription,
                    cta: pdfCtaText || 'Call',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'email') {
                return {
                    to: email,
                    subject: emailSubject,
                    body: emailBody,
                    title: pdfTitle || 'Send us an email',
                    desc: pdfDescription,
                    cta: pdfCtaText || 'Compose Email',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'sms') {
                const raw = String(phone || '').trim();
                const dial = String(smsDialCode || '').replace(/\D+/g, '');
                let digits;
                if (/^\+\d+/.test(raw)) {
                    digits = raw.replace(/\D+/g, '');
                } else {
                    const local = raw.replace(/\D+/g, '');
                    digits = `${dial}${local}`;
                }
                digits = digits.replace(/^0+/, '');
                return {
                    to: digits,
                    body: data || '',
                    title: pdfTitle || 'Send an SMS',
                    desc: pdfDescription,
                    cta: pdfCtaText || 'Open SMS',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'wifi') {
                return {
                    ssid: wifiSsid,
                    type: wifiType,
                    pass: wifiPass,
                    hidden: wifiHidden,
                    title: pdfTitle || 'Wi‑Fi Network',
                    desc: pdfDescription,
                    cta: pdfCtaText || 'Copy details',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'geo') {
                return {
                    lat: state,
                    lng: zip,
                    label: country,
                    title: pdfTitle || 'Open Location',
                    desc: pdfDescription,
                    cta: pdfCtaText || 'Open in Maps',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'maps') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'Open Map',
                    desc: pdfDescription,
                    cta: pdfCtaText || 'Open',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'mecard') {
                return {
                    fn: firstName, ln: lastName,
                    phone: contactPhone, email: contactEmail,
                    org, url, street, city, state, zip, country,
                    title: pdfTitle || 'Contact', desc: pdfDescription,
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
            }
            if (mode === 'vcard') {
                return {
                    fn: firstName, ln: lastName,
                    phone: contactPhone, email: contactEmail,
                    org, url, street, city, state, zip, country, note,
                    title: pdfTitle || 'Contact Card', desc: pdfDescription,
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
            }
            if (mode === 'social') {
                const out = {
                    title: pdfTitle || 'Links',
                    desc: pdfDescription,
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
                (socialLinks || []).slice(0,6).forEach((it, idx) => {
                    const i = idx + 1;
                    if (it.platform) out[`s${i}p`] = it.platform;
                    if (it.url) out[`s${i}u`] = it.url;
                    if (it.text) out[`s${i}t`] = it.text;
                });
                return out;
            }
            if (mode === 'instagram') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'Instagram', desc: pdfDescription,
                    cta: pdfCtaText || 'Open Profile',
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
            }
            if (mode === 'facebook') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'Facebook', desc: pdfDescription,
                    cta: pdfCtaText || 'Open Page',
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
            }
            if (mode === 'menu') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'Menu', desc: pdfDescription,
                    cta: pdfCtaText || 'View Menu',
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
            }
            if (mode === 'coupon') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'Coupon', desc: pdfDescription,
                    cta: pdfCtaText || 'Redeem',
                    tf: pdfTitleFont, bf: pdfTextFont,
                    accent: pdfAccent, accent2: pdfAccent2,
                };
            }
            if (mode === 'mp3') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'MP3',
                    desc: pdfDescription,
                    site: pdfWebsite,
                    cta: pdfCtaText || 'Play',
                    target: pdfOpenTarget,
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    style: pdfStyle,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                    cover: mediaCover,
                    ph: phHash || undefined,
                    ...(() => {
                        const out = {};
                        const items = (mp3SocialLinks||[]).slice(0,6);
                        items.forEach((it, idx) => {
                          const i = idx + 1;
                          if (it.platform) out[`s${i}p`] = it.platform;
                          if (it.url) out[`s${i}u`] = it.url;
                          if (it.text) out[`s${i}t`] = it.text;
                        });
                        return out;
                    })(),
                };
            }
            if (mode === 'whatsapp') {
                const raw = String(phone || '').trim();
                const dial = String(whatsDialCode || '').replace(/\D+/g, '');
                let digits;
                if (/^\+\d+/.test(raw)) {
                    digits = raw.replace(/\D+/g, '');
                } else {
                    const local = raw.replace(/\D+/g, '');
                    digits = `${dial}${local}`;
                }
                digits = digits.replace(/^0+/, '');
                return {
                    to: digits,
                    text: data || '',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            if (mode === 'video') {
                return {
                    url: linkUrl,
                    title: pdfTitle || 'Video',
                    desc: pdfDescription,
                    site: pdfWebsite,
                    cta: pdfCtaText || 'Watch',
                    target: pdfOpenTarget,
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    style: pdfStyle,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                    cover: mediaCover,
                    ph: phHash || undefined,
                    ...(() => {
                        const out = {};
                        const items = (videoSocialLinks||[]).slice(0,6);
                        items.forEach((it, idx) => {
                          const i = idx + 1;
                          if (it.platform) out[`s${i}p`] = it.platform;
                          if (it.url) out[`s${i}u`] = it.url;
                          if (it.text) out[`s${i}t`] = it.text;
                        });
                        return out;
                    })(),
                };
            }
            if (mode === 'link') {
                return {
                    url: linkUrl,
                    title: pdfTitle,
                    desc: pdfDescription,
                    site: linkUrl,
                    cta: pdfCtaText || 'Open',
                    tf: pdfTitleFont,
                    bf: pdfTextFont,
                    style: pdfStyle,
                    accent: pdfAccent,
                    accent2: pdfAccent2,
                };
            }
            return null;
        })();
        if (!params) return;
        const urlBuilt = buildPreviewUrlUtil(mode, origin, params);
        setLandingUrl(urlBuilt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewerKind, mode, linkUrl, pdfTitle, pdfDescription, pdfCompany, pdfWebsite, pdfCtaText, pdfOpenTarget, pdfTitleFont, pdfTextFont, pdfStyle, pdfAccent, pdfAccent2, mediaCover, phHash, url, street, city, appCtaIos, appCtaAndroid, appCtaWeb, appAutoRedirect, phone, email, emailSubject, emailBody, smsDialCode, wifiSsid, wifiType, wifiPass, wifiHidden, state, zip, country, socialLinks]);

    // Live validation message
    const validation = useMemo(() => {
        const value = presetData();
        if (!value) return {ok: false, msg: "Enter content to generate a QR."};
        if (mode === "link") {
            if (!/^https?:\/\//i.test(value)) return {ok: true, msg: "No scheme found, using https automatically."};
        }
        if (mode === "pdf") {
            if (!/^https?:\/\//i.test(value)) return {ok: true, msg: "No scheme found, using https automatically."};
            if (!/\.pdf($|[?#])/i.test(value)) return {ok: false, msg: "URL should point to a .pdf file"};
        }
        if (["image","mp3","video","maps","social","app","instagram","facebook","menu","coupon"].includes(mode)) {
            if (!/^(geo:|https?:\/\/)/i.test(value)) return {ok: true, msg: "No scheme found, using https automatically."};
        }
        if (mode === "email") {
            if (!/^mailto:/i.test(value)) return {ok: false, msg: "Invalid email format."};
        }
        if (mode === "phone") {
            if (!/^tel:/i.test(value)) return {ok: false, msg: "Phone should start with tel:."};
        }
        if (mode === "sms") {
            if (!/^sms:/i.test(value)) return {ok: false, msg: "SMS format invalid."};
        }
        if (mode === "whatsapp") {
            if (!/^https?:\/\/(wa\.me|api\.whatsapp)/i.test(value)) return {ok: false, msg: "WhatsApp phone required."};
        }
        if (mode === "wifi") {
            if (!/^WIFI:/i.test(value)) return {ok: false, msg: "Wi‑Fi string malformed."};
        }
        if (mode === "geo") {
            if (!/^geo:/i.test(value)) return {ok: false, msg: "Geo coordinates required."};
        }
        return {ok: true, msg: "Ready."};
    }, [mode, linkUrl, phone, email, emailSubject, emailBody, wifiSsid, wifiPass, wifiHidden, wifiType, data, firstName, lastName, contactPhone, contactEmail, org, url, note, street, city, state, zip, country]);

    // Preselect preset via ?mode=
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const qMode = (router?.query?.mode || '').toString().toLowerCase();
        const allowed = new Set([
            "freeform","link","phone","email","wifi","mecard","vcard",
            "whatsapp","sms",
            "pdf","image","mp3","video","app","geo","maps",
            "social","instagram","facebook","menu","coupon"
        ]);
        if (qMode && allowed.has(qMode)) {
            setMode(qMode);
        }
    }, [router?.query?.mode]);

    // Compose landing redirect for PDF when requested
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (mode !== 'pdf') return;
        const makeUrl = async () => {
            if (pdfDirect) {
                setContentSource('direct');
                setRedirectUrl(null);
                return;
            }
            // Build landing URL with query params
            const base = `${window.location.origin}/view/pdf`;
            const params = new URLSearchParams();
            if (linkUrl) params.set('url', linkUrl);
            if (pdfTitle) params.set('title', pdfTitle);
            if (pdfDescription) params.set('desc', pdfDescription);
            if (pdfCompany) params.set('company', pdfCompany);
            if (pdfWebsite) params.set('site', pdfWebsite);
            if (pdfCtaText) params.set('cta', pdfCtaText);
            if (pdfOpenTarget) params.set('target', pdfOpenTarget);
            if (pdfTitleFont) params.set('tf', pdfTitleFont);
            if (pdfTextFont) params.set('bf', pdfTextFont);
            if (pdfRequirePassword && pdfPassword) {
                try {
                    const enc = new TextEncoder();
                    const data = enc.encode(pdfPassword);
                    const digest = await crypto.subtle.digest('SHA-256', data);
                    const bytes = Array.from(new Uint8Array(digest));
                    const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
                    params.set('ph', hex);
                } catch (_) {}
            }
            const full = `${base}?${params.toString()}`;
            setRedirectUrl(full);
            setContentSource('redirect');
        };
        makeUrl();
    }, [mode, pdfDirect, linkUrl, pdfTitle, pdfDescription, pdfCompany, pdfWebsite, pdfCtaText, pdfOpenTarget, pdfTitleFont, pdfTextFont, pdfRequirePassword, pdfPassword]);

    // QR rendering moved into QRViewer component

    const resetView = () => qrViewerRef.current?.resetView?.();

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
        // Save design snapshot automatically
        await autoSaveDesign();
        if (ext === 'svg') {
            const ok = await qrViewerRef.current?.downloadSvg?.();
            if (ok) return;
            // fallback to PNG
            ext = 'png';
        }
        const blob = await qrViewerRef.current?.getPngBlob?.();
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

    const copyImage = async () => {
        try {
            const blob = await qrViewerRef.current?.getPngBlob?.();
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
        await autoSaveDesign();
        try {
            const blob = await qrViewerRef.current?.getPngBlob?.();
            const url = URL.createObjectURL(blob);
            const img = new Image();
            await new Promise((res, rej) => {
                img.onload = res;
                img.onerror = rej;
                img.src = url;
            });
            const {jsPDF} = await import("jspdf");
            const px = size;
            const pdf = new jsPDF({orientation: "p", unit: "pt", format: [px, px]});
            pdf.addImage(img, "PNG", 0, 0, px, px);
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
        pdfTitle,
        pdfDescription,
        pdfCtaText,
        pdfOpenTarget,
        pdfCompany,
        pdfWebsite,
        pdfTitleFont,
        pdfTextFont,
        pdfDirect,
        pdfSubtitle,
        pdfRequirePassword,
        pdfPassword,
        appCtaIos,
        appCtaAndroid,
        appCtaWeb,
        appAutoRedirect,
        socialLinks,
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
        contentSource,

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
        setPdfTitle(s.pdfTitle ?? "");
        setPdfDescription(s.pdfDescription ?? "");
        setPdfCtaText(s.pdfCtaText ?? "View PDF");
        setPdfOpenTarget(s.pdfOpenTarget ?? "newtab");
        setPdfCompany(s.pdfCompany ?? "");
        setPdfWebsite(s.pdfWebsite ?? "");
        setPdfTitleFont(s.pdfTitleFont ?? "System");
        setPdfTextFont(s.pdfTextFont ?? "System");
        setPdfDirect(!!s.pdfDirect);

        setPdfRequirePassword(!!s.pdfRequirePassword);
        setPdfPassword(s.pdfPassword ?? "");
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
        setInnerBorderWidth(s.innerBorderWidth ?? 0);
        setInnerBorderColor(s.innerBorderColor ?? (s.ringBackgroundColor ?? "#ffffff"));
        setOuterBorderWidth(s.outerBorderWidth ?? 0);
        setOuterBorderColor(s.outerBorderColor ?? (s.ringBackgroundColor ?? "#ffffff"));
        setInnerRadius(s.innerRadius ?? 0);
        setOuterRadius(s.outerRadius ?? 0);
        if (s.contentSource === 'redirect' || s.contentSource === 'direct') setContentSource(s.contentSource);
        if (typeof s.appCtaIos !== 'undefined') setAppCtaIos(s.appCtaIos);
        if (typeof s.appCtaAndroid !== 'undefined') setAppCtaAndroid(s.appCtaAndroid);
        if (typeof s.appCtaWeb !== 'undefined') setAppCtaWeb(s.appCtaWeb);
        if (typeof s.appAutoRedirect !== 'undefined') setAppAutoRedirect(!!s.appAutoRedirect);
        if (Array.isArray(s.socialLinks)) setSocialLinks(s.socialLinks);
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
                    body: JSON.stringify({ snapshot: designBody, name }),
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
                return jsQ.item;
            } else {
                toast.error(jsQ?.message || t("designerEditor.messages.failedToSave"));
            }
        } catch (e) {
            toast.error(t("designerEditor.messages.failedToSave"));
        } finally {
            setSavingDb(false);
        }
        return null;
    };

    return (
        <div className="w-full grid grid-cols-1 border-0 gap-2 lg:grid-cols-7">
            <div className="lg:col-span-4 border-0">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">{t("designerEditor.customizeTitle")}</CardTitle>
                </CardHeader>
                <div className="overflow-visible">
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
                                whatsCountry={whatsCountry} setWhatsCountry={setWhatsCountry}
                                whatsDialCode={whatsDialCode} setWhatsDialCode={setWhatsDialCode}
                                smsCountry={smsCountry} setSmsCountry={setSmsCountry}
                                smsDialCode={smsDialCode} setSmsDialCode={setSmsDialCode}
                                pdfTitle={pdfTitle} setPdfTitle={setPdfTitle}
                                pdfDescription={pdfDescription} setPdfDescription={setPdfDescription}
                                pdfCtaText={pdfCtaText} setPdfCtaText={setPdfCtaText}
                                pdfOpenTarget={pdfOpenTarget} setPdfOpenTarget={setPdfOpenTarget}
                                pdfCompany={pdfCompany} setPdfCompany={setPdfCompany}
                                pdfWebsite={pdfWebsite} setPdfWebsite={setPdfWebsite}
                                pdfTitleFont={pdfTitleFont} setPdfTitleFont={setPdfTitleFont}
                                pdfTextFont={pdfTextFont} setPdfTextFont={setPdfTextFont}
                                pdfDirect={pdfDirect} setPdfDirect={setPdfDirect}
                                pdfRequirePassword={pdfRequirePassword} setPdfRequirePassword={setPdfRequirePassword}
                                pdfPassword={pdfPassword} setPdfPassword={setPdfPassword}
                                pdfStyle={pdfStyle} setPdfStyle={setPdfStyle}
                                pdfAccent={pdfAccent} setPdfAccent={setPdfAccent}
                                pdfAccent2={pdfAccent2} setPdfAccent2={setPdfAccent2}
                                mediaCover={mediaCover} setMediaCover={setMediaCover}
                                videoSocialLinks={videoSocialLinks} setVideoSocialLinks={setVideoSocialLinks}
                                mp3SocialLinks={mp3SocialLinks} setMp3SocialLinks={setMp3SocialLinks}
                                socialLinks={socialLinks} setSocialLinks={setSocialLinks}
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
                                appCtaIos={appCtaIos} setAppCtaIos={setAppCtaIos}
                                appCtaAndroid={appCtaAndroid} setAppCtaAndroid={setAppCtaAndroid}
                                appCtaWeb={appCtaWeb} setAppCtaWeb={setAppCtaWeb}
                                appAutoRedirect={appAutoRedirect} setAppAutoRedirect={setAppAutoRedirect}
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
                                            <Maximize2
                                                className="size-4"/> {t("designerEditor.styleTab.quietZone")}: {quietZone}px
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
                                        <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                                            <SelectTrigger className="w-full h-10">
                                                <SelectValue
                                                    placeholder={t("designerEditor.styleTab.levelPlaceholder")}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="L">{t("designerEditor.styleTab.errorLow")}</SelectItem>
                                                <SelectItem
                                                    value="M">{t("designerEditor.styleTab.errorMedium")}</SelectItem>
                                                <SelectItem
                                                    value="Q">{t("designerEditor.styleTab.errorQuartile")}</SelectItem>
                                                <SelectItem
                                                    value="H">{t("designerEditor.styleTab.errorHigh")}</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                        <Label htmlFor="bg-transparent"
                                               className="text-sm">{t("designerEditor.styleTab.transparentBg")}</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch id="dots-gradient" checked={dotGradEnabled}
                                                onCheckedChange={setDotGradEnabled}/>
                                        <Label htmlFor="dots-gradient"
                                               className="text-sm">{t("designerEditor.styleTab.dotsGradientToggle")}</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch id="bg-gradient" checked={bgGradEnabled}
                                                onCheckedChange={setBgGradEnabled} disabled={bgTransparent}/>
                                        <Label htmlFor="bg-gradient"
                                               className="text-sm">{t("designerEditor.styleTab.backgroundGradientToggle")}</Label>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Dots Configuration */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium">{t("designerEditor.styleTab.dotsHeading")}</h4>
                                            <div>
                                                <Label className="block mb-2 flex items-center gap-2">
                                                    <Shapes className="size-4"/> {t("designerEditor.styleTab.dotsType")}
                                                </Label>
                                                <Select value={dotType} onValueChange={setDotType}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue
                                                            placeholder={t("designerEditor.styleTab.typePlaceholder")}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {DOT_TYPES.map((t) => (
                                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {!dotGradEnabled ? (
                                                <div>
                                                    <Label className="block mb-2 flex items-center gap-2">
                                                        <Palette
                                                            className="size-4"/> {t("designerEditor.styleTab.dotsColor")}
                                                    </Label>
                                                    <ColorPicker color={dotColor}
                                                                 onChange={setDotColor}
                                                                 className="h-full w-full cursor-pointer"/>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Label className="block flex items-center gap-2">
                                                        <Palette
                                                            className="size-4"/> {t("designerEditor.styleTab.dotsGradient")}
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <ColorPicker color={dotGradStart}
                                                                     onChange={setDotGradStart}
                                                                     placeholder={t("designerEditor.styleTab.start")}/>
                                                        {dotGradStops === 3 && (
                                                            <ColorPicker color={dotGradMid}
                                                                         onChange={setDotGradMid}
                                                                         placeholder={t("designerEditor.styleTab.middle")}
                                                                         className="h-full"
                                                            />

                                                        )}
                                                        <ColorPicker color={dotGradEnd}
                                                                     onChange={setDotGradEnd}
                                                                     placeholder={t("designerEditor.styleTab.end")}/>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Select value={dotGradType} onValueChange={setDotGradType}>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t("designerEditor.styleTab.typePlaceholder")}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    value="linear">{t("designerEditor.styleTab.linear")}</SelectItem>
                                                                <SelectItem
                                                                    value="radial">{t("designerEditor.styleTab.radial")}</SelectItem>
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
                                                            <Label htmlFor="dotstops-2"
                                                                   className="text-sm">{t("designerEditor.styleTab.stops2")}</Label>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RadioGroupItem id="dotstops-3" value="3"/>
                                                            <Label htmlFor="dotstops-3"
                                                                   className="text-sm">{t("designerEditor.styleTab.stops3")}</Label>
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
                                                        <Palette
                                                            className="size-4"/> {t("designerEditor.styleTab.backgroundColor")}
                                                    </Label>
                                                    <ColorPicker color={bgColor}
                                                                 onChange={setBgColor}
                                                                 className="h-full w-full cursor-pointer"
                                                                 disabled={bgTransparent}/>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <Label className="block flex items-center gap-2">
                                                        <Palette
                                                            className="size-4"/> {t("designerEditor.styleTab.backgroundGradientToggle")}
                                                    </Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <ColorPicker color={bgGradStart}
                                                                     onChange={setBgGradStart}
                                                                     disabled={bgTransparent}
                                                                     placeholder={t("designerEditor.styleTab.start")}/>
                                                        {bgGradStops === 3 && (
                                                            <ColorPicker color={bgGradMid}
                                                                         onChange={setBgGradMid}
                                                                         disabled={bgTransparent}
                                                                         placeholder={t("designerEditor.styleTab.middle")}/>
                                                        )}
                                                        <ColorPicker color={bgGradEnd}
                                                                     onChange={setBgGradEnd}
                                                                     disabled={bgTransparent}
                                                                     placeholder={t("designerEditor.styleTab.end")}/>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Select value={bgGradType} onValueChange={setBgGradType}
                                                                disabled={bgTransparent}>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t("designerEditor.styleTab.typePlaceholder")}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem
                                                                    value="linear">{t("designerEditor.styleTab.linear")}</SelectItem>
                                                                <SelectItem
                                                                    value="radial">{t("designerEditor.styleTab.radial")}</SelectItem>
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
                                                            <Label htmlFor="bgstops-2"
                                                                   className="text-sm">{t("designerEditor.styleTab.stops2")}</Label>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RadioGroupItem id="bgstops-3" value="3"/>
                                                            <Label htmlFor="bgstops-3"
                                                                   className="text-sm">{t("designerEditor.styleTab.stops3")}</Label>
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
                                        <Select value={cornerSquareType} onValueChange={setCornerSquareType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CORNER_SQUARE_TYPES.map((t) => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                        <ColorPicker color={cornerSquareColor}
                                                     onChange={setCornerSquareColor}
                                                     className=" w-full cursor-pointer"/>
                                    </div>
                                </div>

                                {/* Corner Dot */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium">Corner Dot</h4>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Circle className="size-4"/> Style
                                        </Label>
                                        <Select value={cornerDotType} onValueChange={setCornerDotType}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CORNER_DOT_TYPES.map((t) => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="block mb-2 flex items-center gap-2">
                                            <Palette className="size-4"/> Color
                                        </Label>
                                        <ColorPicker color={cornerDotColor}
                                                     onChange={setCornerDotColor}
                                                     className=" w-full cursor-pointer"/>
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
                                borderDotType={borderDotType} setBorderDotType={setBorderDotType}
                                ringBackgroundColor={ringBackgroundColor}
                                setRingBackgroundColor={setRingBackgroundColor}
                                innerBorderWidth={innerBorderWidth} setInnerBorderWidth={setInnerBorderWidth}
                                innerBorderColor={innerBorderColor} setInnerBorderColor={setInnerBorderColor}
                                outerBorderWidth={outerBorderWidth} setOuterBorderWidth={setOuterBorderWidth}
                                outerBorderColor={outerBorderColor} setOuterBorderColor={setOuterBorderColor}
                                innerRadius={innerRadius} setInnerRadius={setInnerRadius}
                                outerRadius={outerRadius} setOuterRadius={setOuterRadius}
                                minInnerRadius={minInnerRadius}
                                maxInnerRadius={maxInnerRadius}
                                minOuterRadius={minOuterRadius}
                                maxOuterRadius={maxOuterRadius}
                                size={size}
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
                </div>
            </div>
            {/* Integrated Preview area below */}
            {/*/!* Quick Download bar under preview *!/*/}
            {/*{!embedded && (*/}
            {/*)}*/}

            {/*QR Code Preview with pan/zoom*/}
            <div className="flex  sticky top-0  self-start h-250 overflow-hidden items-start justify-start border-0 shadow-none lg:col-span-3">
                <div
                    className="flex pt-0 border-0 overflow flex-col h-full w-full"
                >
                    <EncodesToolbar
                      contentSource={contentSource}
                      setContentSource={setContentSource}
                      viewerKind={viewerKind}
                      setViewerKind={setViewerKind}
                      mode={mode}
                      setLandingUrl={setLandingUrl}
                      buildPreviewUrl={(m) => {
                        const origin = typeof window !== 'undefined' ? location.origin : '';
                        const baseParams = (() => {
                          if (m === 'pdf') {
                            return {
                              url: linkUrl,
                              title: pdfTitle,
                              desc: pdfDescription,
                              company: pdfCompany,
                              site: pdfWebsite,
                              cta: pdfCtaText,
                              target: pdfOpenTarget,
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              style: pdfStyle,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                              ph: phHash || undefined,
                            };
                          }
                          if (m === 'whatsapp') {
                            const raw = String(phone || '').trim();
                            const dial = String(whatsDialCode || '').replace(/\D+/g, '');
                            let digits;
                            if (/^\+\d+/.test(raw)) {
                              digits = raw.replace(/\D+/g, '');
                            } else {
                              const local = raw.replace(/\D+/g, '');
                              digits = `${dial}${local}`;
                            }
                            digits = digits.replace(/^0+/, '');
                            return {
                              to: digits,
                              text: data || '',
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                            };
                          }
                          if (m === 'phone') {
                            return {
                              to: phone,
                              title: pdfTitle || 'Call Us',
                              desc: pdfDescription,
                              cta: pdfCtaText || 'Call',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'email') {
                            return {
                              to: email,
                              subject: emailSubject,
                              body: emailBody,
                              title: pdfTitle || 'Send us an email',
                              desc: pdfDescription,
                              cta: pdfCtaText || 'Compose Email',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'sms') {
                            const raw = String(phone || '').trim();
                            const dial = String(smsDialCode || '').replace(/\D+/g, '');
                            let digits;
                            if (/^\+\d+/.test(raw)) {
                              digits = raw.replace(/\D+/g, '');
                            } else {
                              const local = raw.replace(/\D+/g, '');
                              digits = `${dial}${local}`;
                            }
                            digits = digits.replace(/^0+/, '');
                            return {
                              to: digits,
                              body: data || '',
                              title: pdfTitle || 'Send an SMS',
                              desc: pdfDescription,
                              cta: pdfCtaText || 'Open SMS',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'image') {
                            return {
                              url: linkUrl,
                              title: pdfTitle,
                              desc: pdfDescription,
                              site: pdfWebsite,
                              cta: pdfCtaText || 'Open',
                              target: pdfOpenTarget,
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              style: pdfStyle,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                            };
                          }
                          if (m === 'mp3') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'MP3',
                              desc: pdfDescription,
                              site: pdfWebsite,
                              cta: pdfCtaText || 'Play',
                              target: pdfOpenTarget,
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              style: pdfStyle,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                              cover: mediaCover,
                              ph: phHash || undefined,
                              ...(() => {
                                const out = {};
                                const items = (mp3SocialLinks||[]).slice(0,6);
                                items.forEach((it, idx) => {
                                  const i = idx + 1;
                                  if (it.platform) out[`s${i}p`] = it.platform;
                                  if (it.url) out[`s${i}u`] = it.url;
                                  if (it.text) out[`s${i}t`] = it.text;
                                });
                                return out;
                              })(),
                            };
                          }
                          if (m === 'video') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'Video',
                              desc: pdfDescription,
                              site: pdfWebsite,
                              cta: pdfCtaText || 'Watch',
                              target: pdfOpenTarget,
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              style: pdfStyle,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                              cover: mediaCover,
                              ph: phHash || undefined,
                              ...(() => {
                                const out = {};
                                const items = (videoSocialLinks||[]).slice(0,6);
                                items.forEach((it, idx) => {
                                  const i = idx + 1;
                                  if (it.platform) out[`s${i}p`] = it.platform;
                                  if (it.url) out[`s${i}u`] = it.url;
                                  if (it.text) out[`s${i}t`] = it.text;
                                });
                                return out;
                              })(),
                            };
                          }
                          if (m === 'wifi') {
                            return {
                              ssid: wifiSsid,
                              type: wifiType,
                              pass: wifiPass,
                              hidden: wifiHidden,
                              title: pdfTitle || 'Wi‑Fi Network',
                              desc: pdfDescription,
                              cta: pdfCtaText || 'Copy details',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'geo') {
                            return {
                              lat: state,
                              lng: zip,
                              label: country,
                              title: pdfTitle || 'Open Location',
                              desc: pdfDescription,
                              cta: pdfCtaText || 'Open in Maps',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'maps') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'Open Map',
                              desc: pdfDescription,
                              cta: pdfCtaText || 'Open',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'mecard') {
                            return {
                              fn: firstName, ln: lastName,
                              phone: contactPhone, email: contactEmail,
                              org, url, street, city, state, zip, country,
                              title: pdfTitle || 'Contact', desc: pdfDescription,
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'vcard') {
                            return {
                              fn: firstName, ln: lastName,
                              phone: contactPhone, email: contactEmail,
                              org, url, street, city, state, zip, country, note,
                              title: pdfTitle || 'Contact Card', desc: pdfDescription,
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'social') {
                            const out = {
                              title: pdfTitle || 'Links',
                              desc: pdfDescription,
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                            (socialLinks || []).slice(0,6).forEach((it, idx) => {
                              const i = idx + 1;
                              if (it.platform) out[`s${i}p`] = it.platform;
                              if (it.url) out[`s${i}u`] = it.url;
                              if (it.text) out[`s${i}t`] = it.text;
                            });
                            return out;
                          }
                          if (m === 'instagram') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'Instagram', desc: pdfDescription,
                              cta: pdfCtaText || 'Open Profile',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'facebook') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'Facebook', desc: pdfDescription,
                              cta: pdfCtaText || 'Open Page',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'menu') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'Menu', desc: pdfDescription,
                              cta: pdfCtaText || 'View Menu',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'coupon') {
                            return {
                              url: linkUrl,
                              title: pdfTitle || 'Coupon', desc: pdfDescription,
                              cta: pdfCtaText || 'Redeem',
                              tf: pdfTitleFont, bf: pdfTextFont,
                              accent: pdfAccent, accent2: pdfAccent2,
                            };
                          }
                          if (m === 'app') {
                            return {
                              ios: url,
                              android: street,
                              web: city,
                              title: pdfTitle || 'Get the app',
                              desc: pdfDescription,
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              style: pdfStyle,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                              auto: appAutoRedirect ? 'device' : undefined,
                              ctaIos: appCtaIos || undefined,
                              ctaAndroid: appCtaAndroid || undefined,
                              ctaWeb: appCtaWeb || undefined,
                            };
                          }
                          if (m === 'link') {
                            return {
                              url: linkUrl,
                              title: pdfTitle,
                              desc: pdfDescription,
                              site: linkUrl,
                              cta: pdfCtaText || 'Open',
                              tf: pdfTitleFont,
                              bf: pdfTextFont,
                              style: pdfStyle,
                              accent: pdfAccent,
                              accent2: pdfAccent2,
                            };
                          }
                          return {};
                        })();
                        return buildPreviewUrlUtil(m, origin, baseParams);
                      }}
                      ensureRedirectUrl={async () => {
                        if (!redirectUrlProp && !redirectUrl) {
                          const created = await saveQrToDb();
                          if (created?.slug && typeof window !== 'undefined') {
                            const origin = window.location.origin;
                            setRedirectUrl(`${origin}/r/${created.slug}`);
                          }
                        }
                      }}
                    />
                    <div className="w-full overflow-visible pr-10">
                      <div className="inline-block" style={{ minWidth: 420 }}>
                        <MobileMockup
                          device="iPhone X"
                          color="black"
                          width={375}
                          height={812}
                          src={viewerKind === 'preview' ? landingUrl : ''}
                          srcDoc={viewerKind === 'preview' && !landingUrl ? `<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;display:flex;align-items:center;justify-content:center;height:100vh;background:#fff;} .msg{max-width:280px;text-align:center;color:#111} .muted{color:#666;font-size:12px;margin-top:8px}</style></head><body><div class=\"msg\"><div style=\"font-weight:700;font-size:16px;margin-bottom:6px\">Preview coming soon</div><div class=\"muted\">This content type preview is not yet implemented.</div></div></body></html>` : ''}
                        >
                            {viewerKind === 'qr' && (
                              <QRViewer
                                ref={qrViewerRef}
                                options={options}
                                displaySize={displaySize}
                                cornerSquareType={cornerSquareType}
                                circularBorder={circularBorder}
                              />
                            )}
                        </MobileMockup>
                      </div>
                    </div>
                    <ExportActions
                      t={t}
                      onDownload={(fmt) => { download(fmt); toast.success(t("designerEditor.messages.downloadStarted", {format: fmt.toUpperCase()})); }}
                      onDownloadPDF={() => { downloadPDF(); toast.success(t("designerEditor.messages.downloadStarted", {format: 'PDF'})); }}
                      qrName={qrName}
                      setQrName={setQrName}
                      saveQrToDb={saveQrToDb}
                      savingDb={savingDb}
                      savedQr={savedQr}
                    />


                </div>
            </div>

            {!embedded && (
                <div className='lg:col-span-4'>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <List className="size-4"/> {t("designerEditor.tabs.presets")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Divider */}
                        <div className="border-t"></div>

                        {/* Cloud Presets Section */}
                        <PresetsManager
                          t={t}
                          buildSnapshot={buildSnapshot}
                          applySnapshot={applySnapshot}
                          cloudPresets={cloudPresets}
                          refreshCloudPresets={refreshCloudPresets}
                          presetName={presetName}
                          setPresetName={setPresetName}
                          cloudSelectedId={cloudSelectedId}
                          setCloudSelectedId={setCloudSelectedId}
                        />
                    </CardContent>
                </div>
            )}


        </div>
    );
}
