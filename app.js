const CONFIG = window.ANIMALS_CONFIG;
const ORDER = ['leopard','zebra','crocodile','dalmatian','bambi'];

function imageExists(src){
  return new Promise(resolve=>{
    const img = new Image();
    img.onload = ()=>resolve(true);
    img.onerror = ()=>resolve(false);
    img.src = src;
  });
}

async function safeSetImage(el, src){
  if(!el || !src) return false;
  const ok = await imageExists(src);
  if(ok){ el.src = src; el.style.display = ''; return true; }
  el.style.display = 'none';
  return false;
}

function applyBackground(el, animal){
  if(!el) return;
  const data = CONFIG[animal];
  imageExists(data.background).then(ok=>{
    el.style.backgroundImage = ok ? `url("${data.background}")` : data.fallback;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
  });
}

function getProduct(animal, family){
  return (CONFIG[animal]?.products || []).find(p=>p.family === family) || null;
}

async function renderPrints(){
  const grid = document.getElementById('printGrid');
  const cardClasses = {
    leopard:'leopard-card', zebra:'zebra-card', crocodile:'crocodile-card', dalmatian:'dalmatian-card', bambi:'bambi-card'
  };
  const tags = {
    leopard:'BOLD · CONFIDENT · WILD', zebra:'GRAPHIC · ICONIC · STRIKING', crocodile:'TEXTURED · DEEP · SOPHISTICATED', dalmatian:'PLAYFUL · SPOTTED · ICONIC', bambi:'SOFT · DELICATE · UNEXPECTED'
  };
  for(const animal of ORDER){
    const caseProduct = getProduct(animal,'CASE');
    const a = document.createElement('a');
    a.href = `#${animal}`;
    a.className = `print-card ${cardClasses[animal]}`;
    const img = document.createElement('img');
    img.alt = `${CONFIG[animal].name} Case`;
    const content = document.createElement('div');
    content.className = 'print-card-content';
    content.innerHTML = `<div class="print-name">${CONFIG[animal].name}</div><div class="print-tag">${tags[animal]}</div>`;
    a.append(img, content);
    grid.appendChild(a);
    if(caseProduct) await safeSetImage(img, caseProduct.image);
  }
}

async function renderCollections(){
  const quick = document.querySelector('.quick-nav');
  const root = document.getElementById('collectionSections');
  for(const animal of ORDER){
    const data = CONFIG[animal];
    const link = document.createElement('a');
    link.href = `#${animal}`;
    link.textContent = data.name;
    quick.appendChild(link);

    const visibleProducts = [];
    for(const product of data.products){
      const ok = await imageExists(product.image);
      if(ok) visibleProducts.push(product);
    }

    const section = document.createElement('section');
    section.className = `collection-block collection-${animal}`;
    section.id = animal;
    const families = [...new Set(visibleProducts.map(p=>p.label))];
    section.innerHTML = `
      <div class="collection-head">
        <div><div class="section-label">SHOP THE ANIMAL</div><h2 class="collection-title">${data.name}</h2></div>
        <div class="collection-description"><strong>${data.claim}</strong><br><br>${data.description}<div class="family-tags">${families.map(f=>`<span class="family-tag">${f}</span>`).join('')}</div></div>
      </div>
      <div class="products-grid"></div>`;
    const grid = section.querySelector('.products-grid');
    visibleProducts.forEach(product=>{
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `<div class="product-image"><img src="${product.image}" alt="${product.name}"></div><div><div class="product-family">${product.label}</div><div class="product-name">${product.name}</div></div>`;
      grid.appendChild(card);
    });
    root.appendChild(section);
  }
}

async function setupHero(){
  const map = {
    heroLeopard:'leopard', heroZebra:'zebra', heroCrocodile:'crocodile', heroDalmatian:'dalmatian', heroBambi:'bambi'
  };
  for(const [id,animal] of Object.entries(map)){
    const p = getProduct(animal,'CASE');
    if(p) await safeSetImage(document.getElementById(id),p.image);
  }
  const leopardCase = getProduct('leopard','CASE');
  if(leopardCase) await safeSetImage(document.getElementById('previewCase'), leopardCase.image);
  applyBackground(document.getElementById('previewScreen'),'leopard');
}

const gameState = {
  leopard:{love:72,food:65,water:61}, zebra:{love:68,food:70,water:64}, crocodile:{love:62,food:60,water:78}, dalmatian:{love:76,food:68,water:60}, bambi:{love:70,food:63,water:66}
};
let gameAnimal = 'leopard';
let customGameMessage = '';

function clamp(v){ return Math.max(0,Math.min(100,v)); }

async function renderGame(){
  const data = CONFIG[gameAnimal];
  const state = gameState[gameAnimal];
  document.getElementById('gameName').textContent = data.name;
  document.getElementById('gameSpeech').textContent = customGameMessage || data.game;
  applyBackground(document.getElementById('gameTop'),gameAnimal);
  const caseProduct = getProduct(gameAnimal,'CASE');
  if(caseProduct) await safeSetImage(document.getElementById('gameProduct'),caseProduct.image);
  document.getElementById('gameLove').style.width = state.love + '%';
  document.getElementById('gameFood').style.width = state.food + '%';
  document.getElementById('gameWater').style.width = state.water + '%';
  document.querySelectorAll('.game-animal').forEach(btn=>btn.classList.toggle('active',btn.dataset.gameAnimal===gameAnimal));
}

function animateGameProduct(cls){
  const el = document.getElementById('gameProduct');
  el.classList.remove('game-pet-animation','game-feed-animation','game-drink-animation');
  void el.offsetWidth;
  el.classList.add(cls);
  setTimeout(()=>el.classList.remove(cls),1000);
}

function setupGame(){
  const container = document.getElementById('gameAnimals');
  ORDER.forEach(animal=>{
    const b = document.createElement('button');
    b.type='button'; b.className='game-animal' + (animal==='leopard'?' active':'');
    b.dataset.gameAnimal = animal;
    b.innerHTML = `${CONFIG[animal].emoji}<br>${animal==='crocodile'?'CROC':CONFIG[animal].name}`;
    b.addEventListener('click',()=>{ gameAnimal=animal; customGameMessage=CONFIG[animal].game; renderGame(); });
    container.appendChild(b);
  });

  document.getElementById('openGame').addEventListener('click',()=>{
    document.getElementById('gameArea').classList.add('open');
    customGameMessage = CONFIG[gameAnimal].game;
    renderGame();
    setTimeout(()=>document.getElementById('gameArea').scrollIntoView({behavior:'smooth',block:'start'}),100);
  });
  document.getElementById('closeGame').addEventListener('click',()=>document.getElementById('gameArea').classList.remove('open'));
  document.getElementById('gamePet').addEventListener('click',()=>{
    gameState[gameAnimal].love = clamp(gameState[gameAnimal].love+10);
    customGameMessage = `♥ ${CONFIG[gameAnimal].name} loves the attention!`;
    renderGame(); animateGameProduct('game-pet-animation');
  });
  document.getElementById('gameFeed').addEventListener('click',()=>{
    gameState[gameAnimal].food = clamp(gameState[gameAnimal].food+15);
    gameState[gameAnimal].love = clamp(gameState[gameAnimal].love+2);
    customGameMessage = 'Yum! Looking good.';
    renderGame(); animateGameProduct('game-feed-animation');
  });
  document.getElementById('gameDrink').addEventListener('click',()=>{
    gameState[gameAnimal].water = clamp(gameState[gameAnimal].water+15);
    gameState[gameAnimal].love = clamp(gameState[gameAnimal].love+1);
    customGameMessage = 'Fresh and ready to go!';
    renderGame(); animateGameProduct('game-drink-animation');
  });
  document.getElementById('gameProduct').addEventListener('click',()=>document.getElementById('gamePet').click());
}

function setupNavigation(){
  document.addEventListener('click',e=>{
    const link = e.target.closest('a[href^="#"]');
    if(!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
  });
}

(async function init(){
  setupNavigation();
  await setupHero();
  await renderPrints();
  await renderCollections();
  setupGame();
})();
