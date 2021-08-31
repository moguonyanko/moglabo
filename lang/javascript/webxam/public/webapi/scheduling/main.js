/**
 * Scheduling API 調査用スクリプト
 */

const sampleTask = () => {
  return 'Hello Scheduling API'
};

const sampleSubTask2 = () => {
  // backgroundが返される。
  return scheduler.currentTaskSignal.priority;
};

const sampleTask2 = async () => {
  const result = await scheduler.postTask(sampleSubTask2, {
    signal: scheduler.currentTaskSignal,
    priority: 'background'
  });
  return result;
};

const listener = {
  postTask: async () => {
    const output = document.querySelector(`.output[data-event-output='postTask']`);
    const result = await scheduler.postTask(sampleTask);
    output.textContent = result;
  },
  taskController: async () => {
    const taskController = new TaskController({
      priority: 'user-blocking'
    });
    setTimeout(async () => {
      const result = await scheduler.postTask(sampleTask2, { taskController });
      const output = document.querySelector(`.output[data-event-output='taskController']`);
      output.textContent = result;
    }, 1000);
    // sampleTask2よりも先にabortされるように試みている。
    // このときabortした場合に返される値に変化はあるか？
    taskController.abort();
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
