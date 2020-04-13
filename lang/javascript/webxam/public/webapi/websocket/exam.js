/**
 * @fileoverview WebSocket調査用スクリプト
 */

const webSocketOrigin = 'wss://myhost:5443';

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const socket = new WebSocket(webSocketOrigin);

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
    const appProtocol = 'my-ws';
    const socket = new WebSocket(webSocketOrigin, appProtocol);
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

const callbacks = {
  sendMessage(event) {
    const output = document.querySelector('.output');
    if (typeof event.data === 'string') {
      output.innerHTML += `${event.data}<br />`;
    } else if (typeof event.data === 'object') {
      const url = URL.createObjectURL(event.data);
      const img = new Image(20, 20);
      img.onload = () => {
        URL.revokeObjectURL(url);
        output.appendChild(img);
      };
      img.src = url;
    } else {
      throw new Error(`Unsupported message type ${typeof event.data}`);
    }
  },
  closeConnection() {
    const output = document.querySelector('.output');
    output.textContent = '';
  }
};

const handlers = {
  sendMessage({ socket, element }) {
    const message = element.querySelector('.message').value;
    sendMessage({ socket, message });
    socket.addEventListener('message', callbacks.sendMessage);
  },
  closeConnection({ socket }) {
    closeConnection({ socket });
    socket.addEventListener('close', callbacks.closeConnection);
  },
  async sendImage({ socket, element }) {
    const img = element.querySelector('img'),
      { width, height } = img;
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const blob = await canvas.convertToBlob();
    sendMessage({ socket, message: blob });
    socket.addEventListener('message', callbacks.sendMessage);
  }
};

let socket;

const addListener = () => {
  const exams = document.querySelectorAll('.example');
  exams.forEach(element => {
    element.addEventListener('click', async event => {
      const handleType = event.target.dataset.eventTarget;
      if (typeof handlers[handleType] !== 'function') {
        return;
      }
      event.stopPropagation();
      if (!socket || (isClose(socket) &&
        handleType !== 'closeConnection')) {
        socket = await openConnection();
      }
      handlers[handleType]({ socket, element });
    });
  });
};

const init = () => {
  addListener();
};

window.addEventListener('DOMContentLoaded', init);
