"use client";

import { useEffect, useRef } from "react";

let QRCodeStyling;
if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  QRCodeStyling = require("qr-code-styling");
}

export default function QRMini({ text, size = 120 }) {
  const ref = useRef(null);
  const qr = useRef(null);
  useEffect(() => {
    if (!ref.current || !QRCodeStyling) return;
    const opts = {
      width: size,
      height: size,
      type: "canvas",
      data: text || "",
      qrOptions: { errorCorrectionLevel: "M", margin: 2 },
      dotsOptions: { color: "#ef7d20", type: "square" },
      backgroundOptions: { color: "#fff" },
    };
    if (!qr.current) {
      qr.current = new QRCodeStyling(opts);
      qr.current.append(ref.current);
    } else {
      qr.current.update(opts);
    }
  }, [text, size]);
  return <div ref={ref} className="inline-flex" />;
}
