const border = 50;

self.addEventListener('message', event => {
  console.log(event);
  if (event.origin !== 'https://localhost') {
    throw new Error('Invalid origin');
  }
  let message = 'over';
  const { data } = event;
  if (data <= border) {
    message = 'under';
  }
  event.source.postMessage(`${data} is ${message} ${border}`, event.origin);
});
