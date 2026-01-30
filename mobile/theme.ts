import { vars } from 'nativewind';

export const lightTheme = vars({
  '--radius': '14',
  
  // Modern fintech colors - professional indigo/violet
  '--background': '255 255 255',        // Pure white
  '--foreground': '15 23 42',           // Slate 900
  
  '--card': '255 255 255',
  '--card-foreground': '15 23 42',
  
  '--primary': '79 70 229',             // Indigo 600
  '--primary-foreground': '255 255 255',
  
  '--secondary': '241 245 249',         // Slate 100
  '--secondary-foreground': '15 23 42',
  
  '--muted': '248 250 252',             // Slate 50
  '--muted-foreground': '100 116 139',  // Slate 500
  
  '--accent': '238 242 255',            // Indigo 50
  '--accent-foreground': '67 56 202',   // Indigo 700
  
  '--destructive': '239 68 68',         // Red 500
  
  '--border': '226 232 240',            // Slate 200
  '--input': '241 245 249',             // Slate 100
  '--ring': '99 102 241',               // Indigo 500
  
  // Chart colors for analytics
  '--chart-1': '99 102 241',            // Indigo
  '--chart-2': '139 92 246',            // Violet
  '--chart-3': '236 72 153',            // Pink
  '--chart-4': '34 197 94',             // Green
  '--chart-5': '251 146 60',            // Orange
});

export const darkTheme = vars({
  '--radius': '14',
  
  // Dark mode - deep blue/indigo background
  '--background': '10 10 15',           // Very dark blue
  '--foreground': '248 250 252',        // Slate 50
  
  '--card': '15 23 42',                 // Slate 900
  '--card-foreground': '248 250 252',
  
  '--primary': '99 102 241',            // Indigo 500 (brighter for dark)
  '--primary-foreground': '255 255 255',
  
  '--secondary': '30 41 59',            // Slate 800
  '--secondary-foreground': '226 232 240',
  
  '--muted': '30 41 59',                // Slate 800
  '--muted-foreground': '148 163 184',  // Slate 400
  
  '--accent': '30 27 75',               // Deep indigo
  '--accent-foreground': '199 210 254', // Indigo 200
  
  '--destructive': '248 113 113',       // Red 400
  
  '--border': '30 41 59',               // Slate 800
  '--input': '30 41 59',
  '--ring': '129 140 248',              // Indigo 400
  
  // Chart colors for analytics
  '--chart-1': '129 140 248',           // Indigo lighter
  '--chart-2': '167 139 250',           // Violet lighter
  '--chart-3': '244 114 182',           // Pink lighter
  '--chart-4': '74 222 128',            // Green lighter
  '--chart-5': '251 146 60',            // Orange
});