import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';

export default defineConfig({
 root: fileURLToPath(new URL('./pages',import.meta.url)),
 base: '/cava-hat-bar/',
 publicDir: fileURLToPath(new URL('./public',import.meta.url)),
 plugins:[react(),{
  name:'github-pages-rendering-paths',
  transform(code,id){
   if(/\/app\/(hat-assets|storefront)\.tsx?$/.test(id))
    return code.replaceAll('/cowboy-renderings/','/cava-hat-bar/cowboy-renderings/');
  }
 }],
 build:{outDir:fileURLToPath(new URL('./dist-pages',import.meta.url)),emptyOutDir:true}
});
