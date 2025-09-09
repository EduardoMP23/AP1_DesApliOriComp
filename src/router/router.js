export function initRouter({ routes = {} } = {}){
  function resolve(){
    const hash = location.hash || '#/products';
    const path = hash.slice(1);
    const handler = routes[path] || routes['*'];
    handler?.();
  }
  addEventListener('hashchange', resolve);
  resolve();
}

export function navigateTo(path){
  if (!path.startsWith('/')) path = '/' + path;
  if (location.hash !== '#' + path){
    location.hash = path;
  }else{
    dispatchEvent(new HashChangeEvent('hashchange'));
  }
}
