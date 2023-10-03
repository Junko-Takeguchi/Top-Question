# Top-Question

Top-Question is a real-time question and answer application built with React, Express, and Socket.IO. It allows users to participate in interactive Q&A sessions, upvote questions, and receive instant updates as questions are asked and upvoted.

## Features

- **User Authentication**: Users can sign up and log in securely to participate in Q&A sessions. JWT (JSON Web Tokens) are used for authentication, and user passwords are securely hashed and stored.

- **Real-Time Updates**: Top-Question leverages Socket.IO to provide real-time updates. As users ask questions or upvote existing ones, the changes are instantly reflected for all participants.

- **Question Voting**: Users can upvote questions they find interesting, and the questions are sorted based on the number of upvotes, ensuring that the most popular questions rise to the top.

- **Cookie-Based Sessions**: JWT tokens are securely stored as cookies, providing a seamless and secure user experience. Cookies are configured with the appropriate `SameSite` and `Secure` attributes for security.

- **RESTful API**: The server-side of the application is built using Express.js, providing a RESTful API for handling user registration, authentication, and question management.

## Getting Started

To get started with Top-Question, follow these simple steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies for both the client and server.
3. Configure the environment variables for your application, including secret keys and database connections.
4. Run the server and client applications, and access the app from your browser.

## Requirements

- Node.js
- React
- Express.js
- Prisma ORM
- Socket.IO
- Axios
- bcrypt
- Cors
- and more (check package.json for the full list)

## Contributing

Contributions are welcome! If you'd like to contribute to the development of Top-Question or have any suggestions, feel free to open issues or create pull requests. We're excited to build and improve this application together.
