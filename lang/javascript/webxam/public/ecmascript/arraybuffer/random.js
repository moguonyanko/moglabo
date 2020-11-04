const getRandomInteger = limit => {
  const s = (Math.random() * limit).toFixed(0);
  return parseInt(s);
};

const random = {
  getRandomInteger
};

export default random;
