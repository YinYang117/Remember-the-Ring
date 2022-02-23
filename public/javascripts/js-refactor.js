
const displayAllTasks = () => {
const res = await fetch(`/lists/${userId}/tasks`);
const userInfo = await res.json();
const taskArea = document.querySelector('.task-list')
taskArea.innerHTML = '';

const changeListTitle = document.querySelector('.current-task-title');
changeListTitle.innerHTML = 'All your tasks'

addListItem(userInfo.userTasks)
}