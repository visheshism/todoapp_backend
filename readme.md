# TodoApp API Documentation

## Introduction
This API serves as the backend for TodoApp. It provides functionality to manage todo items. (Add more information here as needed)

## Installation
To install the necessary dependencies, run the following command:
`npm install`

Start the server:
`npm start`

## API Endpoints
The following are the available endpoints for the API:

### Todos
- **GET /api/v1/todos/all**: Retrieve a list of all todos.
- **GET /api/v1/todos/:categ_name**: Retrieve a list of todos for a specific category.
- **DELETE /api/v1/todos/:categ_name**: Delete all todos for a specific category.
- **GET /api/v1/todo**: Retrieve a specific todo by its identifier: 'meIty'.
- **POST /api/v1/todo**: Create a new todo.
- **PUT /api/v1/todo**: Update an existing todo by its identifier: 'meIty'.
- **DELETE /api/v1/todo**: Delete a todo by its identifier: 'meIty'.

### Categories
- **GET /api/v1/categ**: Retrieve a specific category by name.
- **POST /api/v1/categ**: Create a new category.
- **PUT /api/v1/categ**: Update an existing category by name.
- **DELETE /api/v1/categ**: Delete a category by name.

### User
- **POST /api/v1/users/register**: Create a new user.
- **POST /api/v1/users/login**: Authenticate a user and generate an access token.
- **PUT /api/v1/users/update**: Update the name/password of a user.
- **GET /api/v1/users/logout**: Logout a user and delete the access token.
- **GET /api/v1/users/confirm_email**: Send an email to confirm the user account.
- **GET /api/v1/users/confirm**: Authenticate the token to confirm the user and verify the account.
- **GET /api/v1/users/me**: Retrieve details of a logged-in user.
- **DELETE /api/v1/users/me**: Delete a user account.

### Search Query
- **GET /api/v1/search**: Search todos based on specific criteria.

## Authentication and Authorization
This API uses Cookie-based Authentication.

## Error Handling
Custom middleware is used to catch errors and send appropriate responses to the user.

## Environment Variables
Please refer to [example.env](example.env) for the required environment variables.

## Acknowledgments
This project was developed by [Vishesh Singh](https://github.com/visheshism).

## License
This project is licensed under the [MIT License](LICENSE).

Feel free to contribute to this project by making a pull request.