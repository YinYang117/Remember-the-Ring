document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();


    const listElement = document.querySelector('#user-lists');
    console.log(sessionStorage)

    const taskSearchInput = document.getElementById('task-search-input')
    const taskSearchButton = document.getElementById('task-search-button')
    taskSearchButton.addEventListener('click', async (event) => {
        // If we add cookies to remember list selection, delete them
        // save input in input field
        // check to see if it's blank
        // then take input and search titles of all tasks
        // can I build this all in here, or do I need to make a fetch?
        // let tasks = await Task.findAll({
        //     where: {
        //         [Op.and]: [{ userId: userId }, { title:  }]
        //     },
        //     order: [['dueTime', 'ASC']]
        // })
        // tasksArray.push(...tasks)
        event.preventDefault();
        const res = await fetch(`/lists/${userId}/tasks/search`);
        // console.log("res", res)
        // console.log("Res body", res.body)
        userTasks = await res.json()
        console.log("User Tasks", userTasks)
    })

    const defaultLists = document.querySelector('.default-lists')
    defaultLists.addEventListener('click', async (e) => {
        if (e.target.id === 'all-tasks') {
            const res = await fetch(`/lists/${userId}/tasks`);
            const userInfo = await res.json();
            console.log("*************** User Info", userInfo)
            userInfo.userTasks.forEach(elem => {
                const anchor = document.createElement('a')
                const li = document.createElement('li');
                anchor.append(li)
                const taskArea = document.querySelector('.task-list')
                li.innerHTML = elem.title
                li.id = elem.id
                taskArea.append(li);
                li.addEventListener('click', (event) => {
                    const taskEditArea = document.querySelector(".task-edit-area")
                    taskEditArea.innerHTML = `
                    <div class="task-edit-div">
                        <p>${elem.title}</p>
                        <p>${elem.description}</p>
                        <p>${elem.experienceReward}</p>
                        <p>${elem.dueDate}</p>
                        <p>${elem.dueTime}</p>
                        <button class="task-edit-update-button">Update</button>
                        <button class="task-edit-delete-button">Delete</button> 
                    </div>`
                })
            })
            console.log("*****************Should be getting all tasks")
        }

        else if (e.target.id === 'today-tasks') {
            const res = await fetch(`/lists/today/${userId}`);
            const { tasksToday } = await res.json();
            tasksToday.forEach(el => {
                const li = document.createElement('li');
                const taskArea = document.querySelector('.task-list');
                li.innerHTML = el.title;
                li.id = el.id;
                taskArea.append(li);
                li.addEventListener('click', (e) => {
                    console.log(el.description);
                })
            })
        }

        else if (e.target.id === 'tomorrow-tasks') {
            const res = await fetch(`/lists/tomorrow/${userId}`);
            const { tasksTomorrow } = await res.json();
            tasksTomorrow.forEach(el => {
                const li = document.createElement('li');
                const taskArea = document.querySelector('.task-list');
                li.innerHTML = el.title;
                li.id = el.id;
                taskArea.append(li);
                li.addEventListener('click', (e) => {
                    console.log(el.description);
                })
            })
        }

        else if (e.target.id === 'this-week-tasks') {
            const res = await fetch(`/lists/this-week-tasks/${userId}`);
            const { tasksArray } = await res.json();

            tasksArray.forEach(el => {
                const li = document.createElement('li');
                const taskArea = document.querySelector('.task-list');
                li.innerHTML = el.title;
                li.id = el.id;
                taskArea.append(li);
                li.addEventListener('click', (e) => {
                    console.log(el.description);
                })
            })
        }
    })
})
