// --------------- //
// HEADER - IFRAME //
// --------------- //

const headerFrame = document.querySelector('.header-frame');

window.addEventListener('message', (event) => {
  if (event.source !== headerFrame.contentWindow) {
    return;
  }

  const message = event.data;
  if (message?.type !== 'header-menu' || typeof message.open !== 'boolean') {
    return;
  }

  headerFrame.classList.toggle('sidebar-open', message.open);
});

// Header function

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');
  const navServ = document.querySelector('.nav-services');
  const sublink = navServ?.querySelector('.sublink');

  if (!toggle || !menu) return;

  const fecharMenu = () => {
    toggle.classList.remove('ativo');
    menu.classList.remove('aberto');
    document.body.classList.remove('menu-aberto');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    toggle.classList.toggle('ativo', aberto);
    document.body.classList.toggle('menu-aberto', aberto);
    toggle.setAttribute('aria-expanded', aberto);
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