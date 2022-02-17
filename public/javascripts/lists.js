document.addEventListener('DOMContentLoaded', async (event)=>{
    const userId = document.URL.split('/lists/')[1];

    // const res = await fetch(`/lists/info/${userId}`);
    // const userInfo = await res.json();

    const listElement = document.querySelector('#user-lists');
    console.log(sessionStorage)

    const allTasks = document.getElementById('all-tasks')


    allTasks.addEventListener('click', async (event) => {
        const res = await fetch(`/lists/info/${userId}`);
        const userInfo = await res.json();
        console.log(userInfo.userTasks);
        userInfo.userTasks.forEach(elem => {
            const li = document.createElement('li');
            const listArea = document.querySelector('.list-area')
            li.innerHTML = elem.title
            li.id = elem.id
            listArea.append(li);
            li.addEventListener('click', (event) => {
                console.log(elem.description);
            })
        })
    })
})
