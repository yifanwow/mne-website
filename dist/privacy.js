// Progressive language switching only. Both full policies are readable without JavaScript.
(() => {
  const articles = [...document.querySelectorAll('[data-policy-language]')];
  const links = [...document.querySelectorAll('[data-language]')];
  const meta = document.querySelector('meta[name="description"]');
  const descriptions = {
    zh:'Mne 隐私政策：照片本地处理、Apple 服务、账号同步、默认使用统计、错误报告，以及权限和数据删除。',
    en:'Mne Privacy Policy: on-device photo processing, Apple services, account sync, default usage statistics, error reports, permissions and deletion.'
  };
  function fromHash() {
    if (/^#(?:privacy-)?en(?:-|$)/.test(location.hash)) return 'en';
    if (/^#(?:privacy-)?zh(?:-|$)/.test(location.hash)) return 'zh';
  }
  function apply(language, save = false) {
    if (!descriptions[language]) language = 'zh';
    articles.forEach(article => { article.hidden = article.dataset.policyLanguage !== language; });
    links.forEach(link => {
      if (link.dataset.language === language) link.setAttribute('aria-current','true');
      else link.removeAttribute('aria-current');
    });
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = language === 'zh' ? '隐私政策 — Mne' : 'Privacy Policy — Mne';
    meta.content = descriptions[language];
    if (save) { try { localStorage.setItem('mne-site-language', language); } catch {} }
  }
  let language = fromHash() || new URLSearchParams(location.search).get('lang');
  if (!language) { try { language = localStorage.getItem('mne-site-language'); } catch {} }
  apply(language || (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    apply(link.dataset.language, true);
    history.replaceState(null,'',link.hash);
    window.scrollTo({top:0,behavior:'instant'});
  }));
  window.addEventListener('hashchange',() => { const language = fromHash(); if (language) apply(language); });
})();
