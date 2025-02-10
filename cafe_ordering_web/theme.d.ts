// theme.d.ts
import { Theme as MuiTheme, ThemeOptions as MuiThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme extends MuiTheme {
    randomBackgroundColor: string;
    bodyBackgroundColor?:string;
    toolbarColor?:string;
  }
  interface ThemeOptions extends MuiThemeOptions {
    randomBackgroundColor?: string;
    bodyBackgroundColor?:string;

    toolbarColor?:string;

  }
}
