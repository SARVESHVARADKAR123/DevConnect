import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    accent: string;
    sidebarOpen: boolean;
    error: string;
  }
}