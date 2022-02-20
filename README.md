Remember the Ring


## Production README
This is a to-do list app. It creates tasks and lists, organized your tasks within your lists, and helps you remember things.
There is a .env.example that helps you setup the development enviroment.
Technologies used include git, psql, sequelize, express, pug, javascript.
Link to live site: https://remember-the-ring-app.herokuapp.com/
Link to wiki: https://github.com/YinYang117/Remember-the-Ring/wiki/
Feature 1: We have a group of Tasks, some of them associated to Lists, others are free-floating. You can search through them all, filter them by due dates, and by list. There's a lot of dynamic interaction.
Feature 2: Amazing CSS including an animation using Cubic Bezier (a method of timing css transitions for a very pleasing visual effect) on new list creation.
Challenge 1: Often, we'd run into Json formatting errors while trying to pass or key into information about tasks and lists. Through careful console reading, console logging in effective areas, and 1 sometimes 2 navigators with hawk eyes, we continually fixed them as they cropped up.
Challenge 2: Creating an effective function to use date objects and quering tasks based on which ones would fit within the date-span you're looking for. Ended up using a combination of all 3 of our code snippets and using them together to get the exact result we wanted.
* Code snippets to highlight the best code