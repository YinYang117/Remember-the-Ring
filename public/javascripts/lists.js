document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();


    const listElement = document.querySelector('#user-lists');

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
            userInfo.userTasks.forEach(elem => {
                const anchor = document.createElement('a')
                const li = document.createElement('li');
                anchor.append(li)
                const taskArea = document.querySelector('.task-list')
                li.innerHTML = elem.title
                li.id = elem.id
                taskArea.append(li);
                li.addEventListener('click', (e) => {
                    const taskEditArea = document.querySelector(".task-edit-area")

                    taskEditArea.innerHTML = `
                    <div class="task-edit-div">
                        <form id="form-edit">
                            <input type="text" name="title" placeholder=${elem.title} id="task-name-edit">
                            <input type='text' name="description" placeholder=${elem.description} id="task-description-edit">
                            <div class="date-time-edit-container">
                                <input type="date" name="dueDate" placeholder=${elem.dueDate} id="task-date-edit">
                                <input type="time" name="dueTime" placeholder=${elem.dueTime} id="task-time-edit">
                                <input type="number" name="experienceReward" placeholder=${elem.experienceReward} id="task-exp-edit">
                            </div>
                            <button class="task-edit-update-button">Update</button>
                            <button class="task-edit-delete-button">Delete</button>
                        </form>
                    </div>`

                    const updateBtn = document.querySelector('.task-edit-update-button');
                    updateBtn.addEventListener('click', async (e) => {
                        const titleValue = document.getElementById("task-name-edit").value;
                        const descriptionValue = document.getElementById("task-description-edit").value;
                        const dateValue = document.getElementById("task-date-edit").value;
                        const timeValue = document.getElementById("task-time-edit").value;
                        const experienceValue = document.getElementById("task-exp-edit").value;

                        const res = await fetch(`/tasks/${elem.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: {
                                

                            }

                        })

                    })

                    const deleteBtn = document.querySelector('.task-edit-delete-button');
                    deleteBtn.addEventListener('click', async (e) => {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        li.remove();
                        taskEditArea.innerHTML = '';
                        const res = await fetch(`/tasks/${elem.id}`, { method: 'DELETE' });
                    })
                })
            })
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
