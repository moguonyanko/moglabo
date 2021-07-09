/**
 * @fileoverview FontFace調査用スクリプト
 */

const loadFonts = async () => {
  const ff = new FontFace('Sample Font 1', 'url(Roboto-Regular.ttf)');
  await ff.load();
  document.fonts.add(ff);
};

const init = async () => {
  await loadFonts();  
};

init().then();
