"use client";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#f8fafc',
          paper: '#ffffff',
        },
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
        },
        customBackground: {
          sidebar: '#ffffff',
          main: '#f8fafc',
          card: '#ffffff',
        },
        customText: {
          primary: '#0f172a',
          secondary: '#64748b',
          muted: '#94a3b8',
        },
        customBorder: {
          default: '#e2e8f0',
          hover: '#818cf8',
        }
      }
    },
    dark: {
      palette: {
        background: {
          default: '#0f172a',
          paper: '#1e293b',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
        },
        customBackground: {
          sidebar: '#1e293b',
          main: '#0f172a',
          card: '#334155',
        },
        customText: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
        },
        customBorder: {
          default: '#475569',
          hover: '#6366f1',
        }
      }
    }
  },
});

export function MuiThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
