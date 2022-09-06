# backend for character generator

## What is it ?
Your attention is presented to the development of backend software for the organization of airsoft teams. This includes CRUD operations for the team and users, an interface for the manager and administrator, the ability to register and receive notifications, and much more, which is described below.

### Migration
The administrator is created before starting the server. So define correct admin details in **.development.env** file
To run a create table migration, use:
```
npx sequelize-cli db:migrate
```
to drop all tables, use:
```
npx sequelize-cli db:migrate:undo:all
```

To populate the table of roles, run
```
npx sequelize-cli db:seed:all
```
to clear the table of roles:
```
npx sequelize-cli db:seed:undo:all
```

*If you failed to make seeders on the first try, then you should eliminate it and recreate the database. Because when inserting into tables, a specific id is used, which violates the uniqueness value on subsequent insert attempts. An error similar to this might appear: ERROR: Duplicate key value violates the "role_pkey" unique constraint. Then recreate the database and run migration and seeders again.*


# Run
You need to change the type of the handleRequest method in the AuthGuard declaration in node_modules to
```
handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): User;
```

### Docker-compose
To run the code via docker-compose, you need to: 
1. change in the file **./config/database.json** in the column "host" from *127.0.0.1* to the name of the postgres container(in my code this name *postgres*). Like this:
```
  "development": {
    "username": "postgres",
    "password": "root",
    "database": "airsoft",
    "host": "postgres",
    "dialect": "postgres"
  }
```
2. also change the host for connecting to the postgresql and mongodb database in the .development.env file to the container names as well. In my case it is:
```
POSTGRES_HOST=postgres
```

after these preparations, you can run the following commands:
```
docker-compose build
docker-compose up
```

*If you want to connect to the pgAdmin server, then while the server is running, you need to go to http://localhost:5050/ , where you enter the email and password that are specified in the docker-compose.yml file on lines 66-67. Next, create a new server, where you specify the host as the container name for postgres (in my case, postgres), username and password, which are indicated on lines 28-29. After that, the database will be available. For more information, you can read the following [article] (https://belowthemalt.com/2021/06/09/run-postgresql-and-pgadmin-in-docker-for-local-development-using-docker-compose/).*