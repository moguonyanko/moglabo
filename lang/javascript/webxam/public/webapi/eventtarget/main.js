/**
 * @fileoverview EventTarget動作確認用スクリプト
 */

class User extends EventTarget {
  constructor({ name, age }) {
    super();
    this.name = name;
    this.age = age;
  }

  get adult() {
    return this.age >= 20;
  }

  toString() {
    return this.name;
  }
}

class Item {
  constructor({ name, forAdult = false }) {
    this.name = name;
    this.forAdult = forAdult;
  }

  toString() {
    return this.name;
  }
}

const boughtEventName = 'bought';

class BoughtEvent extends CustomEvent {
  constructor(item) {
    super(boughtEventName, { detail: item });
  }  
}

const runTest = () => {
  const users = [ 
    new User({ name: 'Taro', age: 19 }), 
    new User({ name: 'Masako', age: 35 })
  ];

  const addListener = user => {
    user.addEventListener(boughtEventName, event => {
      if (event.target.adult) {
        console.log(`${event.target.name} can buy ${event.detail.name}`);
      } else {
        console.log(`${event.target.name} cannot buy ${event.detail.name}`);
      }
    });
    return user;
  };

  const event = new BoughtEvent(new Item({ name: 'tabaco', forAdult: true }));

  users.map(addListener).forEach(user => user.dispatchEvent(event));
};

runTest();

// Sample page

const q = selector => document.querySelectorAll(selector);

const userDb = {
  poko: {
    name: 'Poko',
    age: 23
  },
  jiro: {
    name: 'Jiro',
    age: 18
  }
};

const itemDb = {
  tabaco: {
    name: 'tabaco',
    forAdult: true
  },
  sake: {
    name: 'sake',
    forAdult: true
  },
  bat: {
    name: 'bat',
    forAdult: false
  }
};

const getCheckedObject = (query, db, klass) => {
  const values =  Array.from(q(query))
    .filter(ele => ele.checked)
    .map(ele => ele.value);
  return new klass(db[values.pop()]);
};

const listeners = {
  buy() {
    const user = getCheckedObject(`.panel.user input[name='user']`, userDb, User),
      item =  getCheckedObject(`.panel.item input[name='item']`, itemDb, Item);

    // dispatchEventと同じ場所でaddEventListenerするのは意味がない。
    user.addEventListener(boughtEventName, event => {
      const r = document.querySelector('.bought.example .result');
      // 拡張したEventTargetの情報を基に制御を切り替えることができる。
      if(event.target.adult) {
        r.innerHTML = `${event.target} can buy ${event.detail}`;
      } else {
        r.innerHTML = `${event.target} cannot buy ${event.detail}`;
      }
    })

    const event = new BoughtEvent(item);

    user.dispatchEvent(event);
  }
};

const init = () => {
  document.querySelector('main').addEventListener('click', event => {
    const t = event.target,
      f = listeners[t.dataset.eventTarget];
    if (typeof f !== 'function') {
      return;
    }
    
    event.stopPropagation();

    f();
  });
};

init();
