import '../src/assets/sass/app.scss';
import { ThemeProvider } from '@mui/material/styles'
import {Provider} from "react-redux";
import {store} from '../src/stores'
import { RouterContext } from "next/dist/shared/lib/router-context"
import {theme} from "../src/pages/_app";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}

const withProvider = (StoryFn, context) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <StoryFn />
      </Provider>
    </ThemeProvider>
  )
}

/** Decorators */
export const decorators = [withProvider]