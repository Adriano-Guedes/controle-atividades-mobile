//src/serviceWorkerRegistration.js

// Esse é o service worker padrão do CRA
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] é o endereço localhost IPv6.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 são endereços localhost IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
  
  export function register() {
    if ('serviceWorker' in navigator) {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
      if (isLocalhost) {
        // Verifica se o SW existe e é válido
        checkValidServiceWorker(swUrl);
        navigator.serviceWorker.ready.then(() => {
          console.log('Service worker pronto (modo dev).');
        });
      } else {
        // Registra diretamente
        registerValidSW(swUrl);
      }
    }
  }
  
  function registerValidSW(swUrl) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(error => {
        console.error('Erro ao registrar o SW:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl) {
    fetch(swUrl)
      .then(response => {
        if (
          response.status === 404 ||
          response.headers.get('content-type')?.indexOf('javascript') === -1
        ) {
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl);
        }
      })
      .catch(() => {
        console.log('Sem conexão com internet. Rodando offline.');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.unregister();
        })
        .catch(error => {
          console.error(error.message);
        });
    }
  }
  