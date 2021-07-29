import vue from '@vitejs/plugin-vue';

export default {
  plugins: [vue()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 8000
  }
};
