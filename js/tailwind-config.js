tailwind.config = {
  theme: {
    extend: {
      colors: {
        'lm-tinta': '#1D2430',
        'lm-toldo': '#2E3F5B',
        'lm-ceu': '#C1D1E1',
        'lm-madeira': '#927970',
        'lm-salvia': '#7E7D71',
        'lm-areia': '#F4F1EC',
      },
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        /* Mesma escala usada pelos rótulos mono/uppercase de css/vitrine.css
           (.lm-nav__item, .lm-eyebrow, .lm-btn, .lm-rodape h4), para o
           cabeçalho, os botões e os textos da home baterem em tamanho com
           os das demais páginas do site. */
        '2xs': '0.6875rem',
        label: '0.8125rem',
      },
    },
  },
};
