const API_BASE = 'https://fakestoreapi.com';

export async function getAllProducts(){
  const url = `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  return data.map(p => ({
    id: p.id,
    title: p.title,
    price: Number(p.price),
    category: p.category,
    description: p.description,
    image: p.image,
    rating: p.rating
  }));
}
