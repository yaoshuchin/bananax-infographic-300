// Preserve the selected style and category when comparing BananaX versions.
(() => {
  const navigation = document.querySelector('.bx-version-switch');
  if (!navigation) return;
  function updateLinks() {
    const current = new URL(window.location.href);
    for (const link of navigation.querySelectorAll('a')) {
      const target = new URL(link.href);
      for (const key of ['id', 'tab']) {
        if (current.searchParams.has(key)) target.searchParams.set(key, current.searchParams.get(key));
        else target.searchParams.delete(key);
      }
      target.hash = current.hash;
      link.href = target.href;
    }
  }
  updateLinks();
  navigation.addEventListener('click', updateLinks);
  navigation.addEventListener('focusin', updateLinks);
  window.addEventListener('popstate', updateLinks);
})();
