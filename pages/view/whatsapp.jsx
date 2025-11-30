"use client";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function WhatsAppPreview() {
  const { query } = useRouter();
  const to = (query.to || '').toString();
  const text = (query.text || 'Type your message').toString();
  const theme = (query.theme || 'light').toString();
  const tf = (query.tf || 'System').toString();
  const bf = (query.bf || 'System').toString();

  const titleStyle = useMemo(() => ({
    fontFamily: tf === 'System' ? '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' : tf,
    fontWeight: 600,
  }), [tf]);

  const bodyStyle = useMemo(() => ({
    fontFamily: bf === 'System' ? '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' : bf
  }), [bf]);

  const titleTextStyle = useMemo(() => ({
    ...titleStyle,
    fontSize: '16px',
    lineHeight: '19px',
    letterSpacing: '-0.3px',
    color: '#000000'
  }), [titleStyle]);

  const subtitleStyle = useMemo(() => ({
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '-0.01px',
    color: 'rgba(255, 255, 255, 0.7)'
  }), []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ ...bodyStyle }}>
      <style jsx global>{`
        html, body, #__next { height: 100%; margin: 0; }
        html, body { overflow: hidden; }
      `}</style>
      {/* Root fills the iframe; inner uses responsive sizing instead of fixed px */}
      <div
        className="relative overflow-hidden w-full h-full"
        style={{
          backgroundImage: "url('/whatsappchatbg.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'top center',

        }}
      >
        {/* Contact info overlay positioned on top of SVG header */}
        <div
          className="absolute z-10 flex items-center text-black"
          style={{
            left: '12%', // ~30px on 375px base
            right: '8%',
            top: '42px', // ~110px on 812px base
          }}
        >
          {/* Contact avatar */}
          <div className="w-9 h-9 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>

          {/* Contact name and status */}
          <div className="flex-1 min-w-0 text-black mb-4">
            <div className="truncate" style={titleTextStyle}>
              {to}
            </div>
            <div className="truncate" style={subtitleStyle}>
              {/*online*/}
            </div>
          </div>
        </div>

        {/* Chat messages area */}
        <div
          className="absolute left-0 w-full z-0"
          style={{ top: '2.5%', bottom: '2.5%' }}
        >
          {/* Dynamic Outgoing Message */}
          <div
            className="absolute flex justify-end px-[3%]"
            style={{
              right: '16px',
              top: '100px', // ~140px on 812px base
              width: '100%'
            }}
          >
            <div className="relative" >
              {/* Shadow */}
              <div
                className="absolute rounded-lg"
                style={{
                  left: '14px', // ~40px on 375px base
                  right: 0,
                  top: '0.15%',
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.1)',
                  filter: 'blur(1px)',
                  zIndex: 1
                }}
              ></div>

              {/* Message bubble - fixed width */}
              <div
                className="relative rounded-lg"
                style={{
                  background: '#DCF7C5',
                  minHeight: '34px',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  zIndex: 2,
                  left: '14px', // ~40px on 375px base
                  width: '220px', // ~220px on 375px base
                  paddingTop: '8px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  paddingBottom: '20px'
                }}
              >
                {/* Message text */}
                <div
                  className="text-black"
                  style={{
                    fontSize: '16px',
                    lineHeight: '19px',
                    letterSpacing: '-0.3px',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '4px',
                    ...bodyStyle
                  }}
                >
                  {text}
                </div>

                {/* Time and read indicators container - fixed at bottom */}
                <div
                  className="absolute bottom-2 right-3 flex items-center gap-1"
                  style={{
                    zIndex: 3,
                    height: '13px',
                    alignItems: 'center'
                  }}
                >
                  {/* Time */}
                  <div
                    className="text-right"
                    style={{
                      fontSize: '11px',
                      lineHeight: '13px',
                      letterSpacing: '0.5px',
                      color: 'rgba(0, 0, 0, 0.4)',
                      ...bodyStyle
                    }}
                  >
                    10:10
                  </div>

                  {/* Read indicators */}
                  <　div style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width="13.5" height="8" viewBox="0 0 14 8">
                      <path d="M0 4l2 2 4-4M6 4l2 2 4-4" stroke="#3497F9" strokeWidth="1" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
