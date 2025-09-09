import { isFavorite } from '../storage/favorites.js';

export function createProductCard(product, fav){
  const el = document.createElement('article');
  el.className = 'card';
  el.setAttribute('data-id', product.id);

  const rating = product.rating?.rate ?? 0;
  const count = product.rating?.count ?? 0;
  const isFav = fav ?? isFavorite(product.id);

  el.innerHTML = `
    <div class="card-media">
      <img loading="lazy" alt="" src="${product.image}"/>
    </div>
    <div class="card-body">
      <div class="card-title" title="${escapeHtml(product.title)}">${escapeHtml(product.title)}</div>
      <div class="card-meta">
        <span class="badge">${escapeHtml(product.category)}</span>
        <span title="Avaliação média">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5-Math.round(rating))} <span class="muted">(${count})</span></span>
      </div>
      <div class="card-price">US$ ${product.price.toFixed(2)}</div>
      <div class="actions">
        <button class="btn btn-like" type="button" aria-pressed="${isFav}" aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          <span class="heart ${isFav ? 'on' : ''}" aria-hidden="true">♥</span>
          <span>${isFav ? 'Favorito' : 'Favoritar'}</span>
        </button>
        <a class="btn" href="#" role="button" aria-disabled="true" title="Ação demonstrativa">Detalhes</a>
      </div>
    </div>
  `;

  const likeBtn = el.querySelector('.btn-like');
  likeBtn.addEventListener('click', ()=>{
    el.dispatchEvent(new CustomEvent('toggle-favorite', { bubbles:true, detail:{ id: product.id } }));
    const heart = el.querySelector('.heart');
    const nowOn = heart.classList.contains('on');
    likeBtn.setAttribute('aria-pressed', String(nowOn));
    likeBtn.setAttribute('aria-label', nowOn ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    likeBtn.lastElementChild.textContent = nowOn ? 'Favorito' : 'Favoritar';
  });

  return el;
}

function escapeHtml(str=''){
  return str
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
