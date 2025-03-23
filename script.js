// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task
addTaskBtn.addEventListener('click', addTask);

// Drag and Drop functionality
let draggedItem = null;

taskList.addEventListener('dragstart', (e) => {
  draggedItem = e.target;
  e.target.style.opacity = '0.5';
});

taskList.addEventListener('dragend', (e) => {
  e.target.style.opacity = '1';
  draggedItem = null;
});

taskList.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskList, e.clientY);
  const currentItem = document.querySelector('.dragging');
  if (afterElement == null) {
    taskList.appendChild(draggedItem);
  } else {
    taskList.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Add Task Function
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';
  taskItem.draggable = true;

  taskItem.innerHTML = `
    <span>${taskText}</span>
    <button class="delete-btn">Delete</button>
  `;

  taskList.appendChild(taskItem);
  taskInput.value = '';

  // Save to local storage
  saveTasks();

  // Add event listener for delete button
  taskItem.querySelector('.delete-btn').addEventListener('click', deleteTask);

  // Add event listener for task completion
  taskItem.addEventListener('click', toggleComplete);
}

// Delete Task Function
function deleteTask(e) {
  const taskItem = e.target.parentElement;
  taskList.removeChild(taskItem);
  saveTasks();
}

// Toggle Task Completion
function toggleComplete(e) {
  if (e.target.tagName === 'SPAN') {
    e.target.parentElement.classList.toggle('completed');
    saveTasks();
  }
}

// Save Tasks to Local Storage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task-item').forEach(task => {
    tasks.push({
      text: task.querySelector('span').innerText,
      completed: task.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.draggable = true;

    taskItem.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn">Delete</button>
    `;

    if (task.completed) {
      taskItem.classList.add('completed');
    }

    taskList.appendChild(taskItem);

    // Add event listener for delete button
    taskItem.querySelector('.delete-btn').addEventListener('click', deleteTask);

    // Add event listener for task completion
    taskItem.addEventListener('click', toggleComplete);
  });
}