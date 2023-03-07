'use strict';

window.onload = () => {
  const mainEl = document.querySelector('main');
  const todoItemsList = document.querySelector('ul');
  const form = document.querySelector('form');
  const passwordInput = document.querySelector('#passwordInput');
  const passwordErrMsg = document.querySelector('#passwordErrMsg');
  const modal = document.querySelector('#myModal');
  const completeModal = document.querySelector('#completeModal');
  const resetBtn = document.querySelector('#resetBtn');

  let authenticated = JSON.parse(localStorage.getItem('authenticated'));
  let localData = [];
  // const date = new Date();
  const storedTime = JSON.parse(localStorage.getItem('updateTime'));

  class Item {
    constructor(id, name, text, status) {
      this.id = id;
      this.name = name;
      this.text = text;
      this.status = status;
    }
  }

  const peePad = new Item(0, 'peePad', 'Change Pee Pad', false);
  const stove = new Item(1, 'stove', 'Check Stove', false);
  const bedroom = new Item(2, 'bedroom', 'Check Bathroom Door', false);
  const bathroom = new Item(3, 'bathroom', 'Check Bedroom Door', false);
  const computer = new Item(4, 'computer', 'Check Computer', false);
  const nameTag = new Item(5, 'nameTag', 'Get Name Tag', false);
  const backdoor = new Item(5, 'backdoor', 'Check Back Door', false);
  const frontdoor = new Item(5, 'frontdoor', 'Check Front Door', false);

  // prettier-ignore
  const todoItemsArr = [peePad, stove, bedroom, bathroom, computer, nameTag, backdoor, frontdoor,];

  mainEl.style.marginTop = `${document.querySelector('header').offsetHeight}px`;

  // Function to build and display an item on page
  const displayItems = function (item) {
    const newItem = document.createElement('li');
    newItem.classList.add(
      `${item.name}`,
      'flex',
      'w-full',
      'items-center',
      'border-b-[1px]',
      'border-slate-50',
      `${item.status ? 'opacity-50' : 'opacity-100'}`,
      'pb-6'
    );
    const html = `
      <label for="${item.name}" class="mr-auto inline-block cursor-pointer">${
      item.text
    }</label
      ><input
        type="checkbox"
        class="checkbox"
        name="${item.name}"
        value="${item.name}"
        id="${item.name}"
      />
      <i
        class="fa-solid fa-check ${
          item.status ? '' : 'hidden'
        } text-green-500 ${
      item.status ? '' : 'opacity-0'
    } transition duration-300 ease-in-out"
      ></i>
  `;
    newItem.innerHTML = html;
    todoItemsList.append(newItem);
  };

  // Function to sort complete items
  const sortComplete = function () {
    localData = JSON.parse(localStorage.getItem('list'));
    localData.sort((a, b) => a.status - b.status);
  };

  const saveDateStorage = function () {
    localStorage.setItem('updateTime', JSON.stringify(Date.now()));
  };

  const checkComplete = function () {
    if (
      JSON.parse(localStorage.getItem('list'))
        .map(item => item.status)
        .every(status => status === true)
    ) {
      mainEl.classList.add('opacity-0');
      setInterval(() => {
        completeModal.classList.remove('hidden');
      }, 300);
      setInterval(() => {
        completeModal.classList.remove('opacity-0');
      }, 1000);
    }
  };

  // Authentication
  if (!authenticated) {
    passwordInput.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (passwordInput.value !== 'lily') {
        setTimeout(() => {
          passwordErrMsg.classList.remove('hidden');
        }, 100);
        setTimeout(() => {
          passwordErrMsg.classList.remove('opacity-0');
        }, 200);
        passwordInput.focus();
        return;
      }
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 500);
      modal.classList.add('opacity-0');
      authenticated = true;
      setTimeout(() => {
        mainEl.classList.remove('hidden');
      }, 200);
      setTimeout(() => {
        mainEl.classList.remove('opacity-0');
      }, 300);
      localStorage.setItem('authenticated', JSON.stringify(true));
      mainEl.style.marginTop = `${
        document.querySelector('header').offsetHeight
      }px`;
      saveDateStorage();
      // Display items on page
      localData.forEach(item => displayItems(item));
    });
  } else {
    // Remove modal and show main elements
    modal.classList.add('hidden');
    mainEl.classList.remove('hidden');
    mainEl.classList.remove('opacity-0');
    // sort the items by complete
    sortComplete();
    // display items
    localData.forEach(item => displayItems(item));
  }

  // CLear data after 12 hours
  if (Date.now() - JSON.parse(localStorage.getItem('updateTime')) > 43200000) {
    localStorage.removeItem('list');
    localStorage.removeItem('authenticated');
  }
  // Create local storage if does not exist
  if (!localStorage.getItem('list')) {
    localStorage.setItem('list', JSON.stringify(todoItemsArr));
  }
  // Load local storage if list exists
  if (localStorage.getItem('list')) {
    localData = JSON.parse(localStorage.getItem('list'));
    // setLoadChecks();
    checkComplete();
  }

  // Countdown
  // time to countdown
  const countDownDate = storedTime + 43200000;
  setInterval(function () {
    const distance = countDownDate - Date.now();
    const hours = String(
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const minutes = String(
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    );
    const seconds = String(Math.floor((distance % (1000 * 60)) / 1000));

    document.getElementById('hours').innerText = `${hours.padStart(2, 0)}`;
    document.getElementById('mins').innerText = `${minutes.padStart(2, 0)}`;
    document.getElementById('secs').innerText = `${seconds.padStart(2, 0)}`;
  }, 1000);

  // Event Handlers
  todoItemsList.addEventListener('click', function (e) {
    if (e.target.nodeName !== 'INPUT') return;

    // Get target name
    const targetName = e.target.name;
    const localDataName = localData.find(item => item.name === targetName);

    // Set item status
    localDataName.status = !localDataName.status;

    if (localDataName.status) {
      e.target.parentElement
        .querySelector('.fa-check')
        .classList.remove('opacity-0');
    }
    if (!localDataName.status) {
      e.target.parentElement
        .querySelector('.fa-check')
        .classList.add('opacity-0');
    }

    localStorage.setItem('list', JSON.stringify(localData));
    todoItemsList.innerHTML = '';
    sortComplete();
    localData.forEach(item => displayItems(item));
    checkComplete();
  });

  resetBtn.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
  });
};
