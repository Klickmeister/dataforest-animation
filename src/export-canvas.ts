import 'remixicon/fonts/remixicon.css';
import './main.css';
import './animation-002-vertical';

declare global {
  interface Window {
    __CAPTURE__: {
      duration: number;
      seek: (ms: number) => void;
      pause: () => void;
    };
  }
}