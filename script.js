let TODO_ITEM_ID = "todoTask";

let taskList;

let searchBox = document.querySelector(".search-area");
let taskTemplate = document.getElementById("todo-template");
let tasksContainer = document.querySelector("[data-tasks]");
let testBtn = document.querySelector(".btn-all");
let taskItem = document.getElementById("task");
let todoCount = document.querySelector(".task-count");

let formTodoItem = document.querySelector("[data-form-area]");
let inputTodoItem = document.querySelector("[data-input-area]");

function taskCounter() {
  const updatedTaskList = taskList.filter((item) => item.complete === false);
  if (updatedTaskList.length === 1) {
    todoCount.textContent = `${updatedTaskList.length} task is remaining`;
  } else {
    todoCount.textContent = `${updatedTaskList.length} tasks are remaining`;
  }
}

function footerButtonCounter(count, message) {
  if (count === 1) {
    todoCount.textContent = `${count} item ${message}`;
  } else {
    todoCount.textContent = `${count} items ${message}`;
  }
}

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const getCheckedTodo = taskList.find((item) => item.id === e.target.id);

    console.log(getCheckedTodo);
    const fetchIndex = taskList.indexOf(getCheckedTodo);
    console.log(fetchIndex);
    taskList[fetchIndex].complete = e.target.checked;
    console.log(taskList);
    save(taskList);
    taskCounter();
  }
});

let save = (todos) => {
  localStorage.setItem(TODO_ITEM_ID, JSON.stringify(todos));
};

let createTask = (name) => {
  return { id: Date.now().toString(), name: name, complete: false };
};

function checkLocalStorage() {
  let items;
  if (localStorage.getItem(TODO_ITEM_ID) === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem(TODO_ITEM_ID));
  }
  taskList = items;
  return items;
}
formTodoItem.addEventListener("submit", (e) => {
  e.preventDefault();
  let todos = checkLocalStorage();
  const taskValue = inputTodoItem.value;
  console.log(taskValue);

  if (taskValue === null || taskValue === "") {
    return;
  }

  const task = createTask(taskValue);
  inputTodoItem.value = null;
  todos.push(task);
  save(todos);
  render();
  location.reload();
});

function render() {
  clearElement(tasksContainer);
  let todos = checkLocalStorage();
  todos.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkBox = taskElement.querySelector("input");
    checkBox.id = task.id;
    checkBox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
  taskCounter();
}
render();

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

searchBox.addEventListener("input", function () {
  let selectAllTask = document.querySelectorAll(".task");
  Array.from(selectAllTask).forEach(function (item) {
    let Searchedtext = item.querySelector("label").innerText;
    console.log(Searchedtext);
    let searcTextVal = searchBox.value;
    let reg = new RegExp(searcTextVal, "gi");
    if (Searchedtext.match(reg)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});

let allBtn = document.querySelector(".btn-all");
let allActive = document.querySelector(".btn-active");
let allComplete = document.querySelector(".btn-complete");

allActive.addEventListener("click", function () {
  let counter = 0;
  let todos = checkLocalStorage();
  let getAllTask = document.querySelectorAll(".task");
  Array.from(getAllTask).forEach((item) => {
    let getID = item.querySelector("input").id;
    const status = todos.some(
      (task) => task.id === getID && task.complete === false
    );
    if (status) {
      item.style.display = "flex";
      ++counter;
    } else {
      item.style.display = "none";
    }
    console.log(getID, status);
  });

  footerButtonCounter(counter, "are active");
});

allComplete.addEventListener("click", function () {
  let counter = 0;
  let todos = checkLocalStorage();
  let getAllTask = document.querySelectorAll(".task");
  Array.from(getAllTask).forEach((item) => {
    let getID = item.querySelector("input").id;
    const status = todos.some(
      (task) => task.id === getID && task.complete === true
    );
    if (status) {
      item.style.display = "flex";
      ++counter;
    } else {
      item.style.display = "none";
    }
    console.log(getID, status);
  });
  footerButtonCounter(counter, "are completed");
});

allBtn.addEventListener("click", function () {
  let counter = 0;
  let getAllTask = document.querySelectorAll(".task");
  Array.from(getAllTask).forEach((item) => {
    ++counter;
    item.style.display = "flex";
  });
  footerButtonCounter(counter, "in total");
});

let deleteBtn = document.querySelectorAll(".btn-delete");
Array.from(deleteBtn).forEach((item) => {
  item.addEventListener("click", () => {
    console.log(item.previousElementSibling.getAttribute("for"));
    let itemID = item.previousElementSibling.getAttribute("for");
    let todos = checkLocalStorage();
    let fetchIndexOfDeleteingItem = todos.findIndex((item) => {
      return item.id === itemID;
    });

    todos.splice(fetchIndexOfDeleteingItem, 1);
    console.log(fetchIndexOfDeleteingItem);
    save(todos);
    console.log(todos);
    render();
    location.reload();
  });
});
