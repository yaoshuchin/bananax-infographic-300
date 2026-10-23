(() => {
  const endpoint = 'https://bananax-usage.flock-h.workers.dev/usage';
  const params = new URLSearchParams(window.location.search);
  const isPublished = window.location.hostname === 'furoku.github.io';
  const isLocalPreview = ['127.0.0.1', 'localhost'].includes(window.location.hostname)
    && params.get('usagePreview') === '1';
  if (!isPublished && !isLocalPreview) return;

  const iconOnlyKey = 'bx-usage-icon-only-v1';
  let iconOnly = false;
  try {
    iconOnly = sessionStorage.getItem(iconOnlyKey) === '1'
      || sessionStorage.getItem('bx-usage-dismissed-v1') === '1';
  } catch { /* Private browsing may disable storage. */ }

  const copy = {
    ja: {
      title: 'BananaX の利用状況', compactTitle: '利用状況', close: '小さくたたむ', expand: '開く', restore: '利用状況を開く',
      recent: '直近30分に閲覧', history: '昨日までの7日間の閲覧回数',
      monthCopies: '直近28日（約1ヶ月）のコピー', perVisitor: '1人あたりのコピー（7日）',
      countries: '来訪が多い国・地域（7日）', previousPeriod: '前の7日', increase: '増', decrease: '減', noChange: '変化なし', recentCountry: '直近30分で多い国',
      countryCount: '30分以内に{count}名', flagNote: '（5名以上で旗掲載）',
      copyNote: 'GA4に記録されたコピー操作。昨日までの28日間。',
      few: '少人数が閲覧', unavailable: '集計を取得できません', views: '回', perVisitorUnit: '回/人',
    },
    en: {
      title: 'BananaX activity', compactTitle: 'Activity', close: 'Minimize', expand: 'Expand', restore: 'Open activity',
      recent: 'Viewed in the last 30 min', history: 'Views in the 7 days through yesterday',
      monthCopies: 'Prompt copies · last 28 days', perVisitor: 'Copies per visitor · 7 days',
      countries: 'Top visitor countries · 7 days', previousPeriod: 'Previous 7 days', increase: ' up', decrease: ' down', noChange: 'no change', recentCountry: 'Top country in the last 30 min',
      countryCount: '{count} in 30 min', flagNote: '(flags shown for 5+)',
      copyNote: 'GA4-recorded copy actions in the 28 days through yesterday.',
      few: 'A few people viewed', unavailable: 'Usage is unavailable', views: 'views', perVisitorUnit: 'per visitor',
    },
    ko: {
      title: 'BananaX 이용 현황', compactTitle: '이용 현황', close: '최소화', expand: '펼치기', restore: '이용 현황 열기',
      recent: '최근 30분 동안 열람', history: '어제까지 7일간의 조회수',
      monthCopies: '최근 28일 프롬프트 복사', perVisitor: '방문자당 복사 · 7일',
      countries: '방문자가 많은 국가·지역 · 7일', previousPeriod: '이전 7일', increase: '증가', decrease: '감소', noChange: '변화 없음', recentCountry: '최근 30분에 가장 많은 국가',
      countryCount: '30분 내 {count}명', flagNote: '(5명 이상일 때 국기 표시)',
      copyNote: '어제까지 28일간 GA4에 기록된 복사 동작입니다.',
      few: '소수의 사용자가 열람', unavailable: '집계를 불러올 수 없습니다', views: '회', perVisitorUnit: '회/명',
    },
    'zh-Hant': {
      title: 'BananaX 使用情況', compactTitle: '使用情況', close: '縮小', expand: '展開', restore: '開啟使用情況',
      recent: '最近 30 分鐘內瀏覽', history: '截至昨日 7 天內的瀏覽次數',
      monthCopies: '最近 28 天的提示詞複製', perVisitor: '每位訪客複製次數 · 7 天',
      countries: '訪客最多的國家／地區 · 7 天', previousPeriod: '前 7 天', increase: '增加', decrease: '減少', noChange: '無變化', recentCountry: '最近 30 分鐘最多的國家',
      countryCount: '近 30 分鐘 {count} 人', flagNote: '（達 5 人顯示旗幟）',
      copyNote: '截至昨日 28 天內，GA4 記錄的複製操作。',
      few: '少數人瀏覽', unavailable: '目前無法取得統計', views: '次', perVisitorUnit: '次/人',
    },
  };
  const lang = document.documentElement.lang in copy ? document.documentElement.lang : 'ja';
  const labels = copy[lang];
  const number = new Intl.NumberFormat(lang === 'zh-Hant' ? 'zh-TW' : lang);
  const decimal = new Intl.NumberFormat(lang === 'zh-Hant' ? 'zh-TW' : lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const regionNames = new Intl.DisplayNames([lang], { type: 'region' });

  const panel = document.createElement('aside');
  panel.className = 'bx-usage';
  panel.dataset.bxUsage = '';
  panel.setAttribute('aria-label', labels.title);
  panel.hidden = true;
  panel.innerHTML = `
    <button class="bx-usage__restore" type="button" data-bx-usage-restore hidden>
      <i data-lucide="users-round" aria-hidden="true">👤</i>
      <span class="bx-usage__restore-flag" data-bx-recent-flag aria-hidden="true" hidden></span>
    </button>
    <div class="bx-usage__top">
      <span class="bx-usage__mark" aria-hidden="true">🍌</span>
      <strong class="bx-usage__title"></strong>
      <button class="bx-usage__icon bx-usage__expand" type="button" data-bx-usage-expand hidden>
        <i data-lucide="chevron-up" aria-hidden="true">⌃</i>
      </button>
      <button class="bx-usage__icon bx-usage__close" type="button" data-bx-usage-close>
        <i data-lucide="x" aria-hidden="true">×</i>
      </button>
    </div>
    <div class="bx-usage__content">
      <div data-bx-usage-main>
        <div class="bx-usage__walkers" data-bx-walkers aria-hidden="true"></div>
        <div class="bx-usage__metric" data-bx-recent>
          <span class="bx-usage__metric-label"></span>
          <strong class="bx-usage__metric-value" data-bx-recent-value></strong>
        </div>
        <div class="bx-usage__countries" data-bx-countries></div>
        <div class="bx-usage__metric bx-usage__metric--history" data-bx-history>
          <span class="bx-usage__metric-label"></span>
          <strong class="bx-usage__metric-value" data-bx-history-value></strong>
        </div>
        <div class="bx-usage__metric" data-bx-month hidden>
          <span class="bx-usage__metric-label"></span>
          <strong class="bx-usage__metric-value" data-bx-month-value></strong>
        </div>
        <div class="bx-usage__metric bx-usage__metric--per-visitor" data-bx-per-visitor hidden>
          <span class="bx-usage__metric-label"></span>
          <strong class="bx-usage__metric-value" data-bx-per-visitor-value></strong>
          <small class="bx-usage__change" data-bx-week-change hidden></small>
        </div>
        <div class="bx-usage__geography" data-bx-geography hidden>
          <strong class="bx-usage__geography-title"></strong>
          <ol class="bx-usage__chart" data-bx-country-chart></ol>
        </div>
        <p class="bx-usage__status" data-bx-status role="status" aria-live="polite" hidden></p>
      </div>
      <div data-bx-greetings></div>
    </div>`;
  panel.querySelector('.bx-usage__title').textContent = labels.title;
  panel.querySelector('[data-bx-usage-expand]').setAttribute('aria-label', labels.expand);
  panel.querySelector('[data-bx-usage-expand]').title = labels.expand;
  panel.querySelector('[data-bx-usage-close]').setAttribute('aria-label', labels.close);
  panel.querySelector('[data-bx-usage-close]').title = labels.close;
  panel.querySelector('[data-bx-usage-restore]').setAttribute('aria-label', labels.restore);
  panel.querySelector('[data-bx-usage-restore]').title = labels.restore;
  panel.querySelector('[data-bx-recent] .bx-usage__metric-label').textContent = labels.recent;
  panel.querySelector('[data-bx-history] .bx-usage__metric-label').textContent = labels.history;
  panel.querySelector('[data-bx-month] .bx-usage__metric-label').textContent = labels.monthCopies;
  panel.querySelector('[data-bx-month]').title = labels.copyNote;
  panel.querySelector('[data-bx-per-visitor] .bx-usage__metric-label').textContent = labels.perVisitor;
  panel.querySelector('.bx-usage__geography-title').textContent = labels.countries;
  document.body.append(panel);
  window.lucide?.createIcons?.();

  const walkers = panel.querySelector('[data-bx-walkers]');
  const countries = panel.querySelector('[data-bx-countries]');
  const recent = panel.querySelector('[data-bx-recent]');
  const history = panel.querySelector('[data-bx-history]');
  const month = panel.querySelector('[data-bx-month]');
  const perVisitor = panel.querySelector('[data-bx-per-visitor]');
  const geography = panel.querySelector('[data-bx-geography]');
  const status = panel.querySelector('[data-bx-status]');
  const expand = panel.querySelector('[data-bx-usage-expand]');
  const restore = panel.querySelector('[data-bx-usage-restore]');
  const restoreFlag = panel.querySelector('[data-bx-recent-flag]');
  let introActive = !iconOnly;
  let manuallyExpanded = false;
  let expandedAtY = 0;
  let introTimer;
  let timer;
  let controller;

  function flagFor(code) {
    if (!/^[A-Z]{2}$/.test(code)) return '';
    return String.fromCodePoint(...[...code].map(letter => 0x1f1e6 + letter.charCodeAt(0) - 65));
  }

  function renderWalkers(count, rows) {
    walkers.replaceChildren();
    walkers.hidden = !Number.isSafeInteger(count) || count < 5;
    if (walkers.hidden) return;
    const flags = [];
    for (const row of rows) {
      for (let index = 0; index < row.users && flags.length < count; index++) {
        flags.push(flagFor(row.code));
      }
    }
    while (flags.length < count) flags.push('');
    const signature = `${count}|${rows.map(row => `${row.code}:${row.users}`).join('|')}`;
    let seed = 0;
    for (const char of signature) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) >>> 0;
    for (let index = flags.length - 1; index > 0; index--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const target = seed % (index + 1);
      [flags[index], flags[target]] = [flags[target], flags[index]];
    }
    for (let index = 2; index < flags.length; index++) {
      if (!flags[index] || flags[index] !== flags[index - 1] || flags[index] !== flags[index - 2]) continue;
      const target = flags.findIndex((flag, position) => position > index && flag !== flags[index]);
      if (target !== -1) [flags[index], flags[target]] = [flags[target], flags[index]];
    }
    const crowd = document.createDocumentFragment();
    for (let index = 0; index < count; index++) {
      const person = document.createElement('span');
      person.className = 'bx-usage__walker';
      person.textContent = index % 2 === 0 ? '🚶‍♀️' : '🚶‍♂️';
      person.style.animationDelay = `${index % 6 * 0.17}s`;
      if (flags[index]) {
        const flag = document.createElement('span');
        flag.className = 'bx-usage__flag';
        flag.textContent = flags[index];
        person.append(flag);
      }
      crowd.append(person);
    }
    walkers.append(crowd);
  }

  function renderRestoreFlag(recentData) {
    const country = recentData?.level === 'count' && Array.isArray(recentData.countries)
      ? recentData.countries.find(row => /^[A-Z]{2}$/.test(row?.code) && Number.isSafeInteger(row?.users) && row.users >= 5)
      : null;
    restoreFlag.hidden = !country;
    restoreFlag.textContent = country ? flagFor(country.code) : '';
    const title = country ? `${labels.restore} · ${labels.recentCountry}: ${regionNames.of(country.code)}` : labels.restore;
    restore.setAttribute('aria-label', title);
    restore.title = title;
  }

  function renderGeography(rows) {
    const chart = panel.querySelector('[data-bx-country-chart]');
    chart.replaceChildren();
    const valid = Array.isArray(rows) ? rows.filter(row => /^[A-Z]{2}$/.test(row?.code)
      && Number.isSafeInteger(row?.relativeHeight) && row.relativeHeight >= 1 && row.relativeHeight <= 100) : [];
    geography.hidden = valid.length === 0;
    for (const [index, row] of valid.slice(0, 5).entries()) {
      const item = document.createElement('li');
      item.className = 'bx-usage__chart-item';
      item.setAttribute('aria-label', `${index + 1}. ${regionNames.of(row.code)}`);
      item.title = regionNames.of(row.code);
      const bar = document.createElement('span');
      bar.className = 'bx-usage__bar';
      bar.style.height = `${row.relativeHeight}%`;
      bar.setAttribute('aria-hidden', 'true');
      const slot = document.createElement('span');
      slot.className = 'bx-usage__bar-slot';
      slot.append(bar);
      const flag = document.createElement('span');
      flag.className = 'bx-usage__chart-flag';
      flag.textContent = flagFor(row.code);
      flag.setAttribute('aria-hidden', 'true');
      item.append(slot, flag);
      chart.append(item);
    }
  }

  function render(data) {
    const { recent30m, past7d, past28d, perVisitor7d, countries7d } = data || {};
    if (!['none', 'few', 'count'].includes(recent30m?.level) ||
        !Number.isSafeInteger(past7d?.pageViews) || past7d.pageViews < 0 ||
        typeof past7d.throughDate !== 'string') {
      throw new Error('Invalid usage response');
    }
    const countryRows = Array.isArray(recent30m.countries)
      ? recent30m.countries.filter(row => /^[A-Z]{2}$/.test(row?.code) && Number.isSafeInteger(row?.users) && row.users >= 5)
      : [];
    status.hidden = true;
    renderRestoreFlag(recent30m);
    recent.hidden = recent30m.level === 'none';
    history.hidden = false;
    countries.hidden = recent30m.level !== 'count' || countryRows.length === 0;
    if (recent30m.level === 'few') {
      panel.querySelector('[data-bx-recent-value]').textContent = labels.few;
    } else if (recent30m.level === 'count' && Number.isSafeInteger(recent30m.activeUsers) && recent30m.activeUsers >= 5) {
      panel.querySelector('[data-bx-recent-value]').textContent = number.format(recent30m.activeUsers);
    } else if (recent30m.level === 'count') {
      throw new Error('Invalid realtime count');
    }
    panel.querySelector('[data-bx-history-value]').textContent = `${number.format(past7d.pageViews)} ${labels.views}`;
    month.hidden = !Number.isSafeInteger(past28d?.copyEvents) || past28d.copyEvents < 0;
    if (!month.hidden) panel.querySelector('[data-bx-month-value]').textContent = `${number.format(past28d.copyEvents)} ${labels.views}`;
    perVisitor.hidden = perVisitor7d?.value === undefined;
    if (!perVisitor.hidden) {
      const value = perVisitor7d.value;
      if (value !== null && (!Number.isFinite(value) || value < 0)) throw new Error('Invalid per-visitor metric');
      panel.querySelector('[data-bx-per-visitor-value]').textContent = value === null
        ? '—' : `${decimal.format(value)} ${labels.perVisitorUnit}`;
      const change = perVisitor7d.weekOverWeekPercent;
      const previousValue = perVisitor7d.previousValue;
      if (previousValue !== null && previousValue !== undefined && (!Number.isFinite(previousValue) || previousValue < 0)) {
        throw new Error('Invalid previous per-visitor metric');
      }
      const changeNode = panel.querySelector('[data-bx-week-change]');
      changeNode.hidden = change === null || change === undefined || previousValue === null || previousValue === undefined;
      if (!changeNode.hidden) {
        if (!Number.isFinite(change)) throw new Error('Invalid weekly change');
        const direction = change > 0 ? labels.increase : labels.decrease;
        const comparison = change === 0 ? labels.noChange : `${number.format(Math.abs(change))}%${direction}`;
        changeNode.textContent = `${labels.previousPeriod} ${decimal.format(previousValue)} ${labels.perVisitorUnit} → ${comparison}`;
        changeNode.classList.toggle('bx-usage__change--up', change > 0);
      }
    }
    renderGeography(countries7d);
    countries.replaceChildren();
    if (recent30m.level === 'count') {
      for (const [index, row] of countryRows.slice(0, 3).entries()) {
        const chip = document.createElement('span');
        chip.className = 'bx-usage__country';
        chip.dataset.bxCountry = row.code;
        const countLabel = labels.countryCount.replace('{count}', number.format(row.users));
        chip.textContent = `${flagFor(row.code)} ${row.code} ${countLabel}${index === 0 ? labels.flagNote : ''}`;
        countries.append(chip);
      }
    }
    renderWalkers(recent30m.level === 'count' ? recent30m.activeUsers : null, countryRows);
    panel.hidden = false;
    scheduleIntro();
  }

  function renderError() {
    recent.hidden = true;
    history.hidden = true;
    month.hidden = true;
    perVisitor.hidden = true;
    geography.hidden = true;
    renderRestoreFlag(null);
    countries.hidden = true;
    renderWalkers(null, []);
    status.textContent = labels.unavailable;
    status.hidden = false;
    panel.hidden = false;
    scheduleIntro();
  }

  function scheduleIntro() {
    if (!introActive || introTimer) return;
    introTimer = setTimeout(() => {
      introActive = false;
      setIconOnly(true);
      schedule();
      window.dispatchEvent(new CustomEvent('bx-usage-collapsed'));
    }, 5_000);
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(refresh, iconOnly ? 300_000 : 60_000);
  }

  async function refresh() {
    if (document.hidden) return;
    controller?.abort();
    controller = new AbortController();
    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!response.ok) throw new Error('Usage unavailable');
      const data = await response.json();
      if (iconOnly) renderRestoreFlag(data?.recent30m);
      else render(data);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        if (iconOnly) renderRestoreFlag(null);
        else renderError();
      }
    } finally {
      schedule();
    }
  }

  function setCompact(compact) {
    panel.classList.toggle('bx-usage--compact', compact);
    panel.querySelector('.bx-usage__title').textContent = compact ? labels.compactTitle : labels.title;
    expand.hidden = !compact;
  }

  function setIconOnly(value) {
    iconOnly = value;
    panel.classList.toggle('bx-usage--icon-only', value);
    restore.hidden = !value;
    if (value) panel.hidden = false;
  }

  panel.querySelector('[data-bx-usage-close]').addEventListener('click', () => {
    controller?.abort();
    clearTimeout(timer);
    clearTimeout(introTimer);
    introActive = false;
    manuallyExpanded = false;
    setIconOnly(true);
    refresh();
    try { sessionStorage.setItem(iconOnlyKey, '1'); } catch { /* Keep the icon for this page. */ }
    window.dispatchEvent(new CustomEvent('bx-usage-collapsed'));
  });
  restore.addEventListener('click', () => {
    introActive = false;
    setIconOnly(false);
    manuallyExpanded = true;
    expandedAtY = window.scrollY;
    setCompact(false);
    try {
      sessionStorage.removeItem(iconOnlyKey);
      sessionStorage.removeItem('bx-usage-dismissed-v1');
    } catch { /* Reopen this page even if storage is unavailable. */ }
    refresh();
    window.dispatchEvent(new CustomEvent('bx-usage-expanded'));
  });
  expand.addEventListener('click', () => {
    clearTimeout(introTimer);
    introActive = false;
    manuallyExpanded = true;
    expandedAtY = window.scrollY;
    setCompact(false);
    window.dispatchEvent(new CustomEvent('bx-usage-expanded'));
  });
  const shouldCompact = () => !introActive && (window.scrollY > 240 || window.matchMedia('(max-width: 480px)').matches)
    && !manuallyExpanded;
  window.addEventListener('scroll', () => {
    if (manuallyExpanded && Math.abs(window.scrollY - expandedAtY) > 120) manuallyExpanded = false;
    setCompact(shouldCompact());
  }, { passive: true });
  window.addEventListener('resize', () => setCompact(shouldCompact()));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timer);
      controller?.abort();
    } else {
      refresh();
    }
  });
  window.addEventListener('pagehide', () => {
    clearTimeout(timer);
    clearTimeout(introTimer);
    controller?.abort();
  });
  setCompact(shouldCompact());
  setIconOnly(iconOnly);
  refresh();
})();
