import { Helmet } from 'react-helmet-async';

export const CriticalCSS = () => (
  <Helmet>
    <style>
      {`
        /* Critical above-the-fold styles */
        .hero-section {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Font face for critical text */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/inter-regular.woff2') format('woff2');
        }
      `}
    </style>
  </Helmet>
);