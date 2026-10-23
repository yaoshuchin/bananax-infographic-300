(function () {
    function supportsSpeculationRules() {
        return HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules');
    }

    function collectLanguageUrls() {
        const seen = new Set();
        return Array.from(document.querySelectorAll('.lang-switch'))
            .map((link) => {
                const href = link.getAttribute('href');
                if (!href) return null;
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return null;
                const normalized = url.toString();
                if (seen.has(normalized)) return null;
                seen.add(normalized);
                return normalized;
            })
            .filter(Boolean);
    }

    function injectSpeculationRules(urls) {
        if (!supportsSpeculationRules() || !urls.length) return;
        if (document.querySelector('script[data-bx-speculation-rules]')) return;

        const rules = {
            prefetch: [
                {
                    source: 'list',
                    urls: urls,
                    eagerness: 'moderate'
                }
            ]
        };

        const script = document.createElement('script');
        script.type = 'speculationrules';
        script.dataset.bxSpeculationRules = 'true';
        script.textContent = JSON.stringify(rules);
        document.head.appendChild(script);
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectSpeculationRules(collectLanguageUrls());
    });
})();
