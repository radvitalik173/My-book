  Resume Submission Application
This application allows users to submit their resumes to a PostgreSQL database via an HTML interface. The project uses Node.js CRUD operations and PostgreSQL for data storage.

Technologies Used:
  1. Node.js
  2. Express
  3. PostgreSQL
  4. nodemon
  5. body-parser
  6. express-session


Setup Instructions:
  1. Clone the repository:
     git clone <repository-url>
     cd <your-project-directory>
  2. Install the required dependencies:
     npm install nodemon pg express-session body-parser express
  3. Run the application:
       Open two separate console windows.
       In the first console, run:
         - nodemon api.js
       In the second console, run:
         - nodemon server.js
  4. Ensure PostgreSQL is set up:
     Make sure your PostgreSQL server is running and you have the necessary database setup.
  5. Access the application
     Open your browser and navigate to http://localhost:3000 to use the app.
