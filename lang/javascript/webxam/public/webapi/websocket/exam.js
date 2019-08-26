/**
 * @fileoverview WebSocket調査用スクリプト
 */

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const socket = new WebSocket('wss://localhost:5443');

  socket.addEventListener('open', () => {
    socket.send(`${new Date}: Hello My WebSocket App`);
  });

  socket.addEventListener('message', event => {
    console.log(event.data);
    socket.close();
  });
};

const sendMessage = ({ socket, message }) => {
  socket.send(message);
};

const closeConnection = ({ socket }) => {
  socket.close();
};

const openConnection = () => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('wss://localhost:5443');
    socket.addEventListener('open', () => {
      resolve(socket);
    });
    socket.addEventListener('error', reject);
  });
};

const isClose = socket => {
  return socket.readyState === WebSocket.CLOSING ||
    socket.readyState === WebSocket.CLOSED
};

// DOM

const handlers = {
  sendMessage({ socket, element, onMessage }) {
    const message = element.querySelector('.message').value;
    sendMessage({ socket, message });
    socket.addEventListener('message', onMessage);
  },
  closeConnection({ socket, onClose }) {
    closeConnection({ socket });
    socket.addEventListener('close', onClose);
  }
};

let socket;

const addListener = () => {
  const exams = document.querySelectorAll('.example');
  exams.forEach(element => {
    const output = element.querySelector('.output');
    const onMessage = ({ data }) => {
      output.innerHTML += `${data}<br />`;
    };
    const onClose = () => {
      output.innerHTML += `My WebSocket closed<br />`;
    };
    element.addEventListener('pointerup', async event => {
      const handleType = event.target.dataset.eventTarget;
      if (typeof handlers[handleType] !== 'function') {
        return;
      }
      event.stopPropagation();
      if (!socket || (isClose(socket) && handleType !== 'closeConnection')) {
        socket = await openConnection();
      }
      handlers[handleType]({ socket, element, onMessage, onClose });
    });
  });
};

const init = () => {
  addListener();
};

window.addEventListener('DOMContentLoaded', init);
