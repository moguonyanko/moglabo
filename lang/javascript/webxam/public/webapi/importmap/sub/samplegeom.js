import SampleMath from 'samplemath';

class Point {
  #x;
  #y;

  constructor ({x, y}) {
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
}

const calcDistance = ({p1, p2}) => {
  const subX = SampleMath.sub({a: p1.x, b: p2.x});
  const subY = SampleMath.sub({a: p1.y, b: p2.y});
  return Math.sqrt(Math.pow(subX, 2) + Math.pow((subY), 2));
};

export {
  Point,
  calcDistance
};