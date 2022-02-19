document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];
    console.log('User Id is here!!!!!!!!!!!!!', userId)

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();


    const listElement = document.querySelector('#user-lists');

    const defaultLists = document.querySelector('.default-lists')


    defaultLists.addEventListener('click', async (e) => {
        if (e.target.id === 'all-tasks') {
            const res = await fetch(`/lists/${userId}/tasks`);
            const userInfo = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = '';
            userInfo.userTasks.forEach(elem => {
                const anchor = document.createElement('a')
                const li = document.createElement('li');
                anchor.append(li)
                li.innerHTML = elem.title
                li.id = elem.id
                taskArea.append(li);
                li.addEventListener('click', async (event) => {
                    const updateTaskValuesRes = await fetch(`/tasks/${elem.id}`);
                    const updateTaskValues = await updateTaskValuesRes.json();
                    const taskEditArea = document.querySelector(".task-edit-area")
                    taskEditArea.innerHTML = `
                    <div class="task-edit-div">
                        <form id="form-edit">
                            <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
                            <input type='text' name="description" placeholder="description" id="task-description-edit" value="${updateTaskValues.task.description}">
                            <div class="date-time-edit-container">
                                <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
                                <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
                                <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
                            </div>
                            <button class="task-edit-update-button">Update</button>
                            <button class="task-edit-delete-button">Delete</button>
                        </form>
                    </div>`

                    const updateBtn = document.querySelector('.task-edit-update-button');
                    updateBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const titleValue = document.getElementById("task-name-edit").value;
                        const descriptionValue = document.getElementById("task-description-edit").value;
                        const dateValue = document.getElementById("task-date-edit").value;
                        const timeValue = document.getElementById("task-time-edit").value || null;
                        const experienceValue = document.getElementById("task-exp-edit").value;

                        const res = await fetch(`/tasks/${elem.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: titleValue,
                                description: descriptionValue,
                                experienceReward: experienceValue,
                                dueDate: dateValue,
                                dueTime: timeValue
                            })
                        })
                        const updatedRes = await res.json();
                        event.target.innerHTML = updatedRes.updatedTask.title;

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
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = ''
            tasksToday.forEach(el => {
                const anchor = document.createElement('a')
                const li = document.createElement('li');
                anchor.append(li)
                li.innerHTML = el.title
                li.id = el.id
                taskArea.append(li);
                li.addEventListener('click', async (event) => {
                    const updateTaskValuesRes = await fetch(`/tasks/${el.id}`);
                    const updateTaskValues = await updateTaskValuesRes.json();
                    const taskEditArea = document.querySelector(".task-edit-area")
                    taskEditArea.innerHTML = `
                    <div class="task-edit-div">
                        <form id="form-edit">
                            <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
                            <input type='text' name="description" placeholder="description" id="task-description-edit" value="${updateTaskValues.task.description}">
                            <div class="date-time-edit-container">
                                <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
                                <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
                                <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
                            </div>
                            <button class="task-edit-update-button">Update</button>
                            <button class="task-edit-delete-button">Delete</button>
                        </form>
                    </div>`

                    const updateBtn = document.querySelector('.task-edit-update-button');
                    updateBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const titleValue = document.getElementById("task-name-edit").value;
                        const descriptionValue = document.getElementById("task-description-edit").value;
                        const dateValue = document.getElementById("task-date-edit").value;
                        const timeValue = document.getElementById("task-time-edit").value || null;
                        const experienceValue = document.getElementById("task-exp-edit").value;

                        const res = await fetch(`/tasks/${el.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: titleValue,
                                description: descriptionValue,
                                experienceReward: experienceValue,
                                dueDate: dateValue,
                                dueTime: timeValue
                            })
                        })
                        const updatedRes = await res.json();
                        event.target.innerHTML = updatedRes.updatedTask.title;

                    })

                    const deleteBtn = document.querySelector('.task-edit-delete-button');
                    deleteBtn.addEventListener('click', async (e) => {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        li.remove();
                        taskEditArea.innerHTML = '';
                        const res = await fetch(`/tasks/${el.id}`, { method: 'DELETE' });
                    })
                })
            })
        }

        else if (e.target.id === 'tomorrow-tasks') {
            const res = await fetch(`/lists/tomorrow/${userId}`);
            const { tasksTomorrow } = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = ''
            tasksTomorrow.forEach(el => {
                const anchor = document.createElement('a')
                const li = document.createElement('li');
                anchor.append(li)
                li.innerHTML = el.title
                li.id = el.id
                taskArea.append(li);
                li.addEventListener('click', async (event) => {
                    const updateTaskValuesRes = await fetch(`/tasks/${el.id}`);
                    const updateTaskValues = await updateTaskValuesRes.json();
                    const taskEditArea = document.querySelector(".task-edit-area")
                    taskEditArea.innerHTML = `
                    <div class="task-edit-div">
                        <form id="form-edit">
                            <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
                            <input type='text' name="description" placeholder="description" id="task-description-edit" value="${updateTaskValues.task.description}">
                            <div class="date-time-edit-container">
                                <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
                                <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
                                <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
                            </div>
                            <button class="task-edit-update-button">Update</button>
                            <button class="task-edit-delete-button">Delete</button>
                        </form>
                    </div>`

                    const updateBtn = document.querySelector('.task-edit-update-button');
                    updateBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const titleValue = document.getElementById("task-name-edit").value;
                        const descriptionValue = document.getElementById("task-description-edit").value;
                        const dateValue = document.getElementById("task-date-edit").value;
                        const timeValue = document.getElementById("task-time-edit").value || null;
                        const experienceValue = document.getElementById("task-exp-edit").value;

                        const res = await fetch(`/tasks/${el.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: titleValue,
                                description: descriptionValue,
                                experienceReward: experienceValue,
                                dueDate: dateValue,
                                dueTime: timeValue
                            })
                        })
                        const updatedRes = await res.json();
                        event.target.innerHTML = updatedRes.updatedTask.title;

                    })

                    const deleteBtn = document.querySelector('.task-edit-delete-button');
                    deleteBtn.addEventListener('click', async (e) => {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        li.remove();
                        taskEditArea.innerHTML = '';
                        const res = await fetch(`/tasks/${el.id}`, { method: 'DELETE' });
                    })
                })
            })
        }

        else if (e.target.id === 'this-week-tasks') {
            const res = await fetch(`/lists/this-week-tasks/${userId}`);
            const { tasksWeek } = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = '';
            tasksWeek.forEach(el => {
                const anchor = document.createElement('a');
                const li = document.createElement('li');
                anchor.append(li);
                li.innerHTML = el.title;
                li.id = el.id;
                taskArea.append(li);
                li.addEventListener('click', async (event) => {
                    const updateTaskValuesRes = await fetch(`/tasks/${el.id}`);
                    const updateTaskValues = await updateTaskValuesRes.json();
                    const taskEditArea = document.querySelector(".task-edit-area")
                    taskEditArea.innerHTML = `
                    <div class="task-edit-div">
                        <form id="form-edit">
                            <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
                            <input type='text' name="description" placeholder="description" id="task-description-edit" value="${updateTaskValues.task.description}">
                            <div class="date-time-edit-container">
                                <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
                                <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
                                <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
                            </div>
                            <button class="task-edit-update-button">Update</button>
                            <button class="task-edit-delete-button">Delete</button>
                        </form>
                    </div>`

                    const updateBtn = document.querySelector('.task-edit-update-button');
                    updateBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const titleValue = document.getElementById("task-name-edit").value;
                        const descriptionValue = document.getElementById("task-description-edit").value;
                        const dateValue = document.getElementById("task-date-edit").value;
                        const timeValue = document.getElementById("task-time-edit").value || null;
                        const experienceValue = document.getElementById("task-exp-edit").value;

                        const res = await fetch(`/tasks/${el.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: titleValue,
                                description: descriptionValue,
                                experienceReward: experienceValue,
                                dueDate: dateValue,
                                dueTime: timeValue
                            })
                        })
                        const updatedRes = await res.json();
                        event.target.innerHTML = updatedRes.updatedTask.title;

                    })

                    const deleteBtn = document.querySelector('.task-edit-delete-button');
                    deleteBtn.addEventListener('click', async (e) => {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        li.remove();
                        taskEditArea.innerHTML = '';
                        const res = await fetch(`/tasks/${el.id}`, { method: 'DELETE' });
                    })
                })
            })
        }
    });




    // ############## LIST FUNCTIONALITY BEGINS HERE ################

    const userMadeLists = document.querySelector(".user-made-lists-container")

    userMadeLists.addEventListener('click', async e => {

        if (e.target.id === 'new-list-button') {

            const newListWindow = document.createElement('div');
            const hidePopUp = document.createElement('div');
            const pageContainer = document.querySelector('.page-container');
            const newListInput = document.createElement('input');
            const newListSubmit = document.createElement('button');
            const cancelListSubmit = document.createElement('button');
            const createNewListText = document.createElement('p');
            const newListError = document.createElement('span')
            const newListButtonsDiv = document.createElement('div');
            const newListForm = document.createElement('form');
            const csrfInput = document.createElement('form');


            newListWindow.append(createNewListText);
            newListWindow.append(newListError);
            newListWindow.append(newListForm);
            newListForm.append(csrfInput);
            newListForm.append(newListInput);
            newListForm.append(newListButtonsDiv);
            newListButtonsDiv.append(newListSubmit);
            newListButtonsDiv.append(cancelListSubmit);

            hidePopUp.classList.toggle("hide-pop-up");
            newListWindow.classList.toggle("new-list-window");
            newListSubmit.className = 'new-list-submit';
            cancelListSubmit.className = 'cancel-list-submit';
            newListInput.setAttribute('name', 'title');
            newListInput.setAttribute('value', '');
            csrfInput.setAttribute("type", "hidden");
            csrfInput.setAttribute("name", "_csrf");
            // TODO Find out if this needs csrf

            createNewListText.innerHTML = 'New list name:'
            newListSubmit.innerHTML = 'Submit'
            cancelListSubmit.innerHTML = 'Cancel'

            document.body.insertBefore(hidePopUp, pageContainer);
            hidePopUp.append(newListWindow);



            hidePopUp.addEventListener('click', e => {
                event.preventDefault();
                if (e.target.className === 'hide-pop-up' || e.target.className === 'cancel-list-submit') hidePopUp.remove();
            });


            newListForm.addEventListener('submit', async e => {
                e.preventDefault();
                try {

                    const taskCreateRes = await fetch(`/lists/${userId}/lists`, {
                        method: 'post',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: newListInput.value })
                    });

                    const taskCreate = await taskCreateRes.json();

                    if (taskCreate.errors) return newListError.innerHTML = taskCreate.errors.title

                    hidePopUp.remove();
                    const newListElement = document.createElement('li')
                    newListElement.innerHTML = taskCreate.newList.title;
                    userMadeLists.append(newListElement)

                    // TODO BREAK THIS DOWN INTO A FUNCTION
                    newListElement.addEventListener('click', async (e) => {
                        document.URL = `/lists/${userId}/lists/${taskCreate.newList.id}`
                        const res = await fetch(`/lists/${userId}/lists/${taskCreate.newList.id}/tasks`);
                        const newListTasks = await res.json();

                        const taskListAllLi = document.querySelectorAll('.task-list > li')
                        taskListAllLi.forEach((task) => {
                            task.remove()
                        })

                        newListTasks.taskList.forEach(elem => {
                            const anchor = document.createElement('a')
                            const li = document.createElement('li');
                            anchor.append(li)
                            const taskArea = document.querySelector('.task-list')
                            li.innerHTML = elem.title
                            li.id = elem.id
                            taskArea.append(li);
                            li.addEventListener('click', async (event) => {
                                const updateTaskValuesRes = await fetch(`/tasks/${elem.id}`);
                                const updateTaskValues = await updateTaskValuesRes.json();
                                const taskEditArea = document.querySelector(".task-edit-area")
                                taskEditArea.innerHTML = `
                                        <div class="task-edit-div">
                                            <form id="form-edit">
                                                <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
                                                <input type='text' name="description" placeholder="description" id="task-description-edit" value=${updateTaskValues.task.description}>
                                                <div class="date-time-edit-container">
                                                    <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
                                                    <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
                                                    <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
                                                </div>
                                                <button class="task-edit-update-button">Update</button>
                                                <button class="task-edit-delete-button">Delete</button>
                                            </form>
                                        </div>`
                                const updateBtn = document.querySelector('.task-edit-update-button');
                                updateBtn.addEventListener('click', async (e) => {
                                    e.preventDefault();
                                    const titleValue = document.getElementById("task-name-edit").value;
                                    const descriptionValue = document.getElementById("task-description-edit").value;
                                    const dateValue = document.getElementById("task-date-edit").value;
                                    const timeValue = document.getElementById("task-time-edit").value || null;
                                    const experienceValue = document.getElementById("task-exp-edit").value;

                                    const res = await fetch(`/tasks/${elem.id}`, {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            title: titleValue,
                                            description: descriptionValue,
                                            experienceReward: experienceValue,
                                            dueDate: dateValue,
                                            dueTime: timeValue
                                        })
                                    })
                                    const updatedRes = await res.json();
                                    event.target.innerHTML = updatedRes.updatedTask.title;

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
                    })
                    // ABOVE THIS IS WHEN THE IMPORTED CODE STARTS




                } catch {
                    console.log('yo')
                }

            });

        }

    });




    // LISTENER FUNCTION FOR NEW TASK FORM
    const newTaskForm = document.getElementById('new-task-form');

    newTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-name-input');
        const description = document.getElementById('task-description-input');
        const dueDate = document.getElementById('task-date-input');
        const dueTime = document.getElementById('task-time-input');
        const experienceReward = document.getElementById('task-exp-input');
        console.log(title);
        const taskCreateRes = await fetch(`/lists/${userId}/tasks`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                dueDate: dueDate.value,
                dueTime: dueTime.value,
                experienceReward: experienceReward.value
            })
        });
        const taskCreate = await taskCreateRes.json();

        // TODO ADD VALIDATION FOR BLANK TITLE
        // if (taskCreate.errors) return newListError.innerHTML = taskCreate.errors.title

        const newListElement = document.createElement('li')
        const taskArea = document.querySelector('.task-list')
        newListElement.innerHTML = taskCreate.newTask.title;
        taskArea.append(newListElement);
        console.log('hey')
    })

    // GETS ALL LISTS ASSOCIATED WITH CURRENT USER
    const allUserListsRes = await fetch(`/lists/${userId}/lists`);
    const allUserLists = await allUserListsRes.json();

    // BEGINS LOOPING THROUGH EACH LIST TO ADD EVENT LISTENERS
    allUserLists.userLists.forEach(elem => {

        // SELECTS UL AND CREATES LI TO APPEND CURRENT LISTS TITLE TO UL
        const listLi = document.createElement('li');
        const userListsUl = document.getElementById('user-made-lists');
        listLi.innerHTML = elem.title
        userListsUl.append(listLi);


        // ADDS EVENT LISTENER TO CURRENT LIST
        listLi.addEventListener('click', async (e) => {

            // CHANGES URL
            // window.history.pushState({}, "Title", `/lists/${userId}/lists/${elem.id}`);

            // GETS ALL TASKS ASSOCIATED WITH CURRENT LIST ITERATIONS ID
            const res = await fetch(`/lists/${userId}/lists/${elem.id}/tasks`);
            const listRes = await res.json();
            
            console.log(listRes);

            // CLEARS ALL TASKS FROM TASK LIST
            const taskListAllLi = document.querySelectorAll('.task-list > li')
            taskListAllLi.forEach((task) => {
                task.remove()
            })

            //COUNTER FOR UNFINISHED TASKS
            let unfinishedCounter = 0;

            // ITERATES THROUGH EACH TASK FROM THE CURRENT LIST
            listRes.taskList.forEach(elem => {
                // CHECKS IF TASK IS COMPLETED AND CHANGES UNFINISHED TASK COUNT
                // TODO ---- STOP COMPLETED TASKS FROM DISPLAYING
                if (!elem.completed) unfinishedCounter++;
                const unfinishedTasksNum = document.getElementById('unfinished-tasks-num');
                unfinishedTasksNum.innerHTML = unfinishedCounter;
                console.log(unfinishedCounter);

                const anchor = document.createElement('a')
                const li = document.createElement('li');
                anchor.append(li)
                const taskArea = document.querySelector('.task-list')
                li.innerHTML = elem.title
                li.id = elem.id
                taskArea.append(li);
                li.addEventListener('click', async (event) => {
                    const updateTaskValuesRes = await fetch(`/tasks/${elem.id}`);
                    const updateTaskValues = await updateTaskValuesRes.json();
                    const taskEditArea = document.querySelector(".task-edit-area")
                    taskEditArea.innerHTML = `
                                        <div class="task-edit-div">
                                            <form id="form-edit">
                                                <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
                                                <input type='text' name="description" placeholder="description" id="task-description-edit" value=${updateTaskValues.task.description}>
                                                <div class="date-time-edit-container">
                                                    <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
                                                    <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
                                                    <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
                                                </div>
                                                <button class="task-edit-update-button">Update</button>
                                                <button class="task-edit-delete-button">Delete</button>
                                            </form>
                                        </div>`
                    const updateBtn = document.querySelector('.task-edit-update-button');
                    updateBtn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const titleValue = document.getElementById("task-name-edit").value;
                        const descriptionValue = document.getElementById("task-description-edit").value;
                        const dateValue = document.getElementById("task-date-edit").value;
                        const timeValue = document.getElementById("task-time-edit").value || null;
                        const experienceValue = document.getElementById("task-exp-edit").value;

                        const res = await fetch(`/tasks/${elem.id}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                title: titleValue,
                                description: descriptionValue,
                                experienceReward: experienceValue,
                                dueDate: dateValue,
                                dueTime: timeValue
                            })
                        })
                        const updatedRes = await res.json();
                        event.target.innerHTML = updatedRes.updatedTask.title;

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
        })
    });




});




// newListElem.addEventListener('click', async (e) => {
//     const res = await fetch(`/lists/${userId}/lists/${taskCreate.newList.id}/tasks`);
//     const userInfo = await res.json();
//     userInfo.userTasks.forEach(elem => {
//         const anchor = document.createElement('a')
//         const li = document.createElement('li');
//         anchor.append(li)
//         const taskArea = document.querySelector('.task-list')
//         li.innerHTML = elem.title
//         li.id = elem.id
//         taskArea.append(li);
//         li.addEventListener('click', async (event) => {
//             const updateTaskValuesRes = await fetch(`/tasks/${elem.id}`);
//             const updateTaskValues = await updateTaskValuesRes.json();
//             const taskEditArea = document.querySelector(".task-edit-area")
//             taskEditArea.innerHTML = `
//                     <div class="task-edit-div">
//                         <form id="form-edit">
//                             <input type="text" name="title" placeholder="title" id="task-name-edit" value="${updateTaskValues.task.title}">
//                             <input type='text' name="description" placeholder="description" id="task-description-edit" value=${updateTaskValues.task.description}>
//                             <div class="date-time-edit-container">
//                                 <input type="date" name="dueDate" id="task-date-edit" value=${updateTaskValues.task.dueDate}>
//                                 <input type="time" name="dueTime" id="task-time-edit" value=${updateTaskValues.task.dueTime}>
//                                 <input type="number" name="experienceReward" placeholder="xp" id="task-exp-edit" value=${updateTaskValues.task.experienceReward}>
//                             </div>
//                             <button class="task-edit-update-button">Update</button>
//                             <button class="task-edit-delete-button">Delete</button>
//                         </form>
//                     </div>`

//             const updateBtn = document.querySelector('.task-edit-update-button');
//             updateBtn.addEventListener('click', async (e) => {
//                 e.preventDefault();
//                 const titleValue = document.getElementById("task-name-edit").value;
//                 const descriptionValue = document.getElementById("task-description-edit").value;
//                 const dateValue = document.getElementById("task-date-edit").value;
//                 const timeValue = document.getElementById("task-time-edit").value || null;
//                 const experienceValue = document.getElementById("task-exp-edit").value;

//                 const res = await fetch(`/tasks/${elem.id}`, {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         title: titleValue,
//                         description: descriptionValue,
//                         experienceReward: experienceValue,
//                         dueDate: dateValue,
//                         dueTime: timeValue
//                     })
//                 })
//                 const updatedRes = await res.json();
//                 event.target.innerHTML = updatedRes.updatedTask.title;

//             })

//             const deleteBtn = document.querySelector('.task-edit-delete-button');
//             deleteBtn.addEventListener('click', async (e) => {
//                 e.stopImmediatePropagation();
//                 e.preventDefault();
//                 li.remove();
//                 taskEditArea.innerHTML = '';
//                 const res = await fetch(`/tasks/${elem.id}`, { method: 'DELETE' });
//             })
//         })
//     })
// })