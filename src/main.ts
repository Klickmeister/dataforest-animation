import 'remixicon/fonts/remixicon.css';
import './main.css';
import './animation-001/horizontal';
import './animation-001/vertical';
import './animation-002';
import './animation-003';

declare global {
  interface Window {
    __CAPTURE__: {
      duration: number;
      seek: (ms: number) => void;
      pause: () => void;
    };
  }
}