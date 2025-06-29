import "styled-components";

interface IPalette {
  main: string;
  contrastText: string;
}

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      background: string;
      surface: string;
      primary: string;
      primaryHover: string;
      text: string;
      textSecondary: string;
      border: string;
      success: string;
    };
  }
}
