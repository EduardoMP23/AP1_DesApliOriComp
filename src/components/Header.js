export function createHeader({ onNavigate } = {}){
  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="#/products" data-link>
        <span class="logo" aria-hidden="true"></span>
        <span>FakeStore <span class="muted">SPA</span></span>
      </a>
      <nav class="nav" aria-label="Navegação principal">
        <a href="#/products" data-route="/products">Produtos</a>
        <a href="#/favorites" data-route="/favorites">
          Favoritos <span data-role="fav-badge" class="badge" aria-label="Quantidade de favoritos">0</span>
        </a>
      </nav>
    </div>
  `;

  function updateCurrent(){
    const hash = location.hash || '#/products';
    const route = hash.replace('#','');
    header.querySelectorAll('.nav a').forEach(a => {
      const is = a.getAttribute('data-route') === route;
      a.setAttribute('aria-current', is ? 'page' : 'false');
    });
  }
  updateCurrent();
  addEventListener('hashchange', updateCurrent);

  header.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      const route = a.getAttribute('data-route');
      onNavigate?.(route);
    });
  });

  return header;
}
