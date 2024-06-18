// URL base do backend
const BASE_URL = 'http://localhost:3000/api';

// Função para cadastrar um novo livro
async function registerBook() {
  const bookName = document.querySelector("#bookName").value;
  const bookAuthor = document.querySelector("#bookAuthor").value;
  const bookPublisher = document.querySelector("#bookPublisher").value;
  const numberOfPages = Number(document.querySelector("#numberOfPages").value);
  const bookCover = document.querySelector("#bookCover").value;
  const synopsis = document.querySelector("#synopsis").value;

  const newBook = {
    bookName,
    bookAuthor,
    bookPublisher,
    numberOfPages,
    bookCover,
    synopsis
  };

  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    });

    const result = await response.json();
    if (response.ok) {
      alert(`Livro "${result.data.bookName}" cadastrado com sucesso!`);
      clearFields();
      loadBooks();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Erro ao cadastrar o livro:', error);
  }
}

// Função para carregar todos os livros
async function loadBooks() {
  try {
    const response = await fetch(`${BASE_URL}/books`);
    const result = await response.json();
    if (response.ok) {
      displayBooks(result.data);
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Erro ao carregar os livros:', error);
  }
}

// Função para exibir os livros na tela
function displayBooks(books) {
  const listOfAllBooks = document.querySelector("#listOfAllBooks");
  listOfAllBooks.innerHTML = ''; // Limpa a lista

  if (books.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.id = "emptyBookList";
    emptyMessage.textContent = "Nenhum livro cadastrado";
    listOfAllBooks.appendChild(emptyMessage);
  } else {
    books.forEach(book => {
      const bookCard = document.createElement("div");
      createCard(bookCard, book.bookName, book.bookAuthor, book.bookPublisher, book.numberOfPages, book.bookCover);
      appendElements(listOfAllBooks, bookCard);
    });
  }
}

// Função para buscar um livro pelo nome
async function searchBook() {
  const bookNameSearch = document.querySelector("#bookNameSearch").value;

  try {
    const response = await fetch(`${BASE_URL}/books/search/${bookNameSearch}`);
    const result = await response.json();
    if (response.ok) {
      displayBooks(result.data);
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Erro ao buscar o livro:', error);
  }
}

// Carrega todos os livros ao carregar a página
window.onload = loadBooks;

// Event Listeners
btnRegister.addEventListener("click", registerBook);
btnSearch.addEventListener("click", searchBook);
