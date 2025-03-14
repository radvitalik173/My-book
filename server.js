import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import session from "express-session";

const { Pool } = pkg;

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true
}));

// Database connection pool setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Book",
  password: "Qqzz21212121Qqzz",
  port: 5432,
});

// Function to fetch all books from the database
async function checkBooks() {
  try {
    const result = await pool.query("SELECT * FROM book");
    return result.rows;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}

// Route to render the main page with the list of books
app.get("/", async (req, res) => {
  try {
    const books = req.session.sortedBooks || await checkBooks();
    req.session.sortedBooks = null;
    res.render("index.ejs", { listBooks: books });
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Route to render the new book form
app.get("/book/new", (req, res) => {
  res.render("new.ejs");
});

// Route to handle the creation of a new book
app.post("/book/post", async (req, res) => {
  try {
    const currentDate = new Date();
    const nowDay = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    await pool.query(
      "INSERT INTO book (name_book, long_notes, short_notes, url_image_book, date_edit, book_score) VALUES ($1, $2, $3, $4, $5, $6)",
      [req.body.name_book, req.body.long_notes, req.body.short_notes, req.body.url_image_book, nowDay, req.body.book_score]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error creating book");
  }
});

// Route to handle sorting books by score
app.get("/book/sort1", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM book ORDER BY book_score ASC");
    req.session.sortedBooks = result.rows;
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error sorting books");
  }
});

// Route to render a specific book's details
app.get("/book/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM book WHERE id = $1", [req.params.id]);
    res.render('bookID.ejs', { book: result.rows[0] });
  } catch (error) {
    res.status(500).send("Error fetching book details");
  }
});

// Route to render the edit form for a specific book
app.post("/book/:id/edit", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM book WHERE id = $1", [req.params.id]);
    res.render("edit.ejs", { book: result.rows[0] });
  } catch (error) {
    res.status(500).send("Error fetching book for editing");
  }
});

// Route to handle saving the edited book details
app.post("/book/:id/save", async (req, res) => {
  try {
    const currentDate = new Date();
    const nowDay = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    await pool.query(
      "UPDATE book SET name_book = $1, long_notes = $2, short_notes = $3, url_image_book = $4, book_score = $5, date_edit = $6 WHERE id = $7",
      [req.body.name_book, req.body.long_notes, req.body.short_notes, req.body.url_image_book, req.body.book_score, nowDay, req.params.id]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error saving book details");
  }
});

// Route to handle deleting a book
app.post('/book/:id/delete', async (req, res) => {
  try {
    await pool.query("DELETE FROM book WHERE id = $1", [req.params.id]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting book");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
