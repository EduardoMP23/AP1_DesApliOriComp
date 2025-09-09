const KEY = 'favorites:products';

export function getFavorites(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{ return []; }
}

function saveFavorites(list){
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isFavorite(id){
  return getFavorites().includes(id);
}

export function toggleFavorite(id){
  const list = new Set(getFavorites());
  if (list.has(id)){ list.delete(id); } else { list.add(id); }
  const arr = Array.from(list);
  saveFavorites(arr);
  return list.has(id);
}
