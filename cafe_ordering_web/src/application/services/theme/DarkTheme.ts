import { createMuiThemeFromJson } from '@/app/providers/global.providers/theme/createMuiThemeFromJson';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import themeData from './material-theme.json';


const baseTheme: ThemeOptions = createMuiThemeFromJson(themeData,true)
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#009688',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },

  randomBackgroundColor: '#004d40', // Custom background color
  bodyBackgroundColor: '#141824',
  toolbarColor: '#141824'

});
