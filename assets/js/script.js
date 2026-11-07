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