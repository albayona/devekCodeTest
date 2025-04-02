import { createTheme, ThemeOptions } from "@mui/material/styles";
import {PaletteColor, PaletteColorOptions} from "@mui/material";

declare module "@mui/material/styles" {
    interface Palette {
        redIcon: PaletteColor;
        greenIcon: PaletteColor;
        greyIcon: PaletteColor;
        paperBorder: {
            main: string;
            red: string;
            green: string;
            grey: string;
        };
    }

    interface PaletteOptions {
        redIcon?: PaletteColorOptions;
        greenIcon?: PaletteColorOptions;
        greyIcon?: PaletteColorOptions;
        paperBorder?: {
            main: string;
            red: string;
            green: string;
            grey: string;
        };
    }
}


export const CustomThemeOptions: ThemeOptions = createTheme({
    palette: {
        mode: 'light',
        secondary: {
            main: '#b75b82',
            light: '#d0cacb',
            contrastText: '#fff',
        },
        primary: {
            main: '#3f51b5',
            light: '#f1f3f6',
            contrastText: '#fff',
        },
        redIcon: {
            main: '#f31c0c',
            light: '#de8080',
        },
        greenIcon: {
            main: '#209125',
            light: '#77d799',
        },
        greyIcon: {
            main: '#545353',
            light: '#8d8d8d',
        },
        paperBorder: {
            main: '#f3ef12',
            red: '#fccbcb',
            green: '#a9ffc4',
            grey: '#a6a6a6',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        error: {
            main: '#f44336',
        },
        action: {
            active: '#3f51b5',
            hover: '#f3c7d6',
            selected: '#f3c7d6',
            disabled: '#c7cce3',
            disabledBackground: '#f3c7d6',
            focus: '#f3c7d6',
            hoverOpacity: 0.08,
            selectedOpacity: 0.08,
            disabledOpacity: 0.38,
            focusOpacity: 0.12,
        },
        text: {
            primary: '#2c2e36',
            secondary: '#85777c',
            disabled: '#c7cce3'
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },

});
