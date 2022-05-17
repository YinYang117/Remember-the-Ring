const submitForm = document.getElementById('completed-task-form');





submitTasksButton()

const submitForm = document.getElementById('completed-task-form');
submitForm.addEventListener('submit', completeTask)

const anchor = document.createElement('a')
const li = document.createElement('label');

anchor.append(li)
li.innerHTML = `<div class="task-display"><input type="checkbox" class="task-check-boxes" name="${elem.title}" value="${elem.id}"><span id="title-${elem.id}" class="spanTitle">${elem.title}</span><span id="dueTime-${elem.id}" class="spanDueTime">  ${elem.dueTime || ''}</span></div>`

const taskCompleteButtonCheck = document.getElementById('task-complete-button');
if (taskCompleteButtonCheck) taskCompleteButtonCheck.remove();