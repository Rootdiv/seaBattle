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
  ships: [
    {
      location: ['26', '36', '46', '56'],
      hit: ['', '', '', ''],
    },
    {
      location: ['11', '12', '13'],
      hit: ['', '', ''],
    },
    {
      location: ['70', '80'],
      hit: ['', ''],
    },
    {
      location: ['32'],
      hit: [''],
    },
  ],
  shipCount: 4,
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
  enemy.addEventListener('click', fire);
  play.render();

  again.addEventListener('click', () => {
    location.reload();
  });
};

init();
