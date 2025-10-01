import { useRegisterSW } from 'virtual:pwa-register/react'

function PWABadge() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log(`Service Worker registrado: ${r}`)
    },
    onRegisterError(error) {
      console.log('Erro no registro do Service Worker:', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div
      className="fixed right-0 bottom-0 m-4 p-4 rounded-lg shadow-lg bg-gray-800 text-white z-50 border border-gray-600"
      role="status"
      aria-live="polite"
    >
      <div className="mb-2">
        {offlineReady
          ? <span>App pronto para funcionar offline.</span>
          : <span>Nova versão disponível, clique para atualizar!</span>
        }
      </div>
      {needRefresh && (
        <button
          className="py-1 px-3 border-none rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={() => updateServiceWorker(true)}
        >
          Atualizar
        </button>
      )}
      <button className="ml-2 py-1 px-3 border-none rounded-md bg-gray-600 hover:bg-gray-700" onClick={close}>
        Fechar
      </button>
    </div>
  )
}

export default PWABadge
