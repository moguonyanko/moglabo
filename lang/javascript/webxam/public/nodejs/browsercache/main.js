/**
 * @fileoverview Node.jsを用いたブラウザキャッシュ調査用スクリプト
 */

const request = async url => {
  const response = await fetch(url, {
    mode: 'cors',
    // このリクエストにCookieは利用されないのでomitを指定する。(クレデンシャルを含まない)
    credentials: 'omit'
  });
  if (!response.ok) {
    throw new Error(`Error:${response.status}`);
  }
  return response;
};

const getImageBlob = async url => {
  const response = await fetch(url);
  return await response.blob();
  // XMLHttpRequest版
  // return new Promise((resolve, reject) => {
  //   const xhr = new XMLHttpRequest();
  //   xhr.responseType = 'blob';
  //   xhr.withCredentials = true;
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === XMLHttpRequest.DONE) {
  //       if (xhr.status === 200) {
  //         const blob = xhr.response;
  //         resolve(blob);
  //       } else {
  //         reject(new Error(`Failed load image: ${xhr.status}`));
  //       }
  //     }
  //   };
  //   xhr.onerror = reject;
  //   xhr.open('GET', url);
  //   xhr.send();
  // });
};

const origin = 'https://localhost';

const getSampleSize = () => {

};

const getSampleImage = style => {
  const [width, height] = [
    parseInt(style.getPropertyValue('width')),
    parseInt(style.getPropertyValue('height'))
  ];
  const img = document.createElement('img');
  img.width = width;
  img.height = height;
  return img;
};

class ImageLoader {
  constructor(url, { width, height }) {
    //console.log(`Called super constructor: ${performance.now()}`);
    this.url = url;
    this.width = width;
    this.height = height;
  }
}

class FetchLoader extends ImageLoader {
  load() {
    return new Promise(async (resolve, reject) => {
      const img = new Image(this.width, this.height);
      const blobUrl = URL.createObjectURL(await getImageBlob(this.url));
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(img);
      };
      img.onerror = reject;
      img.src = blobUrl;
    });
  }
}

class DirectLoader extends ImageLoader {
  load() {
    return new Promise((resolve, reject) => {
      const img = new Image(this.width, this.height);
      img.onload = () => {
        resolve(img);
      };
      img.onerror = reject;
      img.src = this.url;
    });
  }
}

const getImageLoader = (url, { width, height }) => {
  const { checked } = document.querySelector(`input[data-event-target='useFetch']`);
  if (checked) {
    return new FetchLoader(url, { width, height });
  } else {
    return new DirectLoader(url, { width, height });
  }
};

const listener = {
  getCurrentTime: async () => {
    const url = `${origin}/webxam/apps/practicenode/currenttime`;
    const response = await request(url);
    const json = await response.json();
    const output = document.querySelector(`div[data-event-output='getCurrentTime']`);
    output.textContent = json.result;
  },
  getSampleImage: async () => {
    const output = document.querySelector(`div[data-event-output='getSampleImage']`);
    const style = getComputedStyle(output);
    const [width, height] = [
      parseInt(style.getPropertyValue('width')),
      parseInt(style.getPropertyValue('height'))
    ];
    const url = `${origin}/webxam/apps/practicenode/sampleimage`;
    const loader = getImageLoader(url, { width, height });
    const img = await loader.load();
    output.innerHTML = '';
    output.appendChild(img);
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listener[eventTarget] !== 'function') {
      return;
    }
    event.stopPropagation();
    await listener[eventTarget]();
  })
};

addListener();
