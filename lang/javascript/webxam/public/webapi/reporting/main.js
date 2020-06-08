/**
 * @fileoverview Reporting API調査用スクリプト
 */

const getImage = url => {
  return new Promise((resolve, reject) => {
    fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`Image Loade Error: ${response.status}`);
      }
      return response.blob();
    }).then(blob => {
      const image = new Image();
      const blobUrl = URL.createObjectURL(blob);
      image.onload = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(image);
      };
      image.src = blobUrl;
    }).catch(reject);
  });
};

// DOM

let observer;

const getContainer = () => document.querySelector('.container');

const listener = {
  // CORS関連のエラーはReportingAPIの監視対象外
  loadImage: async () => {
    const url = 'https://myhost/webxam/image/hello.png';
    // 以下はクロスオリジンのリクエストにならないため成功する。
    //const url = 'https://localhost/webxam/image/hello.png';
    const container = getContainer();
    container.textContent = '';
    try {
      const img = await getImage(url);
      container.appendChild(img);
    } catch(e) {
      const txt = document.createTextNode(e.message);
      container.textContent += e.message;
    }    
  },
  disconnectObserver: () => {
    observer?.observe();  
  },
  getReportedRecord: () => {
    const records = observer?.takeRecords();
    const container = getContainer();
    // takeRecordsは常に空になってしまう。
    console.info(records);
    container.textContent += JSON.stringify(records);
  },
  // 非推奨メソッドの呼び出しはReportingAPIで監視され報告される。
  // ただし最初の一回だけである。
  getAppCacheStatus: () => {
    const status = applicationCache.status;
    const container = getContainer();
    container.textContent += `ApplicationCache status = ${status}`;
  },
  clear: () => {
    getContainer().textContent = '';
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
  });
};

const initReportObserver = () => {
  const options = {
    // types: ['deprecation'],
    buffered: true
  };
  observer = new ReportingObserver((reports, currentObserver) => {
    const container = getContainer();
    container.textContent = '';
    for (const report of reports) {
      console.info(report);
      const txt = document.createTextNode(JSON.stringify(report));
      container.appendChild(txt);
      container.appendChild(document.createElement('br'));
    }
  }, options);
  observer.observe();
};

const init = () => {
  addListener();
  initReportObserver();
};

init();
