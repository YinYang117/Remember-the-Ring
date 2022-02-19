


const listMouseLeave = (e) => {
    const dropDown = document.querySelector('dropdown-div')
    dropDown.remove();
}


const listMouseOver = (e) => {

    const listLiDiv = e.target
    const dropDown = document.createElement('div');
    dropDown.classList = 'dropdown-div';
    const dropIcon = document.createElement('img')

    dropIcon.src = '../images/dropdown-arrow.png';


    dropDown.append(dropIcon);

    listLiDiv.append(dropDown);


    dropDown.addEventListener('click', (e) => {
        const dropDownContent = document.createElement('div');
        const editListSpan = document.createElement('span');
        editListSpan.classList = 'list-edit-span';
        const deleteListSpan = document.createElement('span');
        deleteListSpan.classList = 'list-delete-span';

        editListSpan.innerHTML = 'Edit list name';
        deleteListSpan.innerHTML = 'Delete list';

        dropDown.append(dropDownContent);
        dropDownContent.append(editListSpan);
        dropDownContent.append(deleteListSpan);
    
        dropDown.addEventListener('click', (e) => {
        
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
                hidePopUp.addEventListener('click', event => {
                    event.preventDefault();
                    if (e.target.className === 'hide-pop-up' || e.target.className === 'cancel-list-submit') hidePopUp.remove();
                });
            
                // FORM SUBMIT FOR POP UP WINDOW TO CREATE NEW LIST
                newListForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    try {
                        // FETCH REQUEST TO CREATE NEW LIST
                        const taskCreateRes = await fetch(`/lists/${userId}/lists`, {
                            method: 'put',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ title: newListInput.value }),
                        });
                    
                        const taskEdit = await taskCreateRes.json();

                        if (taskEdit.errors) {
                            newListError.innerHTML = taskEdit.errors.title
                            return
                        }

                        hidePopUp.remove();
                        dropDown.remove();

                        const selectedList = listLiDiv.firstChild;

                        selectedList.innerHTML = taskCreate.newList.title;

                    } catch {
                        console.log('Something messed up on editing list')
                    }
                
                })
            }
        
        })
        
    }


}


module.exports = { }