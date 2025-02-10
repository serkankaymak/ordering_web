import { blue, green, red, orange } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// JSON verisinden MUI teması oluşturma fonksiyonu
export const createMuiThemeFromJson = (json: any, isDark: boolean) => {
    const { schemes } = json;
    const lightScheme = isDark ? schemes.dark : schemes.light;

    // Renk rollerini MUI tema yapısına eşleyin
    const palette = {
        primary: {
            main: lightScheme.primary || blue[500],
            contrastText: lightScheme.onPrimary || '#FFFFFF',
        },
        secondary: {
            main: lightScheme.secondary || green[500],
            contrastText: lightScheme.onSecondary || '#FFFFFF',
        },
        error: {
            main: lightScheme.error || red[500],
            contrastText: lightScheme.onError || '#FFFFFF',
        },
        warning: {
            main: lightScheme.warning || orange[500],
            contrastText: lightScheme.onWarning || '#000000',
        },
        info: {
            main: lightScheme.info || blue[500],
            contrastText: lightScheme.onInfo || '#FFFFFF',
        },
        success: {
            main: lightScheme.success || green[500],
            contrastText: lightScheme.onSuccess || '#FFFFFF',
        },
        background: {
            default: lightScheme.background || '#FFFFFF',
            paper: lightScheme.surface || '#FFFFFF',
        },
        text: {
            primary: lightScheme.onBackground || '#000000',
            secondary: lightScheme.onSurface || '#000000',
        },
        divider: lightScheme.outline || '#BDBDBD',
        action: {
            active: lightScheme.onSurface || '#000000',
            hover: lightScheme.onSurfaceVariant || '#EEEEEE',
            selected: lightScheme.onSecondaryContainer || '#E0E0E0',
            disabled: lightScheme.onSurfaceDisabled || 'rgba(0, 0, 0, 0.38)',
            disabledBackground: lightScheme.onSurfaceDisabled || 'rgba(0, 0, 0, 0.12)',
        },
    };


    return createTheme({ palette });
};

