// * Book class: represent a book
class Book {
    constructor(name, author, isbn) {
        this.title = name;
        this.author = author;
        this.isbn = isbn;
    }
}

// * UI class: handle UI tasks
class UI {
    static displayBooks() {
        // Get books from localStorage
        const books = Store.getBooks();

        // loop through all the books in array, and Add it to the UI
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById("book-list");

        // create a row to insert inside the list
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>   
            <td>${book.author}</td>   
            <td>${book.isbn}</td>   
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>   
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        el.remove();
        this.showAlert(
            `Book "${el.cells[0].textContent}" from author ${el.cells[1].textContent} is deleted`,
            "danger"
        );
    }

    static showAlert(message, className) {
        // Create a div
        const div = document.createElement("div");
        div.className = `alert alert-${className} font-weight-bold`;
        div.appendChild(document.createTextNode(message));

        // place div before form, in container
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        // clear the alert
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    static clearFields() {
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("isbn").value = "";
    }
}

// * Storage class:  Handles Storages
class Store {
    static getBooks() {
        let books;
        // load books from localStorage
        if (localStorage.getItem("books") === null) {
            books = [];
            return books;
        }
        // localStorage store everything as string, convert it to json with JSON.parse
        books = JSON.parse(localStorage.getItem("books"));
        return books;
    }

    static addBooks(book) {
        // get books from localStorage
        const books = Store.getBooks();
        books.push(book);

        // add books into localStorage
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBooks(isbn) {
        // get books from localStorage
        const books = this.getBooks();

        // delete the book whose isbn matches with given isbn, isbn is unique for all books
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        // update the localStorage
        localStorage.setItem("books", JSON.stringify(books));
    }
}

//* Event: Display books
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// * Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if (title === "" || author === "" || isbn === "") {
        UI.showAlert("please input all the fields", "danger");
        return;
    }
    const book = new Book(title, author, isbn);

    // add book to UI
    UI.addBookToList(book);

    // add book to localStorage
    Store.addBooks(book);

    // clear the form inputs
    UI.clearFields();

    // show Success message
    UI.showAlert(`Book "${title}" from author ${author} is added`, "success");
});

//*  Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
    // if click is not on the "x" delete button
    if (!e.target.classList.contains("delete")) {
        return;
    }

    // delete book from UI
    UI.deleteBook(e.target.parentElement.parentElement);

    // delete book from localStorage
    Store.removeBooks(
        e.target.parentElement.parentElement.cells[2].textContent
    );
});
