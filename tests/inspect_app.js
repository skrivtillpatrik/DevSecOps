import app from '../backend/index.js';

function listRoutes() {
  const stack = app._router && app._router.stack ? app._router.stack : [];
  const routes = [];
  for (const layer of stack) {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      routes.push({ path: layer.route.path, methods });
    } else if (layer.name === 'router' && layer.handle && layer.regexp) {
      routes.push({ name: 'router', regexp: layer.regexp.toString() });
    } else {
      routes.push({ name: layer.name });
    }
  }
  console.log('Registered app stack:');
  console.dir(routes, { depth: null });
}

listRoutes();
