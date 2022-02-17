document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();

    const listElement = document.querySelector('#user-lists');
    console.log(sessionStorage)

    const defaultLists = document.querySelector('.default-lists')


    defaultLists.addEventListener('click', async (e) => {
        if (e.target.id === 'all-tasks') {
            const res = await fetch(`/lists/info/${userId}`);
            const userInfo = await res.json();
            userInfo.userTasks.forEach(elem => {
                const li = document.createElement('li');
                const taskArea = document.querySelector('.task-list')
                li.innerHTML = elem.title
                li.id = elem.id
                taskArea.append(li);
                li.addEventListener('click', (event) => {
                    console.log(elem.description);
                })
            })
        }

        else if (e.target.id === 'today-tasks') {
            const res = await fetch(`/lists/today/${userId}`);
            const tasksToday = await res.json();
        }

    })
})
