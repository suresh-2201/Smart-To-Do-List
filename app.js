let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let darkMode = false;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  const filtered = tasks.filter(t =>
    currentFilter === "all" ? true :
    currentFilter === "completed" ? t.done :
    !t.done
  );

  document.getElementById("counter").textContent = `${filtered.length} task(s)`;

  filtered.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row fade-in";
    if (task.done) li.classList.add("task-completed");

    li.innerHTML = `
      <div class="d-flex align-items-center flex-wrap">
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleDone(${i})">
        <span class="ms-2">${task.title}</span>
        <input type="date" value="${task.date || ''}" class="form-control form-control-sm ms-3 mt-2 mt-md-0" style="max-width: 160px;" onchange="updateDueDate(${i}, this.value)">
      </div>
      <div class="mt-2">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editTask(${i})">Edit</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${i})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase() === currentFilter || (currentFilter === "active" && btn.textContent === "Pending"))
      btn.classList.add("active");
  });
}

function updateDueDate(index, value) {
  tasks[index].date = value;
  saveTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate").value;
  const title = input.value.trim();
  if (!title) return;
  tasks.push({ title, done: false, date: dueDate });
  input.value = "";
  document.getElementById("dueDate").value = "";
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newTitle = prompt("Edit your task:", tasks[index].title);
  if (newTitle !== null) {
    tasks[index].title = newTitle.trim();
    saveTasks();
    renderTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function toggleTheme() {
  darkMode = !darkMode;
  document.body.className = darkMode ? "dark" : "light";
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Your To-Do List", 10, 10);
  tasks.forEach((t, i) => {
    doc.text(`${i + 1}. ${t.title} ${t.date ? "📅 " + t.date : ""}`, 10, 20 + i * 10);
  });
  doc.save("todo-list.pdf");
}

function exportToExcel() {
  const ws = XLSX.utils.json_to_sheet(tasks);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tasks");
  XLSX.writeFile(wb, "todo-list.xlsx");
}

renderTasks();
