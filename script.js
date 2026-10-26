let themeBtn = document.querySelector(".theme-btn");
let myForm = document.querySelector("#coins-form");
let coinsResult = document.querySelector("#coins-result");
let nicknameInput = document.querySelector("#nickname");
let onlineCount = document.querySelector("#online-count");
let checkBtn = document.querySelector("#check-btn");
let coinsInp = document.querySelector("#coins-input");
let coinsSlid = document.querySelector("#coins-slider");
let totalPrice = document.querySelector("#total-price");
let buyBtn = document.querySelector("#buy-btn");
let buyModal = document.querySelector("#buy-modal");
let modalClose = document.querySelector("#modal-close");
let modalAmount = document.querySelector("#modal-amount");
let modalForm = document.querySelector("#modal-form");
let giftCheckbox = document.querySelector("#gift-checkbox");
let modalNickname = document.querySelector("#modal-nickname");
let ipCopyBtn = document.querySelector("#ip-copy-btn");
let ruleHeaders = document.querySelectorAll(".rule-header");
let fadeElements = document.querySelectorAll(".fade-in");
let buysList = document.querySelector("#buys-list")


themeBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "🌞"; 
  } else {
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌙";
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "🌞"; 
} 


myForm.addEventListener("submit", function(event) {
  event.preventDefault(); 
  coinsResult.classList.remove('error', 'success');
  console.log("Форма отправлена, страница не перезагрузилась!");

  let nickname = nicknameInput.value.trim()

  if (nickname === "") {
    coinsResult.textContent = "Введите ник!";
    return; 
  }
  checkBtn.disabled = true; 
  checkBtn.textContent = "Загрузка..."; 

  fetch("http://localhost:3000/api/coins/" + nickname)
  .then(function(response) {
      return response.json();
  })

  .then(function(data) {
      if (data.error) {
          coinsResult.textContent = "Ошибка: " + data.error;
          coinsResult.classList.add('error');
      } else {
          coinsResult.textContent = "Баланс: " + data.coins;
          coinsResult.classList.add('success')
      }
      
      checkBtn.disabled = false; 
      checkBtn.textContent = "Проверить";
  })

  .catch(function(error) {
      console.error("Курьер упал с ошибкой:", error); 

      coinsResult.textContent = "Сервер временно недоступен";
      coinsResult.classList.add('error');

      checkBtn.disabled = false;
      checkBtn.textContent = "Проверить";
  });


});

coinsSlid.addEventListener("input", function() {
  let currentCoins = coinsSlid.value;

  coinsInp.value = currentCoins;
  totalPrice.textContent = currentCoins;
});

coinsInp.addEventListener("change", function() {
  if (coinsInp.value === "") {
    totalPrice.textContent = "0";
  }

  let currentCoins = Number(coinsInp.value);

  if (currentCoins < 100) {
    currentCoins = 100;
    coinsInp.value = 100;
  }

  if (currentCoins > 10000) {
    currentCoins = 10000;
    coinsInp.value = 10000;
  }

  coinsSlid.value = currentCoins;
  totalPrice.textContent = currentCoins;
});

fetch("http://localhost:3000/api/online")
  .then(function(response) {
    return response.json(); 
  })
  .then(function(data) {
    onlineCount.textContent = data.online; 
  })
  .catch(function(error) {
    console.error("Ошибка онлайна:", error);
});


buyBtn.addEventListener("click", function(event) {
  let amount = coinsSlid.value;
  modalAmount.textContent = amount;
  buyModal.classList.add("active");
});

modalClose.addEventListener("click", function() {
  console.log("Клик по крестику!")
  buyModal.classList.remove("active");
  modalForm.reset();
});

modalForm.addEventListener("submit", function(event) {
  event.preventDefault();
  alert("Спасибо за заказ! Сейчас вас перенаправит на оплату.");
  buyModal.classList.remove("active");
  modalForm.reset();
});

giftCheckbox.addEventListener("change", function() {
  if (giftCheckbox.checked) {
    modalNickname.placeholder = "Никнейм друга";
  } else {
    modalNickname.placeholder = "Ваш никнейм";
  }
});

ipCopyBtn.addEventListener("click", function() {
  let ipText = "namida.mclan.ru";

  navigator.clipboard.writeText(ipText).then(function() {
    let originalText = ipCopyBtn.textContent;
    ipCopyBtn.textContent = "Скопировано! ✅";

    setTimeout(function() {
      ipCopyBtn.textContent = originalText;
    }, 1000)
  });
});

ruleHeaders.forEach(function(header) {
  header.addEventListener("click", function() {
    let parentCategory = header.parentElement;
    parentCategory.classList.toggle("active");
    console.log("блок откройся")
  });
});

let observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(enter) {
    if (enter.isIntersecting) {
      enter.target.classList.add("visible");
    }
  });
});

fadeElements.forEach(function(element) {
  observer.observe(element);
});

let fakeNicks = ["_leviafan_", "kerletik", "__Neon4ik_", "mideko", "Romafkaa", "qazwer", "papa_lol288", "cs_377", "Emerald_NS"];

function generateFakeBuy() {
  let randomNick = fakeNicks[Math.floor(Math.random() * fakeNicks.length)];
  let randomAmount = Math.floor(Math.random() * 49 + 1) * 100;

  let newItem = document.createElement("div");
  newItem.classList.add("buy-item");

  newItem.innerHTML = `
    <span class="buy-item-nick">🎮 ${randomNick}</span>
  <span class="buy-item-amount">+${randomAmount} Namcoins</span>
  `;

  buysList.prepend(newItem);

  if (buysList.children.length > 5) {
    buysList.lastElementChild.remove();
  }
}

setInterval(generateFakeBuy, 5000);

generateFakeBuy();
