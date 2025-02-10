// theme.ts
import { createMuiThemeFromJson } from '@/app/providers/global.providers/theme/createMuiThemeFromJson';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import themeData from './material-theme.json';

const baseTheme: ThemeOptions = createMuiThemeFromJson(themeData, false);


export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#ff9800',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  randomBackgroundColor: '#e0f7fa', // Custom background color
  bodyBackgroundColor: '#141824',
  toolbarColor: '#141824'
});

