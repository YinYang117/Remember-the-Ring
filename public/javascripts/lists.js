



document.addEventListener('DOMContentLoaded', async (event) => {
    const userId = document.URL.split('/lists/')[1];

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();


    const listElement = document.querySelector('#user-lists');
    console.log(sessionStorage)

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
                    const taskEditArea = document.querySelector(".task-edit-area");
                    taskEditArea.classList.toggle('task-edit-area-transition');
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
    });

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
            const newListButtonsDiv = document.createElement('div');
            const newListForm = document.createElement('form');
            const csrfInput = document.createElement('form');


            newListWindow.append(createNewListText);
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
            csrfInput.setAttribute("type", "hidden");
            csrfInput.setAttribute("name", "_csrf");
            // TODO Find out if this needs csrf

            createNewListText.innerHTML = 'New list name:'
            newListSubmit.innerHTML = 'Submit'
            cancelListSubmit.innerHTML = 'Cancel'

            document.body.insertBefore(hidePopUp, pageContainer);
            hidePopUp.append(newListWindow);



            hidePopUp.addEventListener('click', e => {
                if (e.target.className === 'hide-pop-up') hidePopUp.remove();
            });
        }
    })

})
