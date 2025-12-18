/**
 * Баннер о переходе на новый сайт
 * Вставить в <head> старого сайта перед закрывающим </head>
 * 
 * Использование:
 * <script src="https://new.jaluzi-peterburg.ru/migration-banner.js" defer></script>
 * 
 * Или inline:
 * <script>
 * (function() {
 *   // Ваш код здесь
 * })();
 * </script>
 */

(function() {
  'use strict';

  // Проверяем, что мы не на новом сайте
  if (window.location.hostname === 'new.jaluzi-peterburg.ru' || 
      window.location.hostname === 'jaluzi-peterburg.ru' && document.querySelector('.new-site-indicator')) {
    return;
  }

  // Создаём баннер
  var banner = document.createElement('div');
  banner.id = 'migration-banner';
  banner.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'right: 0',
    'background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    'color: white',
    'padding: 12px 20px',
    'text-align: center',
    'z-index: 10000',
    'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'font-size: 14px',
    'box-shadow: 0 2px 8px rgba(0,0,0,0.15)'
  ].join(';');

  banner.innerHTML = [
    '<div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 15px; flex-wrap: wrap;">',
    '  <span style="font-weight: 500;">🎉 Мы переехали на новый сайт!</span>',
    '  <a href="https://jaluzi-peterburg.ru" style="color: white; text-decoration: underline; font-weight: 600;">Перейти на новый сайт →</a>',
    '  <button id="close-banner" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: auto;">✕</button>',
    '</div>'
  ].join('');

  // Добавляем отступ для body, чтобы контент не перекрывался
  document.body.style.paddingTop = '48px';

  // Вставляем баннер
  document.body.insertBefore(banner, document.body.firstChild);

  // Обработчик закрытия
  var closeBtn = document.getElementById('close-banner');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      banner.style.display = 'none';
      document.body.style.paddingTop = '0';
      // Сохраняем в localStorage, чтобы не показывать снова в этой сессии
      try {
        sessionStorage.setItem('migration-banner-closed', 'true');
      } catch(e) {}
    });
  }

  // Проверяем, был ли баннер закрыт ранее в этой сессии
  try {
    if (sessionStorage.getItem('migration-banner-closed') === 'true') {
      banner.style.display = 'none';
      document.body.style.paddingTop = '0';
    }
  } catch(e) {}
})();

