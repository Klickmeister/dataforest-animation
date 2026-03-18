import 'remixicon/fonts/remixicon.css';
import './main.css';

/** BEGIN DROP IN */

import './animation-004';

/** END DROP IN */

declare global {
  interface Window {
    __CAPTURE__: {
      duration: number;
      seek: (ms: number) => void;
      pause: () => void;
    };
  }
}