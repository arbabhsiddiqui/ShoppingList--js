const form = document.getElementById('item-form');
const txtItemInput = document.getElementById('item-input');
const filter = document.getElementById('filter');
const itemContainer = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const shoppingList = 'shoppingList';
let valueBeforeUpdate = '';

const getListFromLocalStorage = () => {
  return localStorage.getItem(shoppingList) != null
    ? JSON.parse(localStorage.getItem(shoppingList))
    : [];
};

const setItems = () => {
  let items = getListFromLocalStorage();
  if (items) {
    items.map((item) => {
      AddItemToDom(item);
    });
  }
};

const AddItemToDom = (item) => {
  let li = document.createElement('li');
  console.log(item.name);
  li.appendChild(document.createTextNode(item.name));
  li.classList.add('its');

  item.isBuy === true && li.classList.add('bg-grey');

  let div = document.createElement('div');
  div.classList.add('d-flex', 'gap');

  let deleteBtn = createDeleteButton(['remove-item', 'btn-link', 'text-red']);
  let editBtn = createEditButton(['btn-link', 'edit-item']);

  div.appendChild(editBtn);
  div.appendChild(deleteBtn);

  li.appendChild(div);

  itemContainer.appendChild(li);
};

const createEditButton = (btnClass) => {
  const btn = document.createElement('button');
  btn.classList.add(...btnClass);
  let icon = createIcon(['fa-solid', 'fa-pen']);
  btn.appendChild(icon);
  return btn;
};

const createDeleteButton = (btnClass) => {
  const btn = document.createElement('button');
  btn.classList.add(...btnClass);
  let icon = createIcon(['fa-solid', 'fa-xmark']);
  btn.appendChild(icon);
  return btn;
};

const createIcon = (iconClass) => {
  const icon = document.createElement('i');
  icon.classList.add(...iconClass);
  return icon;
};

const addItemToLocalStorage = (item) => {
  let lists = getListFromLocalStorage();
  lists.push(item);
  localStorage.setItem(shoppingList, JSON.stringify(lists));
};

const createItem = (e) => {
  e.preventDefault();

  if (txtItemInput.value === null || txtItemInput.value === '') {
    alert('Please Enter Value');
    return;
  }

  let itemObj = {
    name: txtItemInput.value,
    isBuy: false,
  };

  AddItemToDom(itemObj);
  // add item to local storage
  addItemToLocalStorage(itemObj);
  txtItemInput.value = '';
  checkUi();
};

const checkUi = () => {
  const items = document.querySelectorAll('#item-list li');
  if (items.length === 0) {
    clearBtn.classList.add('d-none');
    filter.classList.add('d-none');
  } else {
    clearBtn.classList.remove('d-none');
    filter.classList.remove('d-none');
  }
};

const removeItemFromLocalStorage = (itemText) => {
  let items = getListFromLocalStorage();
  items = items.filter((i) => i.name !== itemText);
  localStorage.setItem(shoppingList, JSON.stringify(items));
};

const toggleBuyState = (element) => {
  element.classList.toggle('bg-grey');
  let list = getListFromLocalStorage();

  list = list.map((item) => {
    let { name, isBuy } = item;
    if (name === element.textContent) {
      isBuy = !isBuy;
    }
    return { name, isBuy };
  });
  localStorage.setItem(shoppingList, JSON.stringify(list));
};

const filterItems = (e) => {
  const items = document.querySelectorAll('#item-list li');
  let filterValue = e.target.value.toLowerCase();

  items.forEach((item) => {
    let itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(filterValue) != -1) {
      item.classList.remove('d-none');
    } else {
      item.classList.add('d-none');
    }
  });
};

const updateItemToDom = (updatedValue) => {
  console.log('beforeUpdate', valueBeforeUpdate);
  let lists = getListFromLocalStorage();
  let updatedLists = lists.map((item) => {
    let { name, isBuy } = item;
    if (name === valueBeforeUpdate) {
      name = updatedValue;
    }
    return { name, isBuy };
  });
  localStorage.setItem(shoppingList, JSON.stringify(updatedLists));
  itemContainer.innerHTML = '';
  setItems();
  checkUi();
};

const handelClear = () => {
  itemContainer.innerHTML = '';
  localStorage.clear();
  checkUi();
};

const handelSubmit = (e) => {
  e.preventDefault();

  if (txtItemInput.value === null || txtItemInput.value === '') {
    alert('Please Enter Value');
    return;
  }

  let submitBtn = document.getElementById('submitBtn');

  if (submitBtn.textContent.trim() === 'Add Item') {
    console.log('first');
  } else {
    updateItemToDom(txtItemInput.value);
  }
};

const handelItemClick = (e) => {
  if (e.target.classList.contains('its')) {
    toggleBuyState(e.target);
  }

  if (
    e.target.classList.contains('edit-item') ||
    e.target.classList.contains('fa-pen')
  ) {
    txtItemInput.value =
      e.target.parentElement.parentElement.parentElement.textContent;
    valueBeforeUpdate =
      e.target.parentElement.parentElement.parentElement.textContent;
    document.getElementById('submitBtn').textContent = 'Update Item';
  }

  if (
    e.target.classList.contains('remove-item') ||
    e.target.classList.contains('fa-xmark')
  ) {
    removeItemFromLocalStorage(
      e.target.parentElement.parentElement.parentElement.textContent
    );
    e.target.parentElement.parentElement.parentElement.remove();
    checkUi();
  }
};

// event Listener

window.addEventListener('load', () => {
  setItems();
  checkUi();
});

form.addEventListener('submit', handelSubmit);

itemContainer.addEventListener('click', handelItemClick);

clearBtn.addEventListener('click', handelClear);

filter.addEventListener('input', filterItems);
