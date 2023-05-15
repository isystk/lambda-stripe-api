import '@/assets/sass/app.scss'
import { Provider } from 'react-redux'
import React from 'react'
import { store } from '@/stores'
import type { AppProps } from 'next/app'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
