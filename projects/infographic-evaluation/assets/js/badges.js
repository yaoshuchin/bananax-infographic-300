/**
 * Badge & Encouragement System for BananaX
 * アクション応援機能
 */

// LocalStorage Keys
const KEY_ACTION_STATS = 'bx_action_stats';
const KEY_ENCOURAGE_COOLDOWN = 'bx_encourage_cooldown';

// Cooldown between encouragement toasts (ms)
const COOLDOWN_MS = 5000;

// Badge Definitions
const BADGES = {
  first_copy: {
    id: 'first_copy',
    icon: 'clipboard-check',
    color: '#4CAF50',
    criteria: { action: 'copy', threshold: 1 },
    name: { ja: 'はじめてのコピー', en: 'First Copy', ko: '첫 복사', zh: '首次复制' },
    desc: { ja: 'プロンプトを初めてコピー！', en: 'Copied your first prompt!', ko: '첫 프롬프트 복사!', zh: '首次复制提示词!' }
  },
  copy_master: {
    id: 'copy_master',
    icon: 'copy',
    color: '#FFB300',
    criteria: { action: 'copy', threshold: 10 },
    name: { ja: 'コピーの達人', en: 'Copy Master', ko: '복사 달인', zh: '复制达人' },
    desc: { ja: '10回コピーを達成！', en: '10 copies achieved!', ko: '10회 복사 달성!', zh: '达成10次复制!' }
  },
  collector: {
    id: 'collector',
    icon: 'heart',
    color: '#E55039',
    criteria: { action: 'fav_add', threshold: 5 },
    name: { ja: 'コレクター', en: 'Collector', ko: '컬렉터', zh: '收藏家' },
    desc: { ja: '5つのお気に入りを登録！', en: '5 favorites saved!', ko: '즐겨찾기 5개 등록!', zh: '收藏5个!' }
  },
  super_collector: {
    id: 'super_collector',
    icon: 'trophy',
    color: '#9C27B0',
    criteria: { action: 'fav_add', threshold: 20 },
    name: { ja: 'スーパーコレクター', en: 'Super Collector', ko: '슈퍼 컬렉터', zh: '超级收藏家' },
    desc: { ja: '20のお気に入りを達成！', en: '20 favorites achieved!', ko: '즐겨찾기 20개 달성!', zh: '达成20个收藏!' }
  },
  explorer: {
    id: 'explorer',
    icon: 'compass',
    color: '#2196F3',
    criteria: { action: 'modal_open', threshold: 10 },
    name: { ja: '探検家', en: 'Explorer', ko: '탐험가', zh: '探索者' },
    desc: { ja: '10個のスタイルを詳しく見た！', en: 'Explored 10 styles in detail!', ko: '10개의 스타일을 자세히 봤어요!', zh: '详细查看了10个样式!' }
  },
  deep_diver: {
    id: 'deep_diver',
    icon: 'anchor',
    color: '#00BCD4',
    criteria: { action: 'scroll_explore', threshold: 3 },
    name: { ja: 'ディープダイバー', en: 'Deep Diver', ko: '딥 다이버', zh: '深潜者' },
    desc: { ja: 'ページの奥までスクロール！', en: 'Scrolled to the depths!', ko: '페이지 끝까지 스크롤!', zh: '滚动到页面深处!' }
  }
};

// Encouragement Messages
const ENCOURAGEMENT_MESSAGES = {
  copy: {
    ja: ['いいね！', 'ナイス選択！', 'コピー完了！', 'さっそく試してみよう！', 'グッドチョイス！'],
    en: ['Nice!', 'Great pick!', 'Copied!', 'Try it out!', 'Good choice!'],
    ko: ['좋아요!', '나이스!', '복사 완료!', '바로 사용해보세요!'],
    zh: ['不错！', '好选择！', '复制成功！', '快去试试吧！']
  },
  fav_add: {
    ja: ['お気に入り登録！', 'コレクション追加！', 'いつでも使えるね！', 'ナイスセーブ！'],
    en: ['Saved!', 'Added to collection!', 'Ready when you need it!', 'Nice save!'],
    ko: ['즐겨찾기 추가!', '컬렉션에 추가!', '언제든 사용 가능!'],
    zh: ['已收藏！', '加入收藏夹！', '随时可用！']
  },
  modal_open: {
    ja: ['詳しく見てみよう！', 'いい目利き！', 'じっくり検討中...'],
    en: ['Taking a closer look!', 'Good eye!', 'Checking it out...'],
    ko: ['자세히 살펴보세요!', '좋은 안목!', '검토 중...'],
    zh: ['仔细看看！', '好眼光！', '正在查看...']
  },
  scroll_explore: {
    ja: ['探検中...', 'どんどん見ていこう！', '新発見あるかも？'],
    en: ['Exploring...', 'Keep going!', 'Discoveries await!'],
    ko: ['탐험 중...', '계속 둘러보세요!', '새 발견이 있을지도?'],
    zh: ['探索中...', '继续看看！', '也许有新发现？']
  },
  badge_unlock: {
    ja: ['バッジ獲得！「{badge}」'],
    en: ['Badge unlocked! "{badge}"'],
    ko: ['배지 획득! "{badge}"'],
    zh: ['获得徽章！"{badge}"']
  }
};

// Get current language
function getCurrentLang() {
  const lang = document.documentElement.lang || 'ja';
  return ['ja', 'en', 'ko', 'zh'].includes(lang) ? lang : 'ja';
}

// Get action stats from localStorage
function getActionStats() {
  try {
    return JSON.parse(localStorage.getItem(KEY_ACTION_STATS) || '{}');
  } catch {
    return {};
  }
}

// Save action stats to localStorage
function setActionStats(stats) {
  localStorage.setItem(KEY_ACTION_STATS, JSON.stringify(stats));
}

// Check if encouragement can be shown (cooldown)
function canShowEncouragement() {
  const lastShown = parseInt(localStorage.getItem(KEY_ENCOURAGE_COOLDOWN) || '0');
  return Date.now() - lastShown > COOLDOWN_MS;
}

// Record encouragement shown
function recordEncouragementShown() {
  localStorage.setItem(KEY_ENCOURAGE_COOLDOWN, Date.now().toString());
}

// Get random message for action type
function getRandomMessage(actionType, lang) {
  lang = lang || getCurrentLang();
  const messages = ENCOURAGEMENT_MESSAGES[actionType]?.[lang] || ENCOURAGEMENT_MESSAGES[actionType]?.ja || [];
  if (messages.length === 0) return null;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Show encouragement toast
function showEncouragementToast(actionType) {
  if (!canShowEncouragement()) return;

  const message = getRandomMessage(actionType);
  if (message && typeof showToast === 'function') {
    showToast(message, 1500, 'encouragement');
    recordEncouragementShown();
  }
}

// Check and unlock badges
function checkBadgeUnlock(actionType, stats) {
  const lang = getCurrentLang();
  const earnedBadges = stats.badges_earned || [];

  Object.values(BADGES).forEach(badge => {
    if (badge.criteria.action === actionType && !earnedBadges.includes(badge.id)) {
      const count = stats[actionType] || 0;
      if (count >= badge.criteria.threshold) {
        // Unlock badge
        earnedBadges.push(badge.id);
        stats.badges_earned = earnedBadges;
        setActionStats(stats);

        // Show badge unlock toast
        const badgeName = badge.name[lang] || badge.name.ja;
        const unlockMsg = ENCOURAGEMENT_MESSAGES.badge_unlock[lang]?.[0] || ENCOURAGEMENT_MESSAGES.badge_unlock.ja[0];
        const message = unlockMsg.replace('{badge}', badgeName);

        if (typeof showToast === 'function') {
          showToast(message, 3000, 'badge-unlock');
        }

        // Update UI
        updateBadgeCount();
        renderBadgesPanel();

        // Analytics
      }
    }
  });
}

// Increment action count
function incrementAction(actionType) {
  const stats = getActionStats();
  stats[actionType] = (stats[actionType] || 0) + 1;
  if (!stats.badges_earned) stats.badges_earned = [];
  setActionStats(stats);

  checkBadgeUnlock(actionType, stats);
  showEncouragementToast(actionType);

  return stats[actionType];
}

// Update badge count in trigger
function updateBadgeCount() {
  const stats = getActionStats();
  const count = (stats.badges_earned || []).length;
  const countEl = document.getElementById('badge-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'inline' : 'none';
  }
}

// Toggle badges panel
function toggleBadgesPanel() {
  const panel = document.getElementById('badges-panel');
  if (panel) {
    panel.classList.toggle('active');
  }
}

// Close badges panel
function closeBadgesPanel() {
  const panel = document.getElementById('badges-panel');
  if (panel) {
    panel.classList.remove('active');
  }
}

// Render badges panel
function renderBadgesPanel() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;

  const stats = getActionStats();
  const earnedBadges = stats.badges_earned || [];
  const lang = getCurrentLang();

  grid.innerHTML = '';

  Object.values(BADGES).forEach(badge => {
    const isEarned = earnedBadges.includes(badge.id);
    const badgeName = badge.name[lang] || badge.name.ja;
    const badgeDesc = badge.desc[lang] || badge.desc.ja;

    const item = document.createElement('div');
    item.className = `badge-item ${isEarned ? 'earned' : 'locked'}`;
    item.title = isEarned ? `${badgeName}: ${badgeDesc}` : `??? (${badgeDesc})`;
    item.style.setProperty('--badge-color', badge.color);

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', badge.icon);
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.color = isEarned ? badge.color : '#999';

    item.appendChild(icon);

    // Tap/click feedback to reduce dead clicks on badge items (especially mobile)
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof showToast === 'function') {
        const message = isEarned ? `${badgeName}: ${badgeDesc}` : `🔒 ${badgeDesc}`;
        showToast(message, 1800, 'encouragement');
      }
    });

    grid.appendChild(item);
  });

  // Re-render Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// Initialize badge system
function initBadgeSystem() {
  updateBadgeCount();
  renderBadgesPanel();

  // Close panel when clicking outside (exclude badges-trigger to avoid open→close race)
  document.addEventListener('click', (e) => {
    const container = document.getElementById('badges-panel');
    const trigger = e.target.closest('.badges-trigger');
    if (trigger) return; // let toggleBadgesPanel handle it
    if (container && !container.contains(e.target)) {
      closeBadgesPanel();
    }
  });
}

// Export to window
window.incrementAction = incrementAction;
window.getActionStats = getActionStats;
window.toggleBadgesPanel = toggleBadgesPanel;
window.closeBadgesPanel = closeBadgesPanel;
window.initBadgeSystem = initBadgeSystem;
window.updateBadgeCount = updateBadgeCount;
window.renderBadgesPanel = renderBadgesPanel;
