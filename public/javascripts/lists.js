


document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];
    console.log('User Id is here!!!!!!!!!!!!!', userId)

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();
    const listElement = document.querySelector('#user-lists');

    const defaultLists = document.querySelector('.default-lists')
    const taskSearchButton = document.getElementById('task-search-button')
    const taskSearchForm = document.querySelector('.search-form')


    // SEARCH FORM CODE
    taskSearchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const taskSearchInput = document.getElementById('task-search-input')
        console.log("taskSearchInput value", taskSearchInput)

        let input = taskSearchInput.value
        console.log("user input: ", input)

        // // input = input.toLowerCase();

        const res = await fetch(`/lists/${userId}/tasks/search/${input}`);
        const userTasks = await res.json()
        // console.log("User Tasks", userTasks)
        console.log("userTasks . userTasks", userTasks.userTasks)
        // const listChildren = document.childNodes(.)
        const taskListAllLi = document.querySelectorAll('.task-list > li')
        console.log("Task List all li's", taskListAllLi)
        taskListAllLi.forEach((task) => {
            task.remove()
        })
        const taskList = document.querySelector('.task-list')

        userTasks.userTasks.forEach((task) => {
            const li = document.createElement('li')
            li.innerHTML = task.title
            taskList.append(li)
        })
    })

    // CODE FOR DEAULT LISTS
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
                li.innerHTML = `<div class="task-display"><span id="title-${elem.id}" class="spanTitle">${elem.title}</span><span id="dueTime-${elem.id}" class="spanDueTime">  ${elem.dueTime}</span></div>`
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

                    const titleInput = document.querySelector('#task-name-edit');
                    const timeInput = document.querySelector('#task-time-edit');
                    const titleSpan = document.querySelector(`#title-${elem.id}`);
                    const timeSpan = document.querySelector(`#dueTime-${elem.id}`);

                    function handleTitleInput(e) {
                        titleSpan.innerHTML = e.target.value;
                    };

                    function handleTimeInput(e) {
                        timeSpan.innerHTML = ` ${e.target.value}`;
                    };

                    titleInput.oninput = handleTitleInput;
                    timeInput.oninput = handleTimeInput;

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
                        event.target.innerHTML = '';
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
                li.innerHTML = `<div class="task-display"><span id="title-${el.id}" class="spanTitle">${el.title}</span><span id="dueTime-${el.id}" class="spanDueTime">  ${el.dueTime}</span></div>`
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

                    const titleInput = document.querySelector('#task-name-edit');
                    const timeInput = document.querySelector('#task-time-edit');
                    const titleSpan = document.querySelector(`#title-${el.id}`);
                    const timeSpan = document.querySelector(`#dueTime-${el.id}`);

                    function handleTitleInput(e) {
                        titleSpan.innerHTML = e.target.value;
                    };

                    function handleTimeInput(e) {
                        timeSpan.innerHTML = ` ${e.target.value}`;
                    };

                    titleInput.oninput = handleTitleInput;
                    timeInput.oninput = handleTimeInput;

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
                        event.target.innerHTML = '';
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
                li.innerHTML = `<div class="task-display"><span id="title-${el.id}" class="spanTitle">${el.title}</span><span id="dueTime-${el.id}" class="spanDueTime">  ${el.dueTime}</span></div>`
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

                    const titleInput = document.querySelector('#task-name-edit');
                    const timeInput = document.querySelector('#task-time-edit');
                    const titleSpan = document.querySelector(`#title-${el.id}`);
                    const timeSpan = document.querySelector(`#dueTime-${el.id}`);

                    function handleTitleInput(e) {
                        titleSpan.innerHTML = e.target.value;
                    };

                    function handleTimeInput(e) {
                        timeSpan.innerHTML = ` ${e.target.value}`;
                    };

                    titleInput.oninput = handleTitleInput;
                    timeInput.oninput = handleTimeInput;

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
                        event.target.innerHTML = '';
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
                li.innerHTML = `<div class="task-display"><span id="title-${el.id}" class="spanTitle">${el.title}</span><span id="dueTime-${el.id}" class="spanDueTime">  ${el.dueTime}</span></div>`
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

                    const titleInput = document.querySelector('#task-name-edit');
                    const timeInput = document.querySelector('#task-time-edit');
                    const titleSpan = document.querySelector(`#title-${el.id}`);
                    const timeSpan = document.querySelector(`#dueTime-${el.id}`);

                    function handleTitleInput(e) {
                        titleSpan.innerHTML = e.target.value;
                    };

                    function handleTimeInput(e) {
                        timeSpan.innerHTML = ` ${e.target.value}`;
                    };

                    titleInput.oninput = handleTitleInput;
                    timeInput.oninput = handleTimeInput;

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
                        event.target.innerHTML = '';
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

    // CODE FOR CREATING NEW LISTS
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


            // REMOVES POP UP WINDOW
            hidePopUp.addEventListener('click', e => {
                event.preventDefault();
                if (e.target.className === 'hide-pop-up' || e.target.className === 'cancel-list-submit') hidePopUp.remove();
            });

            // FORM SUBMIT FOR POP UP WINDOW TO CREATE NEW LIST
            newListForm.addEventListener('submit', async e => {
                e.preventDefault();
                try {
                    // FETCH REQUEST TO CREATE NEW LIST
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

                    const listElementDiv = document.createElement('div');
                    const listUl = document.getElementById('user-made-lists')
                    listElementDiv.className = 'user-li-div'
                    listElementDiv.append(newListElement);
                    listUl.append(listElementDiv);

                    listElementDiv.addEventListener('mouseenter', listMouseOver, false);

                    // TODO BREAK THIS DOWN INTO A FUNCTION
                    // ADDS EVENT LISTENER TO LIST TO DISPLAY TASKS ON CLICK
                    listElementDiv.addEventListener('click', async (e) => {
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
                            li.innerHTML = elem.li.innerHTML = `<div class="task-display"><span id="title-${elem.id}" class="spanTitle">${elem.title}</span><span id="dueTime-${elem.id}" class="spanDueTime">  ${elem.dueTime}</span></div>`
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

                                const titleInput = document.querySelector('#task-name-edit');
                                const timeInput = document.querySelector('#task-time-edit');
                                const titleSpan = document.querySelector(`#title-${el.id}`);
                                const timeSpan = document.querySelector(`#dueTime-${el.id}`);

                                function handleTitleInput(e) {
                                    titleSpan.innerHTML = e.target.value;
                                };

                                function handleTimeInput(e) {
                                    timeSpan.innerHTML = ` ${e.target.value}`;
                                };

                                titleInput.oninput = handleTitleInput;
                                timeInput.oninput = handleTimeInput;

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
        const newListElement = document.createElement('li')
        newListElement.innerHTML = elem.title
        const listElementDiv = document.createElement('div');
        const listUl = document.getElementById('user-made-lists')
        listElementDiv.className = 'user-li-div'
        listElementDiv.append(newListElement);
        listUl.append(listElementDiv)


        listElementDiv.addEventListener('mouseenter', listMouseOver, false);
        // listElementDiv.addEventListener('mouseleave', listMouseLeave, false)

        // ADDS EVENT LISTENER TO CURRENT LIST
        listElementDiv.addEventListener('click', async (e) => {

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
                li.innerHTML = li.innerHTML = `<div class="task-display"><span id="title-${elem.id}" class="spanTitle">${elem.title}</span><span id="dueTime-${elem.id}" class="spanDueTime">  ${elem.dueTime}</span></div>`
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

                    const titleInput = document.querySelector('#task-name-edit');
                    const timeInput = document.querySelector('#task-time-edit');
                    const titleSpan = document.querySelector(`#title-${el.id}`);
                    const timeSpan = document.querySelector(`#dueTime-${el.id}`);

                    function handleTitleInput(e) {
                        titleSpan.innerHTML = e.target.value;
                    };

                    function handleTimeInput(e) {
                        timeSpan.innerHTML = ` ${e.target.value}`;
                    };

                    titleInput.oninput = handleTitleInput;
                    timeInput.oninput = handleTimeInput;

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



    function listMouseOver(firstEvent) {
        // e.stopPropagation();

        const checkForDropDiv = document.querySelector('.dropdown-div');
        if (checkForDropDiv) checkForDropDiv.remove();

        const listLiDiv = firstEvent.target
        const dropDown = document.createElement('div');
        dropDown.classList = 'dropdown-div';
        const dropIcon = document.createElement('img')

        dropIcon.src = '../images/dropdown-arrow.png';


        dropDown.append(dropIcon);
        // listLiDiv.insertAfter()
        listLiDiv.append(dropDown);

        listLiDiv.addEventListener('mouseleave', (e) => {
            dropDown.remove();
        })



        dropDown.addEventListener('click', (e) => {
            e.stopPropagation();
            const checkForDropDown = document.querySelector('.dropdown-content')
            if (checkForDropDown) checkForDropDown.remove();

            const dropDownContent = document.createElement('div');
            dropDownContent.className = 'dropdown-content'
            const editListSpan = document.createElement('span');
            editListSpan.classList = 'list-edit-span';
            const deleteListSpan = document.createElement('span');
            deleteListSpan.classList = 'list-delete-span';

            editListSpan.innerHTML = 'Edit list name';
            deleteListSpan.innerHTML = 'Delete list';

            dropDown.append(dropDownContent);
            dropDownContent.append(editListSpan);
            dropDownContent.append(deleteListSpan);

            dropDownContent.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                if (e.target === editListSpan) {
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

                    createNewListText.innerHTML = 'Change list name:'
                    newListSubmit.innerHTML = 'Submit'
                    cancelListSubmit.innerHTML = 'Cancel'

                    document.body.insertBefore(hidePopUp, pageContainer);
                    hidePopUp.append(newListWindow);


                    // REMOVES POP UP WINDOW
                    hidePopUp.addEventListener('click', e => {
                        event.preventDefault();
                        if (e.target.className === 'hide-pop-up' || e.target.className === 'cancel-list-submit') hidePopUp.remove();
                    });


                    // FORM SUBMIT FOR POP UP WINDOW TO CREATE NEW LIST
                    newListForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        try {
                            // FETCH REQUEST TO CREATE NEW LIST
                            const taskEditRes = await fetch(`/lists/${userId}/lists`, {
                                method: 'PUT',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ title: newListInput.value }),
                            });

                            const taskEdit = await taskEditRes.json();

                            if (taskEdit.errors) {
                                newListError.innerHTML = taskEdit.errors.title
                                return
                            }

                            hidePopUp.remove();
                            dropDown.remove();

                            // const selectedList = listLiDiv.firstChild;

                            listLiDiv.innerHTML = `<li>${taskEdit.updatedList.title}</li>`;

                        } catch (err) {
                            console.error(err)
                        }

                    })

                } else if (e.target === deleteListSpan) {
                    const newListWindow = document.createElement('div');
                    const hidePopUp = document.createElement('div');
                    const pageContainer = document.querySelector('.page-container');
                    const newListSubmit = document.createElement('button');
                    const cancelListSubmit = document.createElement('button');
                    const createNewListText = document.createElement('p');
                    const newListError = document.createElement('span')
                    const newListButtonsDiv = document.createElement('div');


                    newListWindow.append(createNewListText);
                    newListWindow.append(newListError);
                    newListButtonsDiv.append(newListSubmit);
                    newListButtonsDiv.append(cancelListSubmit);
                    newListWindow.append(newListButtonsDiv);

                    hidePopUp.classList.toggle("hide-pop-up");
                    newListWindow.classList.toggle("new-list-window");
                    newListSubmit.className = 'new-list-submit';
                    cancelListSubmit.className = 'cancel-list-submit';
                    // TODO Find out if this needs csrf

                    createNewListText.innerHTML = 'Are you sure you want to delete this list?<br>All tasks associated with it will be deleted.'
                    newListSubmit.innerHTML = 'Submit'
                    cancelListSubmit.innerHTML = 'Cancel'

                    document.body.insertBefore(hidePopUp, pageContainer);
                    hidePopUp.append(newListWindow);


                    // REMOVES POP UP WINDOW
                    hidePopUp.addEventListener('click', e => {
                        event.preventDefault();
                        if (e.target.className === 'hide-pop-up' || e.target.className === 'cancel-list-submit') hidePopUp.remove();
                    });


                    // FORM SUBMIT FOR POP UP WINDOW TO CREATE NEW LIST
                    newListSubmit.addEventListener('click', async (e) => {
                        console.log('howdy folks')
                        e.preventDefault();
                        try {
                            // FETCH REQUEST TO CREATE NEW LIST
                            const taskEditRes = await fetch(`/lists/${userId}/lists`, {
                                method: 'DELETE'
                            });

                            hidePopUp.remove();
                            dropDown.remove();

                            // const selectedList = listLiDiv.firstChild;

                            listLiDiv.remove();

                        } catch (err) {
                            console.error(err)
                        }

                    })
                }

            })

        })


    }

});











