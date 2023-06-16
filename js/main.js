const form = document.getElementById('item-form');
const txtItemInput = document.getElementById('item-input');
const filter = document.getElementById('filter');
const itemContainer = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const notice = document.querySelectorAll('.notice');
const alreadyExistNotice = document.getElementById('AlreadyWarning');
const emptyNotice = document.getElementById('emptyWarning');
const addNotice = document.getElementById('addSuccess');
const updateNotice = document.getElementById('updateSuccess');
const errorNotice = document.getElementById('errorDanger');
const shoppingList = 'shoppingList';
let valueBeforeUpdate = '';

const getListFromLocalStorage = () => {
  return localStorage.getItem(shoppingList) != null
    ? JSON.parse(localStorage.getItem(shoppingList))
    : [];
};

const setItems = () => {
  itemContainer.innerHTML = '';
  let items = getListFromLocalStorage();
  if (items) {
    items.map((item) => {
      AddItemToDom(item);
    });
  }
};

const AddItemToDom = (item) => {
  let li = document.createElement('li');
  li.appendChild(document.createTextNode(item.name));
  li.classList.add('its');

  item.isBuy === true && li.classList.add('bg-grey');

  let div = document.createElement('div');
  div.classList.add('d-flex', 'gap');

  let deleteBtn = createDeleteButton(['remove-item', 'btn-link', 'text-red']);
  let editBtn = createEditButton(['btn-link', 'edit-item', 'text-secondary']);

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

const createItem = (inputValue) => {
  // create object
  let itemObj = {
    name: inputValue,
    isBuy: false,
  };

  AddItemToDom(itemObj);
  // add item to local storage
  addItemToLocalStorage(itemObj);
  txtItemInput.value = '';
  addNotice.classList.add('show');
  resetNotice();
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

const checkDuplicate = (insertValue) => {
  let list = getListFromLocalStorage();

  list = list.filter(
    (item) => item.name.toLowerCase() === insertValue.toLowerCase()
  );

  if (list.length > 0) {
    return true;
  } else {
    return false;
  }
};

const updateItemToDom = (updatedValue) => {
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
  updateNotice.classList.add('show');
  resetNotice();
  setItems();
  checkUi();
};

const handelClear = () => {
  itemContainer.innerHTML = '';
  localStorage.clear();
  checkUi();
};

const resetNotice = () => {
  setTimeout(() => {
    notice.forEach((item) => {
      if (item.classList.contains('show')) {
        item.classList.remove('show');
      }
    });
  }, 3000);
};

const handelSubmit = (e) => {
  e.preventDefault();

  if (txtItemInput.value === null || txtItemInput.value === '') {
    emptyNotice.classList.add('show');
    resetNotice();
    return;
  }

  if (checkDuplicate(txtItemInput.value)) {
    alreadyExistNotice.classList.add('show');
    resetNotice();
    return;
  }

  let submitBtn = document.getElementById('submitBtn');

  if (submitBtn.textContent.trim() === 'Add Item') {
    createItem(txtItemInput.value);
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
