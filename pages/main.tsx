import {createRoot} from 'react-dom/client';
import '../app/globals.css';
import '../app/builder-overrides.css';
import '../app/store-overrides.css';
import '../app/color-overrides.css';
import '../app/simple-builder.css';
import '../app/rancher-placeholder.css';
import '../app/reference-customizer.css';
import Storefront from '../app/storefront';

createRoot(document.getElementById('root')!).render(<Storefront/>);
