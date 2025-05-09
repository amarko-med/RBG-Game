let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: 'stick', power: 10 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 80 }
];

const monsters = [
  { name: "slime 🦠", level: 2, health: 20 },
  { name: "fanged beast 🐺", level: 8, health: 70 },
  { name: "dragon 🐉", level: 20, health: 250 }
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function updateHealthBars() {
  const healthBar = document.getElementById('healthBar');
  const monsterHealthBar = document.getElementById('monsterHealthBar');
  
  healthBar.style.width = `${health}%`;
  if (health <= 20) {
    healthBar.style.background = '#ff0000';
  } else if (health <= 50) {
    healthBar.style.background = '#ffa500';
  } else {
    healthBar.style.background = '#00ff00';
  }

  if (monsterHealth && monsters[fighting]) {
    const percent = (monsterHealth / monsters[fighting].health) * 100;
    monsterHealthBar.style.width = `${percent}%`;
  }
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health = Math.min(100, health + 10);
    goldText.textContent = gold;
    healthText.textContent = health;
    updateHealthBars();
    text.textContent = `Health restored to ${health}!`;
  } else {
    text.textContent = "You need 10 gold to buy health!";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.textContent = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.textContent = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.textContent += " In your inventory you have: " + inventory;
    } else {
      text.textContent = "You need 30 gold for a new weapon!";
    }
  } else {
    text.textContent = "You already have the best weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.textContent = gold;
    let currentWeapon = inventory.shift();
    text.textContent = "You sold a " + currentWeapon + ".";
    text.textContent += " In your inventory you have: " + inventory;
  } else {
    text.textContent = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.textContent = monsters[fighting].name;
  monsterHealthText.textContent = monsterHealth;
  updateHealthBars();
}

function attack() {
  const monster = monsters[fighting];
  text.innerHTML = `The ${monster.name} attacks.<br>`;
  text.innerHTML += `You attack it with your ${weapons[currentWeapon].name}.<br>`;
  
  if (isMonsterHit()) {
    const damage = weapons[currentWeapon].power + Math.floor(Math.random() * xp/3);
    monsterHealth -= damage;
    text.innerHTML += `You hit for ${damage} damage!<br>`;
  } else {
    text.innerHTML += "You miss.<br>";
  }

  if (monsterHealth > 0) {
    const monsterDamage = getMonsterAttackValue(monster.level);
    health -= monsterDamage;
    text.innerHTML += `The ${monster.name} hits you for ${monsterDamage} damage.<br>`;
    document.getElementById('game').classList.add('damage-taken');
    setTimeout(() => {
      document.getElementById('game').classList.remove('damage-taken');
    }, 300);
  }

  healthText.textContent = health;
  monsterHealthText.textContent = monsterHealth;
  updateHealthBars();

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) winGame();
    else defeatMonster();
  }

  if (Math.random() <= 0.1 && inventory.length > 1) {
    const brokenWeapon = inventory.pop();
    currentWeapon = Math.max(0, currentWeapon - 1);
    text.innerHTML += `<br>Your ${brokenWeapon} breaks!`;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  const now = Date.now();
  if (now - lastDodgeTime < 2000) {
    text.textContent = "You're too tired to dodge again so soon!";
    return;
  }
  lastDodgeTime = now;
  text.textContent = `You dodge the ${monsters[fighting].name}'s attack!`;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.textContent = gold;
  xpText.textContent = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.textContent = gold;
  healthText.textContent = health;
  xpText.textContent = xp;
  updateHealthBars();
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.textContent = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.textContent += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.textContent += "Right! You win 20 gold!";
    gold += 20;
    goldText.textContent = gold;
  } else {
    text.textContent += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.textContent = health;
    updateHealthBars();
    if (health <= 0) {
      lose();
    }
  }
}