npm i
npm install connect-pg-simple

psql
CREATE USER remember_the_ring_app WITH ENCRYPTED PASSWORD '!1Aa654321' CREATEDB;

npx sequelize init
npx dotenv sequelize db:create
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string,hashedPassword:string,currentLevel:integer

npx sequelize model:generate --name List --attributes title:string,userId:integer,categoryId:integer
npx sequelize model:generate --name Task --attributes title:string,description:string,experienceReward:integer,completed:boolean,listId:integer,userId:integer,dueDate:string,dueTime:string
npx sequelize model:generate --name Category --attributes name:string
npx dotenv sequelize db:migrate

psql -U remember_the_ring_app remember_the_ring < node_modules/connect-pg-simple/table.sql

npm i --save express-async-handler
npm i csurf

npm i express-validator
npm i bcryptjs
npm i connect-session-sequelize@^6.0.0
