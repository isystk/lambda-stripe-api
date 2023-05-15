import '@/assets/sass/app.scss'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { store } from '@/stores'
import type { AppProps } from 'next/app'
import { createTheme } from '@mui/material/styles'

// テーマを設定
export const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
  },
})

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  )
}

export default App
