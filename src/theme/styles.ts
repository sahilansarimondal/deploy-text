import { mode } from '@chakra-ui/theme-tools';
export const globalStyles = {
  colors: {
    brand: {
      100: '#FEEBC8',
      200: '#C05621',
      300: '#C05621',
      400: '#F6AD55',
      500: '#C05621',
      600: '#7B341E',
      700: '#652B19',
      800: '#7B341E',
      900: '#652B19',
    },
    col: {
      100: '#2274A5',
      110: '#1C8ED0',
      200: '#EF3054',
      300: '#E5E7E6',
      400: '#B7B5B3',
      500: '#141301',
    },
    brandScheme: {
      100: '#E9E3FF',
      200: '#F6AD55',
      300: '#F6AD55',
      400: '#F6AD55',
      500: '#C05621',
      600: '#7B341E',
      700: '#652B19',
      800: '#7B341E',
      900: '#652B19',
    },
    brandTabs: {
      100: '#C05621',
      200: '#C05621',
      300: '#C05621',
      400: '#C05621',
      500: '#C05621',
      600: '#7B341E',
      700: '#652B19',
      800: '#7B341E',
      900: '#652B19',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E2E8F0',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#718096',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    red: {
      100: '#FEEFEE',
      500: '#EE5D50',
      600: '#E31A1A',
    },
    blue: {
      50: '#EFF4FB',
      500: '#3965FF',
    },
    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },
    green: {
      100: '#E6FAF5',
      500: '#01B574',
    },
    white: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#ffffff',
    },
    navy: {
      50: '#fbe4d0',
      100: '#fed0aa',
      200: '#a3b9f8',
      300: '#eaa672',
      400: '#ba6d36',
      500: '#ba5a1a',
      600: '#8a3e22',
      700: '#452318',
      800: '#652B19',
      900: '#33160e',
    },
    gray: {
      100: '#FAFCFE',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('#fdfeff', 'navy.900')(props),
        fontFamily: 'Plus Jakarta Sans',
      },
      input: {
        color: 'gray.700',
      },
      html: {
        fontFamily: 'Plus Jakarta Sans',
      },
    }),
  },
};
