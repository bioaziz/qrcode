export function buildPdfPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/pdf`.replace(/\/$/, "");
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.company) p.set('company', params.company);
    if (params.site) p.set('site', params.site);
    if (params.cta) p.set('cta', params.cta);
    if (params.target) p.set('target', params.target);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.style) p.set('style', params.style);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    if (params.cover) p.set('cover', params.cover);
    if (params.ph) p.set('ph', params.ph);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/pdf';
  }
}

export function buildLinkPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/link`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.site) p.set('site', params.site);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.style) p.set('style', params.style);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    if (params.cover) p.set('cover', params.cover);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/link';
  }
}

export function buildImagePreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/image`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.site) p.set('site', params.site);
    if (params.cta) p.set('cta', params.cta);
    if (params.target) p.set('target', params.target);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.style) p.set('style', params.style);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/image';
  }
}

export function buildMp3PreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/mp3`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.site) p.set('site', params.site);
    if (params.cta) p.set('cta', params.cta);
    if (params.target) p.set('target', params.target);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.style) p.set('style', params.style);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    if (params.cover) p.set('cover', params.cover);
    if (params.ph) p.set('ph', params.ph);
    for (let i = 1; i <= 6; i++) {
      const sp = params[`s${i}p`];
      const su = params[`s${i}u`];
      const st = params[`s${i}t`];
      if (sp) p.set(`s${i}p`, sp);
      if (su) p.set(`s${i}u`, su);
      if (st) p.set(`s${i}t`, st);
    }
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/mp3';
  }
}

export function buildWhatsappPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/whatsapp`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.to) p.set('to', params.to);
    if (params.text) p.set('text', params.text);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/whatsapp';
  }
}

export function buildVideoPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/video`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.site) p.set('site', params.site);
    if (params.cta) p.set('cta', params.cta);
    if (params.target) p.set('target', params.target);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.style) p.set('style', params.style);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    if (params.cover) p.set('cover', params.cover);
    if (params.ph) p.set('ph', params.ph);
    for (let i = 1; i <= 6; i++) {
      const sp = params[`s${i}p`];
      const su = params[`s${i}u`];
      const st = params[`s${i}t`];
      if (sp) p.set(`s${i}p`, sp);
      if (su) p.set(`s${i}u`, su);
      if (st) p.set(`s${i}t`, st);
    }
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/video';
  }
}

export function buildAppLinksPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/applinks`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.ios) p.set('ios', params.ios);
    if (params.android) p.set('android', params.android);
    if (params.web) p.set('web', params.web);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.style) p.set('style', params.style);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    if (params.auto) p.set('auto', params.auto);
    if (params.ctaIos) p.set('ctaIos', params.ctaIos);
    if (params.ctaAndroid) p.set('ctaAndroid', params.ctaAndroid);
    if (params.ctaWeb) p.set('ctaWeb', params.ctaWeb);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/applinks';
  }
}

export function buildPhonePreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/phone`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.to) p.set('to', params.to);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/phone';
  }
}

export function buildEmailPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/email`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.to) p.set('to', params.to);
    if (params.subject) p.set('subject', params.subject);
    if (params.body) p.set('body', params.body);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/email';
  }
}

export function buildSmsPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/sms`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.to) p.set('to', params.to);
    if (params.body) p.set('body', params.body);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/sms';
  }
}

export function buildWifiPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/wifi`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.ssid) p.set('ssid', params.ssid);
    if (params.type) p.set('type', params.type);
    if (params.pass) p.set('pass', params.pass);
    if (typeof params.hidden !== 'undefined') p.set('hidden', String(params.hidden));
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/wifi';
  }
}

export function buildGeoPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/geo`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.lat) p.set('lat', params.lat);
    if (params.lng) p.set('lng', params.lng);
    if (params.label) p.set('label', params.label);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/geo';
  }
}

export function buildMapsPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/maps`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/maps';
  }
}

export function buildMeCardPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/mecard`.replace(/\/$/, '');
    const p = new URLSearchParams();
    ['fn','ln','phone','email','org','url','street','city','state','zip','country','title','desc','tf','bf','accent','accent2'].forEach(k => {
      if (params[k]) p.set(k, params[k]);
    });
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/mecard';
  }
}

export function buildVcardPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/vcard`.replace(/\/$/, '');
    const p = new URLSearchParams();
    ['fn','ln','phone','email','org','url','street','city','state','zip','country','note','title','desc','tf','bf','accent','accent2'].forEach(k => {
      if (params[k]) p.set(k, params[k]);
    });
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/vcard';
  }
}

export function buildSocialPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/social`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    for (let i = 1; i <= 6; i++) {
      const sp = params[`s${i}p`];
      const su = params[`s${i}u`];
      const st = params[`s${i}t`];
      if (sp) p.set(`s${i}p`, sp);
      if (su) p.set(`s${i}u`, su);
      if (st) p.set(`s${i}t`, st);
    }
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/social';
  }
}

export function buildInstagramPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/instagram`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/instagram';
  }
}

export function buildFacebookPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/facebook`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/facebook';
  }
}

export function buildMenuPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/menu`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/menu';
  }
}

export function buildCouponPreviewUrl(origin = '', params = {}) {
  try {
    const base = `${origin || ''}/view/coupon`.replace(/\/$/, '');
    const p = new URLSearchParams();
    if (params.url) p.set('url', params.url);
    if (params.title) p.set('title', params.title);
    if (params.desc) p.set('desc', params.desc);
    if (params.cta) p.set('cta', params.cta);
    if (params.tf) p.set('tf', params.tf);
    if (params.bf) p.set('bf', params.bf);
    if (params.accent) p.set('accent', params.accent);
    if (params.accent2) p.set('accent2', params.accent2);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  } catch {
    return '/view/coupon';
  }
}

export function buildPreviewUrl(mode, origin, params = {}) {
  switch (mode) {
    case 'pdf':
      return buildPdfPreviewUrl(origin, params);
    case 'link':
      return buildLinkPreviewUrl(origin, params);
    case 'image':
      return buildImagePreviewUrl(origin, params);
    case 'mp3':
      return buildMp3PreviewUrl(origin, params);
    case 'whatsapp':
      return buildWhatsappPreviewUrl(origin, params);
    case 'video':
      return buildVideoPreviewUrl(origin, params);
    case 'app':
      return buildAppLinksPreviewUrl(origin, params);
    case 'phone':
      return buildPhonePreviewUrl(origin, params);
    case 'email':
      return buildEmailPreviewUrl(origin, params);
    case 'sms':
      return buildSmsPreviewUrl(origin, params);
    case 'wifi':
      return buildWifiPreviewUrl(origin, params);
    case 'geo':
      return buildGeoPreviewUrl(origin, params);
    case 'maps':
      return buildMapsPreviewUrl(origin, params);
    case 'mecard':
      return buildMeCardPreviewUrl(origin, params);
    case 'vcard':
      return buildVcardPreviewUrl(origin, params);
    case 'social':
      return buildSocialPreviewUrl(origin, params);
    case 'instagram':
      return buildInstagramPreviewUrl(origin, params);
    case 'facebook':
      return buildFacebookPreviewUrl(origin, params);
    case 'menu':
      return buildMenuPreviewUrl(origin, params);
    case 'coupon':
      return buildCouponPreviewUrl(origin, params);
    default:
      return '';
  }
}
