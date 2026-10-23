(() => {
  const panel = document.querySelector('[data-bx-usage]');
  const mount = panel?.querySelector('[data-bx-greetings]');
  if (!mount) return;

  const endpoint = 'https://bananax-usage.flock-h.workers.dev/greetings';
  const translations = {
    ja: { button: 'あいさつ', today: '今日のあいさつ', sent: '今日はあいさつ済み',
      sending: '送信中…', failed: 'あいさつを送れませんでした。もう一度お試しください',
      unavailable: 'あいさつを読み込めません', newWave: '新しいあいさつが届きました',
      welcome: '歓迎役3人を含む', unit: '件' },
    en: { button: 'Wave hello', today: "Today's greetings", sent: 'You waved today',
      sending: 'Sending…', failed: 'Could not send your wave. Please try again',
      unavailable: 'Greetings are unavailable', newWave: 'A new greeting arrived',
      welcome: 'Includes 3 welcome guests', unit: '' },
    ko: { button: '인사하기', today: '오늘의 인사', sent: '오늘 인사했어요',
      sending: '보내는 중…', failed: '인사를 보내지 못했습니다. 다시 시도해 주세요',
      unavailable: '인사를 불러올 수 없습니다', newWave: '새 인사가 도착했어요',
      welcome: '환영 손님 3명 포함', unit: '건' },
    'zh-Hant': { button: '打招呼', today: '今天的問候', sent: '今天已打招呼',
      sending: '傳送中…', failed: '無法送出問候，請再試一次',
      unavailable: '目前無法讀取問候', newWave: '收到新的問候',
      welcome: '包含 3 位迎賓角色', unit: '次' },
  };
  const lang = document.documentElement.lang in translations ? document.documentElement.lang : 'ja';
  const labels = translations[lang];
  const formatter = new Intl.NumberFormat(lang === 'zh-Hant' ? 'zh-TW' : lang);
  const flags = { JP: '🇯🇵', KR: '🇰🇷', TW: '🇹🇼', other: '' };
  const regions = Object.keys(flags);
  const visitorIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

  mount.className = 'bx-greeting';
  mount.innerHTML = `
    <div class="bx-greeting__heading">
      <strong data-bx-greeting-title></strong>
      <span class="bx-greeting__count" data-bx-greeting-count></span>
    </div>
    <div class="bx-greeting__stage">
      <div class="bx-greeting__walkers" data-bx-greeting-walkers aria-hidden="true"></div>
      <div class="bx-greeting__live" data-bx-greeting-live aria-live="polite"></div>
    </div>
    <div class="bx-greeting__recent" data-bx-greeting-recent aria-label="${labels.today}"></div>
    <p class="bx-greeting__welcome"></p>
    <button class="bx-greeting__button" type="button" data-bx-greeting-button disabled></button>
    <p class="bx-greeting__status" data-bx-greeting-status role="status" hidden></p>`;
  mount.querySelector('[data-bx-greeting-title]').textContent = labels.today;
  mount.querySelector('.bx-greeting__welcome').textContent = labels.welcome;
  const countNode = mount.querySelector('[data-bx-greeting-count]');
  const crowdNode = mount.querySelector('[data-bx-greeting-walkers]');
  const liveNode = mount.querySelector('[data-bx-greeting-live]');
  const recentNode = mount.querySelector('[data-bx-greeting-recent]');
  const button = mount.querySelector('[data-bx-greeting-button]');
  const status = mount.querySelector('[data-bx-greeting-status]');

  let currentDay = null;
  let lastSeq = null;
  let record = null;
  let loading = false;
  let sending = false;
  let failures = 0;
  let timer = null;
  let waveTimer = null;
  let readController = null;
  let postController = null;
  let alive = true;

  function active() {
    return alive && !document.hidden && !panel.classList.contains('bx-usage--icon-only');
  }

  function setStatus(message) {
    status.hidden = !message;
    status.textContent = message || '';
  }

  function updateButton() {
    button.textContent = record?.accepted ? labels.sent : labels.button;
    button.disabled = !currentDay || record?.accepted || sending || loading || !active();
    button.setAttribute('aria-label', button.textContent);
  }

  function loadRecord(day) {
    try {
      const stored = JSON.parse(localStorage.getItem(`bx_greeting_${day}`));
      if (stored && visitorIdPattern.test(stored.visitorId) && typeof stored.accepted === 'boolean') {
        return { day, visitorId: stored.visitorId, accepted: stored.accepted };
      }
    } catch { /* Keep the ID in memory when storage is unavailable. */ }
    if (record?.day === day) return record;
    return { day, visitorId: null, accepted: false };
  }

  function saveRecord(value) {
    record = value;
    try {
      localStorage.setItem(`bx_greeting_${value.day}`, JSON.stringify({
        visitorId: value.visitorId, accepted: value.accepted,
      }));
    } catch { /* A retry in this page still uses the in-memory ID. */ }
  }

  function validate(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(data?.day) || !Number.isSafeInteger(data.lastSeq) || data.lastSeq < 0 ||
        !Array.isArray(data.recent) || data.recent.length > 20 || !data.counts ||
        !regions.every(region => Number.isSafeInteger(data.counts[region]) && data.counts[region] >= 0) ||
        !data.recent.every(row => Number.isSafeInteger(row?.sequence) && row.sequence > 0 &&
          regions.includes(row.region) && typeof row.at === 'string')) {
      throw new Error('Invalid greeting response');
    }
    return data;
  }

  function welcomeRegions(day) {
    let hash = 2166136261;
    for (const character of day) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    return [['JP', 'KR'], ['JP', 'TW'], ['KR', 'TW']][(hash >>> 0) % 3];
  }

  function renderCrowd(total, day) {
    const people = total < 15 ? 3 : total < 40 ? 4 : 5;
    const welcome = welcomeRegions(day);
    crowdNode.replaceChildren();
    for (let index = 0; index < people; index++) {
      const person = document.createElement('span');
      person.className = `bx-greeting__walker${index < 3 ? ' bx-greeting__walker--host' : ''}`;
      person.textContent = index % 2 === 0 ? '🚶‍♀️' : '🚶‍♂️';
      if (index < 2) {
        person.dataset.region = welcome[index];
        const flag = document.createElement('span');
        flag.className = 'bx-greeting__flag';
        flag.textContent = flags[welcome[index]];
        person.append(flag);
      }
      person.style.animationDelay = `${index * 0.16}s`;
      crowdNode.append(person);
    }
  }

  function showWaves(events) {
    clearTimeout(waveTimer);
    liveNode.replaceChildren();
    for (const event of events.slice(-3)) {
      const wave = document.createElement('span');
      wave.className = 'bx-greeting__wave';
      wave.textContent = `${flags[event.region]}👋`;
      liveNode.append(wave);
    }
    if (events.length) liveNode.setAttribute('aria-label', labels.newWave);
    waveTimer = setTimeout(() => { liveNode.replaceChildren(); liveNode.removeAttribute('aria-label'); }, 2_800);
  }

  function renderSnapshot(raw, animate = true) {
    const data = validate(raw);
    if (data.day !== currentDay) {
      currentDay = data.day;
      lastSeq = null;
      record = loadRecord(data.day);
      if (!record.visitorId) saveRecord({ ...record, visitorId: crypto.randomUUID() });
      liveNode.replaceChildren();
    }
    const newEvents = lastSeq === null || data.lastSeq < lastSeq ? []
      : data.recent.filter(event => event.sequence > lastSeq);
    lastSeq = data.lastSeq;
    const total = 3 + regions.reduce((sum, region) => sum + data.counts[region], 0);
    countNode.textContent = `${formatter.format(total)}${labels.unit}`;
    renderCrowd(total, data.day);
    recentNode.replaceChildren();
    for (const event of data.recent.slice(-3).reverse()) {
      const item = document.createElement('span');
      item.className = 'bx-greeting__recent-item';
      item.textContent = `${flags[event.region]}👋`;
      recentNode.append(item);
    }
    recentNode.hidden = data.recent.length === 0;
    if (animate && newEvents.length) showWaves(newEvents);
    updateButton();
  }

  function clearRead() {
    clearTimeout(timer);
    timer = null;
    readController?.abort();
    readController = null;
  }

  function schedule() {
    clearTimeout(timer);
    if (!active()) return;
    const base = panel.classList.contains('bx-usage--compact') ? 30_000 : 15_000;
    const delay = failures ? Math.min(60_000, base * 2 ** Math.min(failures, 3)) : base;
    timer = setTimeout(refresh, delay);
  }

  async function refresh() {
    if (!active() || sending) return;
    clearRead();
    const controller = new AbortController();
    readController = controller;
    loading = true;
    updateButton();
    try {
      const response = await fetch(endpoint, { signal: controller.signal, cache: 'no-store', credentials: 'omit' });
      if (!response.ok) throw new Error('Greeting read failed');
      const data = await response.json();
      if (!active() || controller.signal.aborted) return;
      renderSnapshot(data);
      failures = 0;
      setStatus('');
    } catch (error) {
      if (error?.name !== 'AbortError' && active()) {
        failures++;
        setStatus(labels.unavailable);
      }
    } finally {
      if (readController === controller) {
        readController = null;
        loading = false;
        updateButton();
        schedule();
      }
    }
  }

  async function send() {
    if (button.disabled || !currentDay) return;
    record = loadRecord(currentDay);
    if (record.accepted) {
      updateButton();
      return;
    }
    clearRead();
    const visitorId = record?.visitorId || crypto.randomUUID();
    saveRecord({ day: currentDay, visitorId, accepted: false });
    const controller = new AbortController();
    postController = controller;
    sending = true;
    updateButton();
    setStatus(labels.sending);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }), cache: 'no-store', credentials: 'omit', signal: controller.signal,
      });
      if (!response.ok) throw new Error('Greeting send failed');
      const data = validate(await response.json());
      if (!active() || controller.signal.aborted) return;
      if (typeof data.accepted !== 'boolean') throw new Error('Invalid greeting result');
      renderSnapshot(data, data.accepted);
      saveRecord({ day: data.day, visitorId, accepted: true });
      failures = 0;
      setStatus('');
    } catch (error) {
      if (error?.name !== 'AbortError' && active()) setStatus(labels.failed);
    } finally {
      if (postController === controller) postController = null;
      sending = false;
      updateButton();
      schedule();
    }
  }

  button.addEventListener('click', send);
  window.addEventListener('storage', event => {
    if (!currentDay || event.key !== `bx_greeting_${currentDay}`) return;
    const latest = loadRecord(currentDay);
    if (latest.accepted || !record?.accepted) {
      record = latest;
      updateButton();
    }
  });
  window.addEventListener('bx-usage-collapsed', () => {
    clearRead();
    postController?.abort();
    liveNode.replaceChildren();
    updateButton();
  });
  window.addEventListener('bx-usage-expanded', refresh);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearRead();
      postController?.abort();
      liveNode.replaceChildren();
    } else refresh();
  });
  window.addEventListener('pagehide', () => {
    alive = false;
    clearRead();
    clearTimeout(waveTimer);
    postController?.abort();
  });
  updateButton();
  if (active()) refresh();
})();
