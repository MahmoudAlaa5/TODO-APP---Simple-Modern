// ========================================
// TODO APP - SIMPLE VERSION (Using Local Storage)
// ========================================

// 1. VARIABLES - Store our data and get HTML elements
let allTasks = []; // Array to store all our tasks (each task is an object with text and completed status)
const addButton = document.querySelector('.add-btn'); // The + button
const taskInput = document.querySelector('input'); // The text input box

// 2. MAIN FUNCTION - Add a new task
function addNewTask(taskText) {
    // Check if input is empty
    if (!taskText || taskText.trim() === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Add task to our array (as an object with text and completed status)
    const newTask = {
        text: taskText.trim(),
        completed: false
    };
    allTasks.push(newTask);
    
    // Create the task on the webpage
    createTaskElement(newTask);
    
    // Clear the input box
    taskInput.value = '';
    
    // Save to browser storage
    saveTasks();
}

// 3. CREATE TASK ELEMENT - Show task on the webpage
function createTaskElement(task) {
    // Get the container where tasks go
    const tasksContainer = document.querySelector('.tasks-container');
    
    // Create a new div for this task
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-box';
    
    // Add completed class if task is already completed
    if (task.completed) {
        taskDiv.classList.add('completed');
    }
    
    // Add the HTML content for the task
    taskDiv.innerHTML = `
        <p class="task-text">${task.text}</p>
        <div class="task-actions">
            <button class="edit-btn" title="Edit task">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button class="complete-btn ${task.completed ? 'completed' : ''}" title="Mark as complete">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="delete-btn" title="Delete task">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add smooth animation
    taskDiv.classList.add('task-fade-in');
    
    // Put the task on the webpage
    tasksContainer.appendChild(taskDiv);
    
    // Add click events to the buttons
    addTaskButtonEvents(taskDiv, task);
}

// 4. ADD BUTTON EVENTS - Make buttons work when clicked
function addTaskButtonEvents(taskDiv, task) {
    const editButton = taskDiv.querySelector('.edit-btn');
    const completeButton = taskDiv.querySelector('.complete-btn');
    const deleteButton = taskDiv.querySelector('.delete-btn');
    const taskTextElement = taskDiv.querySelector('.task-text');
    
    // Edit button - start editing
    editButton.addEventListener('click', () => {
        startEditingTask(taskDiv, taskTextElement, task);
    });
    
    // Complete button - mark as done
    completeButton.addEventListener('click', () => {
        // Toggle the completed status
        task.completed = !task.completed;
        
        // Update the visual appearance
        taskDiv.classList.toggle('completed');
        completeButton.classList.toggle('completed');
        
        // Save the change to localStorage
        saveTasks();
    });
    
    // Delete button - remove task
    deleteButton.addEventListener('click', () => {
        deleteTask(taskDiv, task);
    });
}

// 5. DELETE TASK - Remove task from webpage and array
function deleteTask(taskDiv, task) {
    // Add fade out animation
    taskDiv.classList.add('task-fade-out');
    
    // Wait for animation, then remove
    setTimeout(() => {
        taskDiv.remove();
        
        // Remove from our array
        const taskIndex = allTasks.indexOf(task);
        if (taskIndex > -1) {
            allTasks.splice(taskIndex, 1);
            saveTasks(); // Save the change
        }
    }, 300);
}

// 6. START EDITING - Replace text with input box
function startEditingTask(taskDiv, taskTextElement, task) {
    // Create input box
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.text;
    editInput.className = 'edit-input';
    
    // Create save and cancel buttons
    const saveButton = document.createElement('button');
    saveButton.className = 'save-btn';
    saveButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    saveButton.title = 'Save changes';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-btn';
    cancelButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    cancelButton.title = 'Cancel editing';
    
    // Hide the text, show the input
    taskTextElement.style.display = 'none';
    taskTextElement.parentNode.insertBefore(editInput, taskTextElement);
    
    // Hide edit button, show save/cancel buttons
    const taskActions = taskDiv.querySelector('.task-actions');
    const editButton = taskDiv.querySelector('.edit-btn');
    editButton.style.display = 'none';
    
    taskActions.insertBefore(saveButton, editButton);
    taskActions.insertBefore(cancelButton, editButton);
    
    // Focus on the input and select all text
    editInput.focus();
    editInput.select();
    
    // What happens when we save
    const saveChanges = () => {
        const newText = editInput.value.trim();
        if (newText && newText !== task.text) {
            // Update the text
            taskTextElement.textContent = newText;
            
            // Update our array
            task.text = newText;
        }
        
        // Go back to normal view
        exitEditMode(taskDiv, taskTextElement, editInput, saveButton, cancelButton, editButton);
        saveTasks(); // Save the change
    };
    
    // What happens when we cancel
    const cancelChanges = () => {
        // Go back to normal view without saving
        exitEditMode(taskDiv, taskTextElement, editInput, saveButton, cancelButton, editButton);
    };
    
    // Add click events to save and cancel buttons
    saveButton.addEventListener('click', saveChanges);
    cancelButton.addEventListener('click', cancelChanges);
    
    // Add keyboard events
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveChanges();
        } else if (e.key === 'Escape') {
            cancelChanges();
        }
    });
    
    // Save when clicking outside the input
    editInput.addEventListener('blur', () => {
        if (editInput.value.trim() !== task.text) {
            saveChanges();
        } else {
            cancelChanges();
        }
    });
}

// 7. EXIT EDIT MODE - Go back to normal view
function exitEditMode(taskDiv, taskTextElement, editInput, saveButton, cancelButton, editButton) {
    // Show the text again
    taskTextElement.style.display = 'block';
    
    // Remove the input and buttons
    editInput.remove();
    saveButton.remove();
    cancelButton.remove();
    
    // Show the edit button again
    editButton.style.display = 'flex';
}

// 8. SAVE TASKS - Store tasks in browser
function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
}

// 9. LOAD TASKS - Get tasks from browser storage
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            allTasks = JSON.parse(savedTasks);
            showAllTasks();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        allTasks = [];
    }
}

// 10. SHOW ALL TASKS - Display all saved tasks
function showAllTasks() {
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.innerHTML = ''; // Clear everything first
    
    // Create each task
    allTasks.forEach(task => {
        createTaskElement(task);
    });
}

// 11. EVENT LISTENERS - Make buttons work
// When add button is clicked
addButton.addEventListener('click', () => {
    addNewTask(taskInput.value);
});

// When Enter key is pressed in input
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTask(taskInput.value);
    }
});

// 12. START THE APP - Load saved tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks(); // Load any saved tasks
    taskInput.focus(); // Focus on input box
});