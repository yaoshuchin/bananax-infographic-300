(function () {
  'use strict';

  function normalizeLang(rawLang, site) {
    const lang = (rawLang || '').toLowerCase();
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('zh-hant')) return 'zh-Hant';
    if (lang.startsWith('zh-hans')) return 'zh-Hans';
    if (lang.startsWith('zh')) return site === 'infographic-olympic' ? 'zh-Hans' : 'zh-Hant';
    return 'ja';
  }

  function projectsBasePath() {
    var marker = '/projects/';
    var path = window.location.pathname || '/';
    var idx = path.indexOf(marker);
    if (idx === -1) return marker;
    return path.slice(0, idx + marker.length);
  }

  var dictionaries = {
    ja: {
      heading: '🍌 Other BananaX Projects',
      labels: {
        dena_100: 'AI活用事例ギャラリー',
        'infographic-evaluation': 'プロンプトパターン集',
        'banana-prompt': 'AI活用プロンプト1000',
        'infographic-olympic': '冬季オリンピック'
      }
    },
    en: {
      heading: '🍌 Other BananaX Projects',
      labels: {
        dena_100: 'AI Use Case Gallery',
        'infographic-evaluation': 'Prompt Patterns',
        'banana-prompt': 'AI Prompts 1000',
        'infographic-olympic': 'Winter Olympics'
      }
    },
    ko: {
      heading: '🍌 다른 BananaX 프로젝트',
      labels: {
        dena_100: 'AI 활용 사례 갤러리',
        'infographic-evaluation': '프롬프트 패턴집',
        'banana-prompt': 'AI 활용 프롬프트 1000',
        'infographic-olympic': '동계 올림픽'
      }
    },
    'zh-Hant': {
      heading: '🍌 其他 BananaX 專案',
      labels: {
        dena_100: 'AI 應用案例圖庫',
        'infographic-evaluation': '提示詞模式',
        'banana-prompt': 'AI 提示詞 1000',
        'infographic-olympic': '冬季奧運會'
      }
    },
    'zh-Hans': {
      heading: '🍌 其他 BananaX 项目',
      labels: {
        dena_100: 'AI 应用案例图库',
        'infographic-evaluation': '提示词模式',
        'banana-prompt': 'AI 提示词 1000',
        'infographic-olympic': '冬季奥运会'
      }
    }
  };

  var siteOrders = {
    dena_100: ['infographic-evaluation', 'banana-prompt', 'infographic-olympic'],
    'infographic-evaluation': ['dena_100', 'banana-prompt', 'infographic-olympic'],
    'banana-prompt': ['dena_100', 'infographic-evaluation', 'infographic-olympic'],
    'infographic-olympic': ['dena_100', 'infographic-evaluation', 'banana-prompt']
  };

  var icons = {
    dena_100: 'grid',
    'infographic-evaluation': 'book-open',
    'banana-prompt': 'lightbulb',
    'infographic-olympic': 'trophy'
  };

  function localePath(site, lang) {
    if (site === 'banana-prompt') return 'banana-prompt/';
    if (site === 'dena_100') {
      if (lang === 'en') return 'dena_100/en/';
      if (lang === 'ko') return 'dena_100/ko/';
      if (lang === 'zh-Hant' || lang === 'zh-Hans') return 'dena_100/zh/';
      return 'dena_100/';
    }
    if (site === 'infographic-evaluation') {
      if (lang === 'en') return 'infographic-evaluation/en/';
      if (lang === 'ko') return 'infographic-evaluation/ko/';
      if (lang === 'zh-Hant' || lang === 'zh-Hans') return 'infographic-evaluation/zh/';
      return 'infographic-evaluation/';
    }
    if (site === 'infographic-olympic') {
      if (lang === 'en') return 'infographic-olympic/en/';
      if (lang === 'ko') return 'infographic-olympic/ko/';
      if (lang === 'zh-Hant' || lang === 'zh-Hans') return 'infographic-olympic/zh/';
      return 'infographic-olympic/';
    }
    return site + '/';
  }

  function ensureFooterStyles() {
    if (document.getElementById('bx-footer-style')) return;
    var style = document.createElement('style');
    style.id = 'bx-footer-style';
    style.textContent = [
      '.bx-site-footer{margin-top:80px;padding:40px 20px 0;text-align:center;color:var(--text-meta,#999);}',
      '.bx-site-footer p,.bx-site-footer li,.bx-site-footer a,.bx-site-footer .bx-footer-meta,.bx-site-footer .bx-footer-nav-heading{font-family:Inter,\'Noto Sans JP\',\'Noto Sans KR\',\'Noto Sans TC\',sans-serif;letter-spacing:0.01em;}',
      '.bx-site-footer p{margin:0 0 0.5rem 0;color:var(--text-meta,#999);font-size:0.92rem;line-height:1.65;}',
      '.bx-site-footer a{color:var(--text-meta,#999);}',
      '.bx-site-footer .footer-links{list-style:none;padding:0;margin:1.2rem 0 0;display:flex;justify-content:center;gap:0.9rem 1.5rem;flex-wrap:wrap;}',
      '.bx-site-footer .footer-link{color:var(--text-meta,#999)!important;text-decoration:none!important;font-size:0.82rem;font-weight:500;line-height:1.45;opacity:0.88;display:inline-flex;align-items:center;gap:0.45rem;transition:opacity .2s ease,transform .2s ease;}',
      '.bx-site-footer .footer-link:hover{opacity:1;transform:translateY(-1px);text-decoration:none!important;}',
      '.bx-site-footer .footer-link i{width:15px;height:15px;flex:0 0 auto;}',
      '.bx-site-footer .bx-footer-meta{margin-top:1rem;font-size:0.82rem;font-weight:500;line-height:1.65;opacity:0.85;}',
      '.bx-site-footer .bx-footer-nav-section{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.1);}',
      '.bx-site-footer .bx-footer-nav-heading{margin:0 0 0.5rem 0;font-size:0.78rem;font-weight:600;opacity:0.68;}',
      '@media (max-width:600px){.bx-site-footer .footer-links{flex-direction:column;gap:0.85rem;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function decorateFooter(target) {
    var footer = target.closest('footer');
    if (!footer) return;
    footer.classList.add('bx-site-footer');
  }

  function renderBlock(target) {
    var site = target.getAttribute('data-bx-site');
    if (!siteOrders[site]) return;

    var lang = normalizeLang(document.documentElement.lang, site);
    var dict = dictionaries[lang] || dictionaries.ja;
    var base = projectsBasePath();

    var items = siteOrders[site].map(function (dest) {
      return '<li><a href="' + base + localePath(dest, lang) + '" class="footer-link"><i data-lucide="' + icons[dest] + '"></i>' + dict.labels[dest] + '</a></li>';
    }).join('');

    target.innerHTML = [
      '<div class="bx-footer-nav-section">',
      '  <p class="bx-footer-nav-heading">' + dict.heading + '</p>',
      '  <ul class="footer-links">' + items + '</ul>',
      '</div>'
    ].join('');
  }

  // Banana Keyboard is an Android app, so this only makes sense on a phone —
  // desktop readers cannot act on it and it would just be noise. Every string
  // says "Android" out loud rather than hiding it behind device sniffing:
  // iPhone readers are the majority of mobile here, and letting them decide
  // beats guessing at their user agent, which breaks quietly and often.
  //
  // The pitch leads with the reader's current problem rather than with the
  // product. Someone on a phone has just been copying prompts out of this page
  // by hand, which is exactly what the keyboard removes.
  // 298 of the 299 prompt titles on the evaluation pages are in the keyboard's
  // own catalogue, but the keyboard itself is still in closed testing, so the
  // copy promises the future ("will type") and says so in the body rather than
  // claiming the reader can install it today.
  var keyboardCta = {
    ja: {
      lead: 'この300プロンプト、スマホから直接入力できるようになります',
      body: 'Banana Keyboard（Android専用）はいまクローズドテスト中。テスターに参加すると、コピペなしでキーボードからそのまま入力できます。',
      video: 'Banana Keyboard の動作を見る（46秒）',
      action: 'テスターに応募する',
      dismiss: '次回から表示しない'
    },
    en: {
      lead: "These 300 prompts are coming to your phone's keyboard",
      body: 'Banana Keyboard (Android only) is in closed testing. Join as a tester and type them straight from your keyboard — no copy-paste.',
      video: 'See Banana Keyboard in action (46s)',
      action: 'Apply as a tester',
      dismiss: "Don't show this again"
    },
    ko: {
      lead: '이 300개 프롬프트, 휴대폰에서 바로 입력할 수 있게 됩니다',
      body: 'Banana Keyboard(Android 전용)는 지금 클로즈드 테스트 중입니다. 테스터로 참여하면 복사·붙여넣기 없이 키보드에서 그대로 입력할 수 있습니다.',
      video: 'Banana Keyboard 작동 모습 보기(46초)',
      action: '테스터 신청하기',
      dismiss: '다시 표시하지 않기'
    },
    'zh-Hant': {
      lead: '這 300 組提示詞，即將可以從手機直接輸入',
      body: 'Banana Keyboard（僅支援 Android）目前正在封閉測試中。成為測試人員後，不必複製貼上，就能從鍵盤直接輸入。',
      video: '看 Banana Keyboard 實際操作（46秒）',
      action: '報名成為測試人員',
      dismiss: '不再顯示'
    },
    'zh-Hans': {
      lead: '这 300 组提示词，即将可以从手机直接输入',
      body: 'Banana Keyboard（仅支持 Android）目前正在封闭测试中。成为测试人员后，无需复制粘贴，就能从键盘直接输入。',
      video: '看 Banana Keyboard 实际操作（46秒）',
      action: '报名成为测试人员',
      dismiss: '不再显示'
    }
  };

  var keyboardLocales = { ja: 'ja', en: 'en', ko: 'ko', 'zh-Hant': 'zh-TW', 'zh-Hans': 'zh-TW' };

  // Eight of the seventeen pages that load this file carry no
  // [data-bx-footer-nav] marker, and those include infographic-evaluation,
  // which is where nearly all of the mobile traffic lands. Read the project
  // from the path so the CTA never depends on markup it does not control.
  function currentSite() {
    var match = (window.location.pathname || '').match(/\/projects\/([^/]+)\//);
    return match ? match[1] : '';
  }

  function isPhone() {
    return window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
  }

  // Published 2026-08-06 as YouTube Shorts; /embed/<id> still works for them.
  // The evaluation pages already allow www.youtube-nocookie.com in frame-src,
  // so the demo can play in place without touching any page's CSP.
  var keyboardVideoIds = {
    'ja': '50T5y4XeszA',
    'en': 'ge35q74mrXQ',
    'ko': 'b08t3ZYSSNM',
    'zh-TW': 'enwpAi9rL5s'
  };

  function keyboardHref(lang, site, slot) {
    // utm_content carries the page and which control was pressed, so we can tell
    // both which project sends people and whether the video or the button did it.
    return 'https://keyboard.mojofull.com/?lang=' + keyboardLocales[lang] +
      '&utm_source=bananax&utm_medium=referral&utm_campaign=keyboard_closed_test&utm_content=' +
      encodeURIComponent(site + '_' + lang + (slot ? '_' + slot : ''));
  }

  function keyboardAsset(name) {
    return projectsBasePath() + 'shared/keyboard-cta/' + name;
  }

  // The five sites do not share a palette, and the existing footer rules here
  // assume a dark one (see the white-alpha border above) while the pages this
  // CTA has to reach are light. Rather than track each site's theme, the card
  // carries its own colours so it reads the same on any background.
  function ensureKeyboardStyles() {
    if (document.getElementById('bx-keyboard-cta-style')) return;
    var style = document.createElement('style');
    style.id = 'bx-keyboard-cta-style';
    style.textContent = [
      '.bx-keyboard-cta{display:none;}',
      '@media (max-width:767px){',
      '.bx-kb-superseded{display:none;}',
      '.bx-keyboard-cta{display:block;margin:0 0 14px;background:#fff;border:1px solid #e2ded6;',
      'border-radius:16px;padding:16px 14px 14px;text-align:center;',
      "font-family:Inter,'Noto Sans JP','Noto Sans KR','Noto Sans TC',sans-serif;color:#2c2c2c;}",
      '.bx-keyboard-cta *{box-sizing:border-box;}',
      '.bx-kb-logo{width:150px;height:auto;display:block;margin:0 auto 10px;}',
      '.bx-kb-lead{font-size:15px;font-weight:700;line-height:1.5;margin:0 0 6px;}',
      '.bx-kb-body{font-size:12.5px;line-height:1.65;color:#6b6862;margin:0 0 12px;text-align:left;}',
      '.bx-kb-demo{margin:0 0 10px;}',
      '.bx-kb-vbtn{width:100%;display:flex;align-items:center;justify-content:center;background:none;',
      'border:1.5px solid #14615c;color:#14615c;font-weight:700;font-size:12.5px;font-family:inherit;',
      'border-radius:999px;padding:12px 8px;cursor:pointer;}',
      '.bx-kb-vcaret{width:0;height:0;border-left:9px solid #14615c;',
      'border-top:6px solid transparent;border-bottom:6px solid transparent;margin-right:7px;flex:0 0 auto;}',
      '.bx-kb-vslot iframe{width:100%;aspect-ratio:9/16;max-height:72vh;display:block;border:0;',
      'border-radius:12px;margin:10px 0 0;background:#111;}',
      '.bx-kb-apply{display:block;background:#ffd700;color:#1a1a1a!important;font-weight:700;font-size:14px;',
      'border-radius:999px;padding:13px 10px;text-decoration:none!important;}',
      '.bx-kb-dismiss{display:inline-block;background:none;border:0;padding:8px 4px 0;margin:0;',
      'font-family:inherit;font-size:11px;color:#a8a49c;text-decoration:underline;cursor:pointer;}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  // Only banner_id and banner_name survive the trip: the GTM tag for
  // promo_banner_click (tagId 32, container v20) forwards exactly those two
  // dataLayer keys to GA4 and silently drops everything else, so the page and
  // language ride inside banner_id instead of their own parameters.
  function pushKeyboardEvent(id, name) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'promo_banner_click', banner_id: id, banner_name: name });
  }

  var keyboardDismissKey = 'bx-keyboard-cta-dismissed';

  function keyboardCtaDismissed() {
    try {
      return window.localStorage.getItem(keyboardDismissKey) === '1';
    } catch (e) {
      return false;
    }
  }

  function rememberKeyboardCtaDismissed() {
    try {
      window.localStorage.setItem(keyboardDismissKey, '1');
    } catch (e) {
      // Storage may be unavailable (private mode); the card then returns on
      // the next visit, which is the acceptable failure.
    }
  }

  // The demo stays folded until asked for. A poster frame only raised the
  // question of what it was showing; a labelled control says what pressing it
  // does. Playing in place also keeps the reader here — the demo is the
  // argument, so sending them to YouTube would lose the tap that follows it.
  function keyboardVideoToggle(copy, locale, pageId) {
    var wrap = document.createElement('div');
    wrap.className = 'bx-kb-demo';
    wrap.innerHTML = '<button type="button" class="bx-kb-vbtn" aria-expanded="false">' +
      '<span class="bx-kb-vcaret" aria-hidden="true"></span>' +
      '<span class="bx-kb-vlabel">' + copy.video + '</span></button>' +
      '<div class="bx-kb-vslot"></div>';

    var id = keyboardVideoIds[locale];
    var button = wrap.querySelector('.bx-kb-vbtn');
    if (!id) {
      button.remove();
      return wrap;
    }
    button.addEventListener('click', function () {
      button.setAttribute('aria-expanded', 'true');
      wrap.querySelector('.bx-kb-vslot').innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Banana Keyboard" ' +
        'allow="autoplay; encrypted-media" allowfullscreen></iframe>';
      pushKeyboardEvent('keyboard_cta_video_' + pageId, 'Banana Keyboard CTA video');
    }, { once: true });
    return wrap;
  }

  function buildKeyboardCta() {
    var site = currentSite();
    var lang = normalizeLang(document.documentElement.lang, site);
    var copy = keyboardCta[lang] || keyboardCta.ja;
    var locale = keyboardLocales[lang];
    var pageId = site + '_' + lang;

    var box = document.createElement('section');
    box.className = 'bx-keyboard-cta';
    box.innerHTML = '<img class="bx-kb-logo" src="' + keyboardAsset('wordmark.png') +
      '" alt="Banana Keyboard" width="440" height="280">' +
      '<p class="bx-kb-lead">' + copy.lead + '</p>' +
      '<p class="bx-kb-body">' + copy.body + '</p>' +
      '<div class="bx-kb-demoslot"></div>' +
      '<a class="bx-kb-apply" href="' + keyboardHref(lang, site, 'apply') +
      '" target="_blank" rel="noopener">' + copy.action + ' →</a>' +
      '<button type="button" class="bx-kb-dismiss">' + copy.dismiss + '</button>';
    box.querySelector('.bx-kb-demoslot').replaceWith(keyboardVideoToggle(copy, locale, pageId));
    box.querySelector('.bx-kb-dismiss').addEventListener('click', function () {
      rememberKeyboardCtaDismissed();
      pushKeyboardEvent('keyboard_cta_dismiss_' + pageId, 'Banana Keyboard CTA dismiss');
      var superseded = document.querySelector('.bx-kb-superseded');
      if (superseded) superseded.classList.remove('bx-kb-superseded');
      box.remove();
    }, { once: true });
    return box;
  }

  // In the page's own "ここでできること" slot, not the footer. GA4 shows phone
  // sessions fire scroll 0.49 times on average, so a footer placement never
  // reaches the readers who leave — and leaving is the behaviour this is trying
  // to change. That card is hidden rather than removed, and only under the
  // phone media query, so desktop keeps it untouched.
  function mountKeyboardCta() {
    if (!isPhone()) return;
    if (keyboardCtaDismissed()) return;
    if (document.querySelector('.bx-keyboard-cta')) return;

    var anchor = document.querySelector('.snapstart-card');
    if (anchor) {
      anchor.classList.add('bx-kb-superseded');
      anchor.insertAdjacentElement('beforebegin', buildKeyboardCta());
      return;
    }

    // Sites without that card keep the older footer placement.
    var footers = document.querySelectorAll('footer');
    for (var i = footers.length - 1; i >= 0; i -= 1) {
      if (footers[i].getClientRects().length) {
        footers[i].appendChild(buildKeyboardCta());
        return;
      }
    }
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var blocks = document.querySelectorAll('[data-bx-footer-nav]');
    if (blocks.length) {
      ensureFooterStyles();
      blocks.forEach(function (block) {
        decorateFooter(block);
        renderBlock(block);
      });
      refreshIcons();
    }
    ensureKeyboardStyles();
    mountKeyboardCta();
  });
})();
