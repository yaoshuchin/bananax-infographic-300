/**
 * Internal Share Welcome Card (#104)
 * 
 * Detects visitors coming from internal share links (Teams, Slack, etc.)
 * and shows a lightweight welcome banner with context.
 * 
 * Detection methods:
 * 1. UTM params: utm_source=copy_link (shared via clipboard)
 * 2. Referrer: teams.microsoft.com, slack.com, cybozu.com, etc.
 * 3. User-Agent: Teams/Slack in-app browsers
 */
(function () {
  'use strict';

  if (window.__bxWelcomeShown) return;
  window.__bxWelcomeShown = true;

  // Only show once per session
  if (sessionStorage.getItem('bx_welcome_dismissed')) return;

  var params = new URLSearchParams(window.location.search);
  var utmSource = (params.get('utm_source') || '').toLowerCase();
  var ref = (document.referrer || '').toLowerCase();
  var ua = (navigator.userAgent || '').toLowerCase();

  // Detect internal share sources
  var internalSources = [
    // UTM-based (from #102 share buttons)
    utmSource === 'copy_link',
    // Referrer-based
    /teams\.microsoft\.com/.test(ref),
    /teams\.live\.com/.test(ref),
    /slack\.com/.test(ref),
    /cybozu\.com/.test(ref),
    /kintone\.com/.test(ref),
    /lineworks\.com/.test(ref),
    /chatwork\.com/.test(ref),
    /workplace\.com/.test(ref),
    // UA-based (in-app browsers)
    /teams/i.test(ua) && /electron/i.test(ua),
    /slackelectron/i.test(ua)
  ];

  var isInternal = internalSources.some(function (v) { return v; });
  if (!isInternal) return;

  // Detect source name for display
  var sourceName = 'チャットツール';
  if (/teams/.test(ref) || /teams/.test(ua)) sourceName = 'Teams';
  else if (/slack/.test(ref) || /slackelectron/.test(ua)) sourceName = 'Slack';
  else if (/cybozu|kintone/.test(ref)) sourceName = 'Cybozu';
  else if (/lineworks/.test(ref)) sourceName = 'LINE Works';
  else if (/chatwork/.test(ref)) sourceName = 'Chatwork';

  // Determine language
  var lang = 'ja';
  var path = window.location.pathname;
  if (/\/en\//.test(path)) lang = 'en';
  else if (/\/ko\//.test(path)) lang = 'ko';
  else if (/\/zh\//.test(path)) lang = 'zh';

  var messages = {
    ja: {
      title: '同僚からの共有リンクです 🏢',
      desc: 'このページはAI活用のプロンプトパターン集です。気になるスタイルをクリックして、すぐにお使いいただけます。',
      popular: '👀 人気のスタイルから見る',
      close: '✕'
    },
    en: {
      title: 'Shared by a colleague 🏢',
      desc: 'This is a collection of AI prompt patterns. Click any style to try it out immediately.',
      popular: '👀 Browse popular styles',
      close: '✕'
    },
    ko: {
      title: '동료가 공유한 링크입니다 🏢',
      desc: 'AI 활용 프롬프트 패턴 모음입니다. 스타일을 클릭하면 바로 사용할 수 있습니다.',
      popular: '👀 인기 스타일 보기',
      close: '✕'
    },
    zh: {
      title: '同事分享的連結 🏢',
      desc: '這是AI提示詞模式集。點擊任何風格即可立即使用。',
      popular: '👀 瀏覽熱門風格',
      close: '✕'
    }
  };

  var msg = messages[lang] || messages.ja;

  // Create banner
  var banner = document.createElement('div');
  banner.id = 'bx-welcome-banner';
  banner.innerHTML =
    '<div style="max-width:800px;margin:0 auto;display:flex;align-items:center;gap:12px;">' +
      '<div style="flex:1;">' +
        '<strong>' + msg.title + '</strong>' +
        '<p style="margin:4px 0 8px;font-size:13px;opacity:0.85;">' + msg.desc + '</p>' +
        '<a href="#" id="bx-welcome-popular" style="font-size:13px;color:#ffd54f;text-decoration:none;">' + msg.popular + '</a>' +
      '</div>' +
      '<button id="bx-welcome-close" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;padding:4px 8px;opacity:0.7;">' + msg.close + '</button>' +
    '</div>';

  banner.style.cssText =
    'position:fixed;top:0;left:0;right:0;z-index:10000;' +
    'background:linear-gradient(135deg,#1a237e,#283593);color:#fff;' +
    'padding:12px 16px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);' +
    'animation:bxSlideDown 0.3s ease-out;';

  // Add animation
  var style = document.createElement('style');
  style.textContent = '@keyframes bxSlideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}';
  document.head.appendChild(style);

  // Insert after DOM ready
  function insert() {
    document.body.insertBefore(banner, document.body.firstChild);
    // Offset page content
    document.body.style.paddingTop = (banner.offsetHeight) + 'px';

    // Close button
    document.getElementById('bx-welcome-close').onclick = function () {
      dismiss();
    };

    // Popular link - scroll to gallery
    document.getElementById('bx-welcome-popular').onclick = function (e) {
      e.preventDefault();
      dismiss();
      var gallery = document.querySelector('.gallery-grid, .grid-container, #gallery');
      if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
    };


    // Auto-dismiss after 15 seconds
    setTimeout(dismiss, 15000);
  }

  function dismiss() {
    if (!banner.parentNode) return;
    sessionStorage.setItem('bx_welcome_dismissed', '1');
    banner.style.transition = 'transform 0.3s ease-in';
    banner.style.transform = 'translateY(-100%)';
    setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
      document.body.style.paddingTop = '';
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insert);
  } else {
    insert();
  }
})();
