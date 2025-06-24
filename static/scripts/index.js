document.addEventListener('DOMContentLoaded', () => {
    const inProgress = document.querySelector('.in-progress');
    const completedTasks = document.querySelector('.completed-task');
    const allTasks = document.querySelector('.all-tasks');
    const addTask = document.querySelector('.add-task');
    const viewTask = document.querySelector('.view-tasks-container');
    const saveButton = document.getElementById('save-task');
    const cancelBtn = document.getElementById('cancel');
    const pending = document.querySelector('.pending');
    const all = document.querySelector('.all');
    const complete = document.querySelector('.complete');
    const closeTaskView = document.querySelector('.closeTaskView');
    const loadedTasks = localStorage.getItem('tasks');

    let taskArray = loadedTasks ? JSON.parse(loadedTasks) : [];

    inProgress.addEventListener('click', function(){
        viewTask.style.display = 'block';
        createTask(taskArray.filter((task) => !task.completed));
    });

    completedTasks.addEventListener('click', function(){
        viewTask.style.display = 'block';
        createTask(taskArray.filter((task) => task.completed));
    });

    allTasks.addEventListener('click', function(){
        viewTask.style.display = 'block';
        createTask(taskArray);
    });

    addTask.addEventListener('click', () => {
        viewTask.style.display = 'block';
    });

    pending.addEventListener('click', () => {
        createTask(taskArray.filter((task) => !task.completed));
    });

    all.addEventListener('click', () => {
        createTask(taskArray);
    });

    complete.addEventListener('click', () => {
        createTask(taskArray.filter((task) => task.completed));
    });

    closeTaskView.addEventListener('click', () => {
        viewTask.style.display = 'none';
    });

    function createTask(filteredTask = taskArray) {
        const taskList = document.querySelector('.task-list');
        taskList.innerHTML = '';
        filteredTask.forEach((tasks, index) => {
            const task = document.createElement('div');
            task.className = 'task';
            task.innerHTML = `
                <input type="checkbox" id="checkbox-${index}">
                <p>${tasks.todo}</p>
                <div class="task-buttons">
                    <button id="delete-btn">
                        Delete
                        <img src="static/images/Trash.svg">
                    </button>
                </div>
            `;

            const deleteBtn = task.querySelector('#delete-btn');
            deleteBtn.addEventListener('click', () => {
                taskArray.splice(index, 1);
                save();
                createTask();
            });

            const checkbox = task.querySelector(`#checkbox-${index}`);
            checkbox.checked = tasks.completed || false;
            if (checkbox.checked){
                task.querySelector('p').style.textDecoration = 'line-through';
            }
            checkbox.addEventListener('change', (e) => {
                taskArray[index].completed = e.target.checked;
                if (e.target.checked) {
                    task.querySelector('p').style.textDecoration = 'line-through';
                } else {
                    task.querySelector('p').style.textDecoration = 'none';
                }
                save();
            });
            taskList.appendChild(task);
        });
    }

    saveButton.addEventListener('click', () => {
        const taskInput = document.getElementById('task-input');
        const taskDescription = document.getElementById('description');
        if (!taskInput.value.trim() || !taskDescription.value.trim()) {
            return;
        }
        save();
        createTask();
        taskInput.value = '';
        taskDescription.value = '';
    });

    cancelBtn.addEventListener('click', () => {
        viewTask.style.display = 'none';
    });

    function save() {
        localStorage.setItem('tasks', JSON.stringify(taskArray));
    }

    async function getTodo(){
        const response = await fetch('https://dummyjson.com/todos');
        const data = await response.json();
        taskArray = data.todos
        //console.log(taskArray);
        createTask(taskArray);
    }
    getTodo();
});