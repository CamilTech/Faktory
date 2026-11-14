// --------------- //
// HEADER - IFRAME //
// --------------- //

const headerFrame = document.querySelector('.header-iframe');
const footerFrame = document.querySelector('.footer-iframe');

window.addEventListener('message', (event) => {
  const message = event.data;
  if (headerFrame && event.source === headerFrame.contentWindow &&
      message?.type === 'header-menu' && typeof message.open === 'boolean') {
    if (message.open) {
      headerFrame.style.setProperty('height', '100vh', 'important');
      headerFrame.style.setProperty('z-index', '1100', 'important');
      document.body.classList.add('menu-aberto');
    } else {
      headerFrame.style.removeProperty('height');
      headerFrame.style.removeProperty('z-index');
      document.body.classList.remove('menu-aberto');
    }
  }

  if (footerFrame && event.source === footerFrame.contentWindow &&
      message?.type === 'footer-height' && Number.isFinite(message.height)) {
    footerFrame.style.height = `${message.height}px`;
  }
});

const footer = document.querySelector('.footer');
if (footer && window.parent !== window) {
  const reportFooterHeight = () => {
    window.parent.postMessage({
      type: 'footer-height',
      height: Math.ceil(document.documentElement.scrollHeight)
    }, '*');
  };

  if ('ResizeObserver' in window) {
    new ResizeObserver(reportFooterHeight).observe(footer);
  }
  window.addEventListener('load', reportFooterHeight);
  window.addEventListener('resize', reportFooterHeight);
  reportFooterHeight();
}

// Header function

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');
  const navServ = document.querySelector('.nav-services');
  const sublink = navServ?.querySelector('.sublink');

  if (!toggle || !menu) return;

  const reportMenuState = (open) => {
    window.parent.postMessage({ type: 'header-menu', open }, '*');
  };

  const fecharMenu = () => {
    const estavaAberto = menu.classList.contains('aberto');
    toggle.classList.remove('ativo');
    menu.classList.remove('aberto');
    document.body.classList.remove('menu-aberto');
    toggle.setAttribute('aria-expanded', 'false');
    if (estavaAberto) reportMenuState(false);
  };

  toggle.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    toggle.classList.toggle('ativo', aberto);
    document.body.classList.toggle('menu-aberto', aberto);
    toggle.setAttribute('aria-expanded', aberto);
    reportMenuState(aberto);
  });

  sublink?.addEventListener('click', (e) => {
    e.preventDefault();
    navServ.classList.toggle('aberto');
  });

  // Fecha ao clicar em qualquer link do menu
  menu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', fecharMenu)
  );

  // Fecha ao clicar FORA do menu (backdrop, body, qualquer elemento que não seja menu/toggle)
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('aberto')) return;
    if (menu.contains(e.target)) return;      // clique dentro do painel
    if (toggle.contains(e.target)) return;    // clique no hamburger
    fecharMenu();
  });
});