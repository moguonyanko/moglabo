/**
 * Scheduling API 調査用スクリプト
 */

const sampleTask = () => {
  return 'Hello Scheduling API'
};

const listener = {
  postTask: async () => {
    const output = document.querySelector(`.output[data-event-output='postTask']`);
    const result = await scheduler.postTask(sampleTask);   
    output.textContent = result; 
  }
};

const init = () => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listener[eventTarget] !== 'function') {
      return;
    }
    event.stopPropagation();
    await listener[eventTarget]();
  });
};

init();
