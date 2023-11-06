const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const play = {
  record: localStorage.getItem('seaBattleRecord') || 0,
  shot: 0,
  hit: 0,
  dead: 0,

  /**
   * @param {string} data
   */
  set updateData(data) {
    this[data] += 1;
    this.render();
  },

  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  },
};

const game = {
  ships: [],
  shipCount: 0,
  optionShip: {
    count: [1, 2, 3, 4],
    size: [4, 3, 2, 1],
  },
  collision: new Set(),

  checkCollision(location) {
    for (const coord of location) {
      if (this.collision.has(coord)) {
        return true;
      }
    }
  },

  addCollision(location) {
    for (let i = 0; i < location.length; i++) {
      const startCoordX = location[i][0] - 1;
      for (let j = startCoordX; j < startCoordX + 3; j++) {
        const startCoordY = location[i][1] - 1;

        for (let z = startCoordY; z < startCoordY + 3; z++) {
          if (j >= 0 && j < 10 && z >= 0 && z < 10) {
            const coord = j + '' + z;
            this.collision.add(coord);
          }
        }
      }
    }
  },

  generateOptionShip(shipSize) {
    const ship = {
      location: [],
      hit: [],
    };

    const direction = Math.random() < 0.5;
    let coordX = null;
    let coordY = null;

    if (direction) {
      coordX = Math.floor(Math.random() * 10);
      coordY = Math.floor(Math.random() * (10 - shipSize));
    } else {
      coordX = Math.floor(Math.random() * (10 - shipSize));
      coordY = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < shipSize; i++) {
      if (direction) {
        ship.location.push(String(coordX) + (coordY + i));
      } else {
        ship.location.push(coordX + i + String(coordY));
      }
      ship.hit.push('');
    }

    if (this.checkCollision(ship.location)) {
      return this.generateOptionShip(shipSize);
    }

    this.addCollision(ship.location);

    return ship;
  },

  generateShip() {
    for (let i = 0; i < this.optionShip.count.length; i++) {
      for (let j = 0; j < this.optionShip.count[i]; j++) {
        const size = this.optionShip.size[i];
        const ship = this.generateOptionShip(size);
        this.ships.push(ship);
        this.shipCount++;
      }
    }
  },
};

const show = {
  changeClass(elem, value) {
    elem.className = value;
  },
  hit(elem) {
    this.changeClass(elem, 'hit');
  },
  miss(elem) {
    this.changeClass(elem, 'miss');
  },
  dead(id) {
    const elem = document.getElementById(id);
    this.changeClass(elem, 'dead');
  },
};

const fire = ({ target }) => {
  if (target.classList.length !== 0 || target.tagName !== 'TD' || game.shipCount < 1) return;
  show.miss(target);
  play.updateData = 'shot';

  for (let i = 0; i < game.ships.length; i++) {
    const ship = game.ships[i];
    const index = ship.location.indexOf(target.id);
    if (index >= 0) {
      show.hit(target);
      play.updateData = 'hit';
      ship.hit[index] = 'x';

      const isLife = ship.hit.includes('');
      if (!isLife) {
        play.updateData = 'dead';
        for (const id of ship.location) {
          show.dead(id);
        }

        game.shipCount -= 1;

        if (game.shipCount < 1) {
          header.textContent = 'Игра окончена!';
          header.style.color = '#ff0000';

          if (play.shot < play.record || play.record === 0) {
            localStorage.setItem('seaBattleRecord', play.shot);
            play.record = play.shot;
            play.render();
          }
        }
      }
    }
  }
};

const init = () => {
  game.generateShip();

  enemy.addEventListener('click', fire);
  play.render();

  again.addEventListener('click', () => {
    location.reload();
  });

  record.addEventListener('dblclick', () => {
    localStorage.removeItem('seaBattleRecord');
    play.record = 0;
    play.render();
  });
};

init();
