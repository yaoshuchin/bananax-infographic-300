/**
 * BananaX Referrer Tracker v2
 * 
 * アプリ内ブラウザやChrome拡張経由のトラフィックでも
 * referrer情報を取得しGA4に送信するスクリプト。
 * 
 * v2: インアプリブラウザ検出時にcampaign_sourceヒントも送信。
 *     Threads検出を追加。
 * 
 * GTM dataLayerにプッシュするため、GTMが読み込まれていれば動作する。
 * GA4側でカスタムディメンションとして設定が必要：
 *   - custom_referrer (イベントスコープ)
 *   - referrer_type (イベントスコープ)  
 *   - browser_type (イベントスコープ)
 */
(function () {
  'use strict';

  // Prevent duplicate execution (e.g. script loaded multiple times)
  if (window.__bxReferrerTracked) return;
  window.__bxReferrerTracked = true;

  var dl = window.dataLayer = window.dataLayer || [];

  // --- Detect browser type ---
  function detectBrowserType() {
    var ua = navigator.userAgent || '';
    // Enterprise messengers
    if (/Teams/i.test(ua)) return 'teams_inapp';
    if (/LINEWorks|LINEWORKS/i.test(ua)) return 'lineworks_inapp';
    // Korean messengers
    if (/KAKAOTALK/i.test(ua)) return 'kakao_inapp';
    if (/NAVER/i.test(ua)) return 'naver_inapp';
    // Common messengers
    if (/Line\//i.test(ua)) return 'line_inapp';
    if (/WorksMobile/i.test(ua)) return 'lineworks_inapp';
    if (/Teams/i.test(ua)) return 'teams_inapp';
    if (/FB(AN|AV)/i.test(ua)) return 'facebook_inapp';
    // Threads must be checked before Instagram (shares Meta WebView, UA contains "Instagram")
    if (/Barcelona/i.test(ua)) return 'threads_inapp';
    if (/Instagram/i.test(ua)) return 'instagram_inapp';
    if (/Twitter/i.test(ua) || /TwitterAndroid/i.test(ua)) return 'twitter_inapp';
    // Generic in-app WebView detection
    if (/wv\)/.test(ua) || /WebView/i.test(ua)) return 'webview_other';
    // Chrome extension (referrer starts with chrome-extension://)
    if (document.referrer && document.referrer.indexOf('chrome-extension://') === 0) return 'chrome_extension';
    // Normal browsers
    return 'browser';
  }

  // --- Classify referrer ---
  function classifyReferrer(ref) {
    if (!ref) return 'direct_or_empty';
    if (ref.indexOf('chrome-extension://') === 0) return 'chrome_extension';
    // Extract hostname
    try {
      var host = new URL(ref).hostname;
      if (/google\./i.test(host)) return 'google_search';
      if (/youtube\./i.test(host)) return 'youtube';
      if (/cybozu\.|kintone\./i.test(host)) return 'cybozu';
      if (/teams\.microsoft\.com/i.test(host)) return 'teams';
      if (/naver\./i.test(host) || /cafe\.naver/i.test(host)) return 'naver';
      if (/t\.co$/i.test(host) || /twitter\.com/i.test(host) || /x\.com/i.test(host)) return 'twitter';
      if (/threads\.net/i.test(host)) return 'threads';
      if (/instagram/i.test(host)) return 'instagram';
      if (/facebook/i.test(host)) return 'facebook';
      if (/clien\.net/i.test(host)) return 'clien';
      if (/notebooklm/i.test(host)) return 'notebooklm';
      if (/daum\./i.test(host) || /tistory\.com/i.test(host)) return 'daum';
      if (/bing\./i.test(host)) return 'bing';
      return 'referral_other';
    } catch (e) {
      return 'referral_unknown';
    }
  }

  // --- Map browser/referrer to campaign source hint ---
  function inferSource(browserType, referrerType) {
    // In-app browsers: the browser type tells us the source even without referrer
    var inappMap = {
      'teams_inapp': 'teams',
      'lineworks_inapp': 'lineworks',
      'kakao_inapp': 'kakao',
      'naver_inapp': 'naver',
      'line_inapp': 'line',
      'facebook_inapp': 'facebook',
      'instagram_inapp': 'instagram',
      'twitter_inapp': 'twitter',
      'threads_inapp': 'threads'
    };
    if (inappMap[browserType]) return inappMap[browserType];

    // Referrer-based source
    var refMap = {
      'google_search': 'google',
      'youtube': 'youtube',
      'naver': 'naver',
      'twitter': 'twitter',
      'threads': 'threads',
      'instagram': 'instagram',
      'facebook': 'facebook',
      'clien': 'clien',
      'notebooklm': 'notebooklm',
      'chrome_extension': 'chrome_extension',
      'daum': 'daum',
      'bing': 'bing'
    };
    return refMap[referrerType] || null;
  }

  function inferMedium(browserType, referrerType) {
    if (browserType.endsWith('_inapp')) return 'social';
    var mediumMap = {
      'google_search': 'organic',
      'bing': 'organic',
      'naver': 'organic',
      'daum': 'organic',
      'youtube': 'referral',
      'twitter': 'social',
      'threads': 'social',
      'instagram': 'social',
      'facebook': 'social',
      'clien': 'referral',
      'notebooklm': 'referral',
      'chrome_extension': 'referral'
    };
    return mediumMap[referrerType] || null;
  }

  var referrer = document.referrer || '';
  var browserType = detectBrowserType();
  var referrerType = classifyReferrer(referrer);

  // Sanitize referrer: strip query parameters to avoid PII leakage
  var sanitizedReferrer = referrer;
  if (referrer) {
    try {
      var url = new URL(referrer);
      sanitizedReferrer = url.origin + url.pathname;
    } catch (e) {
      sanitizedReferrer = referrer.split('?')[0].split('#')[0];
    }
  }

  // Build the dataLayer push
  var pushData = {
    event: 'bx_referrer_info',
    custom_referrer: sanitizedReferrer.substring(0, 500),
    referrer_type: referrerType,
    browser_type: browserType
  };

  // Add inferred source/medium for in-app and known referrers
  // This helps GTM set traffic_type or override source when GA4 shows (not set)
  var inferredSource = inferSource(browserType, referrerType);
  var inferredMedium = inferMedium(browserType, referrerType);
  if (inferredSource) {
    pushData.inferred_source = inferredSource;
    pushData.inferred_medium = inferredMedium || 'referral';
  }

  // Store referrer type for UI display (e.g. corporate badges)
  try {
    sessionStorage.setItem('bx_referrer_type', referrerType);
    if (browserType.endsWith('_inapp')) {
      sessionStorage.setItem('bx_browser_type', browserType);
    }
  } catch (e) {}

  // Push to dataLayer for GTM/GA4
  dl.push(pushData);

  // --- Enterprise share proof tracking (Issue #105 MVP) ---
  var KEY_ENTERPRISE_SHARES = 'bx_enterprise_shares';
  var ENTERPRISE_SOURCES = ['teams', 'microsoft_teams', 'lineworks', 'line_works', 'cybozu', 'kintone'];

  function getEnterpriseStats() {
    try {
      return JSON.parse(localStorage.getItem(KEY_ENTERPRISE_SHARES) || '{}');
    } catch (e) {
      return {};
    }
  }

  function setEnterpriseStats(stats) {
    try {
      localStorage.setItem(KEY_ENTERPRISE_SHARES, JSON.stringify(stats));
    } catch (e) { /* Safari private mode, storage full, etc. */ }
  }

  function normalizeSource(v) {
    return String(v || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  }

  function isEnterpriseTraffic() {
    try {
      var p = new URLSearchParams(window.location.search || '');
      var utmSource = normalizeSource(p.get('utm_source'));
      var inferred = normalizeSource(pushData.inferred_source);
      if (ENTERPRISE_SOURCES.indexOf(utmSource) >= 0 || ENTERPRISE_SOURCES.indexOf(inferred) >= 0) return true;

      var host = '';
      try { host = new URL(referrer || '').hostname.toLowerCase(); } catch (_) { host = ''; }
      return /teams\.microsoft\.com|lineworks|cybozu|kintone/.test(host);
    } catch (e) {
      return false;
    }
  }

  function getStyleIdFromUrl() {
    var p = new URLSearchParams(window.location.search || '');
    return p.get('id') || p.get('style') || p.get('sid') || null;
  }

  function recordEnterpriseShare(styleId) {
    if (!styleId) return;
    var stats = getEnterpriseStats();
    stats[styleId] = (stats[styleId] || 0) + 1;
    setEnterpriseStats(stats);

  }

  if (isEnterpriseTraffic()) {
    recordEnterpriseShare(getStyleIdFromUrl());
  }

  window.getEnterpriseShareCount = function (styleId) {
    if (!styleId) return 0;
    var stats = getEnterpriseStats();
    return stats[styleId] || 0;
  };
})();
