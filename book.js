const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./backend/db/database.sqlite3');

// Cria a tabela de livros se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookName TEXT,
    bookAuthor TEXT,
    bookPublisher TEXT,
    numberOfPages INTEGER,
    bookCover TEXT,
    synopsis TEXT
  )`);
});

// Listagem dos livros
router.get('/books', (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// Adição de um novo livro
router.post('/books', (req, res) => {
  const { bookName, bookAuthor, bookPublisher, numberOfPages, bookCover, synopsis } = req.body;
  const sql = 'INSERT INTO books (bookName, bookAuthor, bookPublisher, numberOfPages, bookCover, synopsis) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [bookName, bookAuthor, bookPublisher, numberOfPages, bookCover, synopsis];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": req.body,
      "id": this.lastID
    });
  });
});

// Atualização de um livro
router.put('/books/:id', (req, res) => {
  const { bookName, bookAuthor, bookPublisher, numberOfPages, bookCover, synopsis } = req.body;
  const sql = 'UPDATE books SET bookName = ?, bookAuthor = ?, bookPublisher = ?, numberOfPages = ?, bookCover = ?, synopsis = ? WHERE id = ?';
  const params = [bookName, bookAuthor, bookPublisher, numberOfPages, bookCover, synopsis, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      message: "success",
      data: req.body,
      changes: this.changes
    });
  });
});

// Remoção de um livro
router.delete('/books/:id', (req, res) => {
  const sql = 'DELETE FROM books WHERE id = ?';
  const params = [req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      message: "deleted",
      changes: this.changes
    });
  });
});

// Busca de livro por nome
router.get('/books/search/:name', (req, res) => {
  const sql = 'SELECT * FROM books WHERE bookName = ?';
  const params = [req.params.name];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

module.exports = router;
