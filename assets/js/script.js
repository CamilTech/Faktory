// --------------- //
// HEADER - IFRAME //
// --------------- //

const headerFrame = document.querySelector('.header-iframe');
const footerFrame = document.querySelector('.footer-iframe');
let headerMenuOpen = false;
let headerServicesOpen = false;
let headerServicesHeight = 75;

const updateHeaderFrame = () => {
  if (!headerFrame) return;

  if (headerMenuOpen || headerServicesOpen) {
    const height = headerMenuOpen ? '100vh' : `${headerServicesHeight}px`;
    headerFrame.style.setProperty('height', height, 'important');
    headerFrame.style.setProperty('z-index', '1100', 'important');
  } else {
    headerFrame.style.removeProperty('height');
    headerFrame.style.removeProperty('z-index');
  }
};

window.addEventListener('message', (event) => {
  const message = event.data;
  if (headerFrame && event.source === headerFrame.contentWindow &&
      message?.type === 'header-menu' && typeof message.open === 'boolean') {
    headerMenuOpen = message.open;
    document.body.classList.toggle('menu-aberto', message.open);
    updateHeaderFrame();
  }

  if (headerFrame && event.source === headerFrame.contentWindow &&
      message?.type === 'header-services' && typeof message.open === 'boolean') {
    headerServicesOpen = message.open;
    if (message.open && Number.isFinite(message.height)) {
      headerServicesHeight = Math.max(75, Math.ceil(message.height));
    }
    updateHeaderFrame();
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
  const submenu = navServ?.querySelector('.submenu');
  let pointerOverServices = false;

  if (!toggle || !menu) return;

  const reportMenuState = (open) => {
    window.parent.postMessage({ type: 'header-menu', open }, '*');
  };

  const reportServicesState = () => {
    if (!navServ || !submenu) return;

    const open = pointerOverServices ||
      navServ.contains(document.activeElement) ||
      (window.matchMedia('(max-width: 992px)').matches &&
        navServ.classList.contains('aberto'));
    window.parent.postMessage({
      type: 'header-services',
      open,
      height: submenu.getBoundingClientRect().bottom
    }, '*');
  };

  const fecharMenu = () => {
    const estavaAberto = menu.classList.contains('aberto');
    toggle.classList.remove('ativo');
    menu.classList.remove('aberto');
    document.body.classList.remove('menu-aberto');
    toggle.setAttribute('aria-expanded', 'false');
    if (estavaAberto) {
      pointerOverServices = false;
      navServ?.classList.remove('aberto');
      reportServicesState();
      reportMenuState(false);
    }
  };

  navServ?.addEventListener('pointerenter', () => {
    pointerOverServices = true;
    reportServicesState();
  });
  navServ?.addEventListener('pointerleave', () => {
    pointerOverServices = false;
    reportServicesState();
  });
  navServ?.addEventListener('focusin', reportServicesState);
  navServ?.addEventListener('focusout', () => requestAnimationFrame(reportServicesState));

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('aberto')) {
      fecharMenu();
      return;
    }

    menu.classList.add('aberto');
    toggle.classList.add('ativo');
    document.body.classList.add('menu-aberto');
    toggle.setAttribute('aria-expanded', 'true');
    reportMenuState(true);
  });

  sublink?.addEventListener('click', (e) => {
    e.preventDefault();
    navServ.classList.toggle('aberto');
    reportServicesState();
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