import { 
  Inter, 
  Playfair_Display, 
  DM_Serif_Display, 
  Cormorant_Garamond,
  Cinzel,
  Libre_Baskerville,
  Montserrat,
  Outfit,
  Poppins,
  Nunito,
  Quicksand,
  Fredoka,
  Pacifico,
  Dancing_Script,
  Lobster,
  Righteous,
  Bebas_Neue
} from 'next/font/google';

// Default
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Romantic
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
export const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' });
export const cormorant = Cormorant_Garamond({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-cormorant' });

// Wedding
export const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
export const libreBaskerville = Libre_Baskerville({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-libre-baskerville' });

// Travel
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
export const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
export const poppins = Poppins({ weight: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'], variable: '--font-poppins' });

// Fun
export const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });
export const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
export const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' });

// Creative & Stylish
export const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });
export const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script' });
export const lobster = Lobster({ weight: '400', subsets: ['latin'], variable: '--font-lobster' });
export const righteous = Righteous({ weight: '400', subsets: ['latin'], variable: '--font-righteous' });
export const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas-neue' });

export type FontCategory = 'Romantic' | 'Wedding' | 'Travel' | 'Fun' | 'Creative' | 'Default';

export interface FontOption {
  id: string;
  name: string;
  category: FontCategory;
  variable: string;
  className: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'inter', name: 'Inter', category: 'Default', variable: '--font-inter', className: inter.className },
  
  // Romantic
  { id: 'playfair', name: 'Playfair Display', category: 'Romantic', variable: '--font-playfair', className: playfair.className },
  { id: 'dm-serif', name: 'DM Serif Display', category: 'Romantic', variable: '--font-dm-serif', className: dmSerif.className },
  { id: 'cormorant', name: 'Cormorant Garamond', category: 'Romantic', variable: '--font-cormorant', className: cormorant.className },
  
  // Wedding
  { id: 'cinzel', name: 'Cinzel', category: 'Wedding', variable: '--font-cinzel', className: cinzel.className },
  { id: 'libre-baskerville', name: 'Libre Baskerville', category: 'Wedding', variable: '--font-libre-baskerville', className: libreBaskerville.className },
  
  // Travel
  { id: 'montserrat', name: 'Montserrat', category: 'Travel', variable: '--font-montserrat', className: montserrat.className },
  { id: 'outfit', name: 'Outfit', category: 'Travel', variable: '--font-outfit', className: outfit.className },
  { id: 'poppins', name: 'Poppins', category: 'Travel', variable: '--font-poppins', className: poppins.className },
  
  // Fun
  { id: 'nunito', name: 'Nunito', category: 'Fun', variable: '--font-nunito', className: nunito.className },
  { id: 'quicksand', name: 'Quicksand', category: 'Fun', variable: '--font-quicksand', className: quicksand.className },
  { id: 'fredoka', name: 'Fredoka', category: 'Fun', variable: '--font-fredoka', className: fredoka.className },
  
  // Creative
  { id: 'pacifico', name: 'Pacifico', category: 'Creative', variable: '--font-pacifico', className: pacifico.className },
  { id: 'dancing-script', name: 'Dancing Script', category: 'Creative', variable: '--font-dancing-script', className: dancingScript.className },
  { id: 'lobster', name: 'Lobster', category: 'Creative', variable: '--font-lobster', className: lobster.className },
  { id: 'righteous', name: 'Righteous', category: 'Creative', variable: '--font-righteous', className: righteous.className },
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'Creative', variable: '--font-bebas-neue', className: bebasNeue.className },
];

export function getFontClassName(fontId: string | null | undefined): string {
  if (!fontId) return inter.className;
  const font = FONT_OPTIONS.find(f => f.id === fontId);
  return font ? font.className : inter.className;
}

// We will inject these variables globally so they can be referenced inside templates if needed
export const fontVariables = [
  inter.variable,
  playfair.variable,
  dmSerif.variable,
  cormorant.variable,
  cinzel.variable,
  libreBaskerville.variable,
  montserrat.variable,
  outfit.variable,
  poppins.variable,
  nunito.variable,
  quicksand.variable,
  fredoka.variable,
  pacifico.variable,
  dancingScript.variable,
  lobster.variable,
  righteous.variable,
  bebasNeue.variable,
].join(' ');
