event, windowMsg


const createPopUp = (event, windowMsg) => {
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

    createNewListText.innerHTML = 'New list name:' // CHANGE
    newListSubmit.innerHTML = 'Submit'
    cancelListSubmit.innerHTML = 'Cancel'

    document.body.insertBefore(hidePopUp, pageContainer);
    hidePopUp.append(newListWindow);

    // REMOVES POP UP WINDOW
    hidePopUp.addEventListener('click', e => {
        event.preventDefault();
        if (e.target.className === 'hide-pop-up' || e.target.className === 'cancel-list-submit') hidePopUp.remove();
    });

    return newListForm;
}
// Change list name: