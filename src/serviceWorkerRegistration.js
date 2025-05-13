export function register(config) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          // Lógica de atualização opcional
        })
        .catch(error => {
          console.error('Erro ao registrar o service worker:', error);
        });
    });
  }
}
