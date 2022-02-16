document.addEventListener('DOMContentLoaded', async (event)=>{
    //const userCookie = localStorage.getItem('sessionCookie.sid')
    const userId = document.URL.split('/lists/')[1];
    console.log(userId);

    const res = await fetch(`/lists/info/${userId}`);
    const userInfo = await res.json();
    console.log(userInfo)

    const listElement = document.querySelector('#user-lists');

})
