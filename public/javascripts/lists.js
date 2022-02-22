


document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];

    const submitForm = document.getElementById('completed-task-form');
    submitForm.addEventListener('submit', completeTask)


    const listElement = document.querySelector('#user-lists');

    const defaultLists = document.querySelector('.default-lists')
    const taskSearchButton = document.getElementById('task-search-button')
    const taskSearchForm = document.querySelector('.search-form')


    // SEARCH FORM CODE
    taskSearchForm.addEventListener('submit', async (event) => {

        event.preventDefault();
        const taskSearchInput = document.getElementById('task-search-input')

        let input = taskSearchInput.value

        // // input = input.toLowerCase();

        const res = await fetch(`/lists/${userId}/tasks/search/${input}`);
        const userTasks = await res.json()

        taskSearchInput.value = ''

        const changeListTitle = document.querySelector('.current-task-title');
        changeListTitle.innerHTML = 'Your search results'

        addListItem(userTasks.userTasks)

    })

    // CODE FOR DEAULT LISTS
    defaultLists.addEventListener('click', async (e) => {
        if (e.target.id === 'all-tasks') {

            const res = await fetch(`/lists/${userId}/tasks`);
            const userInfo = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = '';

            const changeListTitle = document.querySelector('.current-task-title');
            changeListTitle.innerHTML = 'All your tasks'

            addListItem(userInfo.userTasks)
        }

        else if (e.target.id === 'today-tasks') {

            const res = await fetch(`/lists/today/${userId}`);
            const { tasksToday } = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = ''

            const changeListTitle = document.querySelector('.current-task-title');
            changeListTitle.innerHTML = 'Your tasks for today'


            addListItem(tasksToday)
        }

        else if (e.target.id === 'tomorrow-tasks') {

            const res = await fetch(`/lists/tomorrow/${userId}`);
            const { tasksTomorrow } = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = ''

            const changeListTitle = document.querySelector('.current-task-title');
            changeListTitle.innerHTML = 'Your tasks for tomorrow'

            addListItem(tasksTomorrow)
        }

        else if (e.target.id === 'this-week-tasks') {

            const res = await fetch(`/lists/this-week-tasks/${userId}`);
            const { tasksWeek } = await res.json();
            const taskArea = document.querySelector('.task-list')
            taskArea.innerHTML = '';

            const changeListTitle = document.querySelector('.current-task-title');
            changeListTitle.innerHTML = 'Your tasks for the rest of this week'

            addListItem(tasksWeek)
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


                    const refreshTaskArea = document.querySelector('.task-list')
                    refreshTaskArea.innerHTML = ''


                    if (taskCreate.errors) return newListError.innerHTML = taskCreate.errors.title

                    const currentListTitle = document.querySelector('.current-task-title');
                    currentListTitle.innerHTML = taskCreate.newList.title;

                    // USED TO SET COOKIE FOR NEW LIST
                    const res = await fetch(`/lists/${userId}/lists/${taskCreate.newList.id}/tasks`);
                    const listRes = await res.json();

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
                        const taskArea = document.querySelector('.task-list')
                        taskArea.innerHTML = '';

                        const taskCompleteButtonCheck = document.getElementById('task-complete-button');
                        if (taskCompleteButtonCheck) taskCompleteButtonCheck.remove();

                        const currentListTitle = document.querySelector('.current-task-title');
                        currentListTitle.innerHTML = e.target.innerHTML;


                        addListItem(newListTasks.taskList)
                    })




                } catch (err) {
                    console.log('There was an error fetching data')
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

        title.value = ''
        description.value = ''
        dueDate.value = ''
        dueTime.value = ''
        experienceReward.value = ''


        // TODO ADD VALIDATION FOR BLANK TITLE
        // if (taskCreate.errors) return newListError.innerHTML = taskCreate.errors.title


        // START #####
        const anchor = document.createElement('a')
        const li = document.createElement('label');
        const taskArea = document.querySelector('.task-list')
        li.innerHTML = taskCreate.newTask.title;
        taskArea.append(li);

        const unfinishedTasksNum = document.getElementById('unfinished-tasks-num');
        let unfinishedCounter = unfinishedTasksNum.innerHTML
        unfinishedCounter++;
        unfinishedTasksNum.innerHTML = unfinishedCounter;

        anchor.append(li)
        li.innerHTML = `<div class="task-display"><input type="checkbox" class="task-check-boxes" name="${taskCreate.newTask.title}" value="${taskCreate.newTask.id}"><span id="title-${taskCreate.newTask.id}" class="spanTitle">${taskCreate.newTask.title}</span><span id="dueTime-${taskCreate.newTask.id}" class="spanDueTime">  ${taskCreate.newTask.dueTime || ''}</span></div>`
        li.id = taskCreate.newTask.id
        taskArea.append(li);

        li.addEventListener('click', async (event) => {
            const updateTaskValuesRes = await fetch(`/tasks/${taskCreate.newTask.id}`);
            const updateTaskValues = await updateTaskValuesRes.json();

            submitTasksButton()

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
            const titleSpan = document.querySelector(`#title-${taskCreate.newTask.id}`);
            const timeSpan = document.querySelector(`#dueTime-${taskCreate.newTask.id}`);

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
                const res = await fetch(`/tasks/${taskCreate.newTask.id}`, {
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
                const res = await fetch(`/tasks/${taskCreate.newTask.id}`, { method: 'DELETE' });
            })
        })

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

        // ADDS EVENT LISTENER TO CURRENT LIST
        listElementDiv.addEventListener('click', async (e) => {

            // GETS ALL TASKS ASSOCIATED WITH CURRENT LIST ITERATIONS ID
            const res = await fetch(`/lists/${userId}/lists/${elem.id}/tasks`);
            const listRes = await res.json();

            const currentListTitle = document.querySelector('.current-task-title');
            currentListTitle.innerHTML = e.target.innerHTML;


            addListItem(listRes.taskList)
        })
    });


    // FUNCTION FOR LIST MOUSEOVER EVENT
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
            const checkForDropDown = document.querySelector('.dropdown-content')
            if (checkForDropDown) checkForDropDown.remove();

            const dropDownContent = document.createElement('div');
            dropDownContent.className = 'dropdown-content'
            const editListSpan = document.createElement('span');
            editListSpan.classList = 'list-edit-span';
            const deleteListSpan = document.createElement('span');
            deleteListSpan.classList = 'list-delete-span';

            editListSpan.innerHTML = 'Edit list';
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


    function submitTasksButton() {
        const taskCompleteButtonCheck = document.getElementById('task-complete-button');

        if (!taskCompleteButtonCheck) {
            const taskCompleteButton = document.createElement('button');
            taskCompleteButton.id = 'task-complete-button';

            taskCompleteButton.setAttribute("form", "completed-task-form");
            taskCompleteButton.innerHTML = 'Complete!'
            const taskHeader = document.querySelector(".task-header-area")
            const listTitle = document.querySelector('.current-task-title')
            taskHeader.insertBefore(taskCompleteButton, listTitle)
        }
    }


    async function completeTask(e) {
        const boxValues = []
        const checkBoxes = document.querySelectorAll('.task-check-boxes');
        checkBoxes.forEach(box => {
            if (box.checked) boxValues.push(box.value)
        })
        e.preventDefault();
        const submitTasksRes = await fetch(`/lists/${userId}/exp-gain`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskIds: boxValues })
        });

        const { user } = await submitTasksRes.json();

        const userLevel = document.getElementById('user-level')
        userLevel.innerHTML = `Current level: ${user.currentLevel}`



        boxValues.forEach(async elem => {
            await fetch(`/tasks/${elem}`, { method: 'delete' })
            const removeMe = document.getElementById(elem)
            removeMe.parentElement.removeChild(removeMe)
        })

        const expBar = document.getElementById('exp');
        expBar.style.width = `${user.currentExp}%`;

        const taskCompleteButtonCheck = document.getElementById('task-complete-button');
        if (taskCompleteButtonCheck) taskCompleteButtonCheck.remove();

        const unfinishedTasks = document.getElementById('unfinished-tasks-num')
        const unfinishedNum = parseInt(unfinishedTasks.innerHTML, 10);
        const newNum = unfinishedNum - boxValues.length
        unfinishedTasks.innerHTML = newNum
    }

    const addListItem = (loopItem) => {

        const taskCompleteButtonCheck = document.getElementById('task-complete-button');
        if (taskCompleteButtonCheck) taskCompleteButtonCheck.remove();

        const taskArea = document.querySelector('.task-list')
        taskArea.innerHTML = '';


        let unfinishedCounter = 0;
        const unfinishedTasksNum = document.getElementById('unfinished-tasks-num');
        unfinishedTasksNum.innerHTML = unfinishedCounter;

        loopItem.forEach(elem => {

            if (!elem.completed) unfinishedCounter++;
            unfinishedTasksNum.innerHTML = unfinishedCounter;


            const anchor = document.createElement('a')
            const li = document.createElement('label');

            anchor.append(li)
            li.innerHTML = `<div class="task-display"><input type="checkbox" class="task-check-boxes" name="${elem.title}" value="${elem.id}"><span id="title-${elem.id}" class="spanTitle">${elem.title}</span><span id="dueTime-${elem.id}" class="spanDueTime">  ${elem.dueTime || ''}</span></div>`
            li.id = elem.id
            taskArea.append(li);
            li.addEventListener('click', async (event) => {

                const taskCompleteButtonCheck = document.getElementById('task-complete-button');

                if (!taskCompleteButtonCheck) {
                    const taskCompleteButton = document.createElement('button');
                    taskCompleteButton.id = 'task-complete-button';

                    taskCompleteButton.setAttribute("form", "completed-task-form");
                    taskCompleteButton.innerHTML = 'Complete!'
                    const taskHeader = document.querySelector(".task-header-area")
                    const listTitle = document.querySelector('.current-task-title')
                    taskHeader.insertBefore(taskCompleteButton, listTitle)
                }



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
});











