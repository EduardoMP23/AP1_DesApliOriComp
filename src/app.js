import { createHeader } from './components/Header.js';
import { createProductCard } from './components/ProductCard.js';
import { getAllProducts } from './api/fakeStoreApi.js';
import { getFavorites, toggleFavorite, isFavorite } from './storage/favorites.js';
import { initRouter, navigateTo } from './router/router.js';
import { showSpinner, hideSpinner } from './ui/spinner.js';

const state = {
  products: [],
  filtered: [],
};

const headerRoot = document.getElementById('app-header');
const productsGrid = document.getElementById('products-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const filterInput = document.getElementById('filter-input');
const filterCount = document.getElementById('filter-count');

function renderProducts(list, intoEl){
  intoEl.innerHTML = '';
  if (!list.length){
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'Nenhum item encontrado.';
    intoEl.appendChild(empty);
    return;
  }
  const frag = document.createDocumentFragment();
  for (const p of list){
    const card = createProductCard(p, isFavorite(p.id));
    card.addEventListener('toggle-favorite', (ev) => {
      const { id } = ev.detail;
      const nowFav = toggleFavorite(id);
      card.querySelector('.heart').classList.toggle('on', nowFav);
      if (location.hash === '#/favorites' && !nowFav){
        card.remove();
        if (!favoritesGrid.children.length){
          const empty = document.createElement('div');
          empty.className = 'muted';
          empty.textContent = 'Sem favoritos ainda.';
          favoritesGrid.appendChild(empty);
        }
      }
      updateFavBadge();
    });
    frag.appendChild(card);
  }
  intoEl.appendChild(frag);
}

function applyFilter(){
  const q = filterInput.value.trim().toLowerCase();
  if (!q){
    state.filtered = state.products.slice();
  } else {
    state.filtered = state.products.filter(p => p.title.toLowerCase().includes(q));
  }
  renderProducts(state.filtered, productsGrid);
  filterCount.textContent = q ? `${state.filtered.length} resultado(s)` : '';
}

function debounce(fn, ms=250){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), ms);
  };
}

function updateFavBadge(){
  const count = getFavorites().length;
  const el = document.querySelector('[data-role="fav-badge"]');
  if (el) el.textContent = String(count);
}

async function bootstrap(){
  // Header
  const header = createHeader({
    onNavigate: (route) => navigateTo(route),
  });
  headerRoot.innerHTML = '';
  headerRoot.appendChild(header);
  updateFavBadge();

  // Router
  initRouter({
    routes: {
      '/products': () => {
        document.getElementById('page-products').style.display = '';
        document.getElementById('page-favorites').style.display = 'none';
        // Focus search when entering
        filterInput?.focus({ preventScroll: true });
      },
      '/favorites': () => {
        document.getElementById('page-products').style.display = 'none';
        document.getElementById('page-favorites').style.display = '';
        const favIds = new Set(getFavorites());
        const favList = state.products.filter(p => favIds.has(p.id));
        renderProducts(favList, favoritesGrid);
      },
      '*': () => navigateTo('/products')
    }
  });

  try{
    showSpinner();
    state.products = await getAllProducts();
    state.filtered = state.products.slice();
    renderProducts(state.filtered, productsGrid);
  }catch(err){
    console.error(err);
    productsGrid.innerHTML = '<div class="muted">Falha ao carregar produtos. Tente novamente.</div>';
  }finally{
    hideSpinner();
  }

  filterInput?.addEventListener('input', debounce(applyFilter, 200));
}

bootstrap();
