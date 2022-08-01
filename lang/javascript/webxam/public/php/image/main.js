const outputImage = {
  imagepng: async () => {
    const res = await fetch('./imagepng.php');
    if (res.ok) {
      const image = await res.blob();
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
      const el = document.querySelector('.output.imagepng');
      el.appendChild(img);
    }
  }
};

const main = () => {
  Object.values(outputImage).forEach(async f => await f());
};

main();
