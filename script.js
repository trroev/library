class Book {
    constructor(title, author, status) {
      this.title = title
      this.author = author
      this.status = status
    }
  }

// UI Class: handle UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks()

        books.forEach((book) => UI.addBookToLibrary(book));
    }

    static addBookToLibrary(book) {
        const list = document.querySelector('#book-list')

        const row = document.createElement('tr')

        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.status}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(div, form)
        // Vanish after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#status').value = ''
    }
}
// Store Class: handles storage
class Store {
    static getBooks() {
        let books
        if(localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static addBook(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(title) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if(book.title === title) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault()

    // Get form values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const status = document.querySelector('#status').value

    // Validate
    if(title === '' || author === '' || status === '') {
        UI.showAlert('Please complete all fields', 'danger')
    } else {
            // Instantiate book
    const book = new Book(title, author, status)

    // Add book to UI
    UI.addBookToLibrary(book)

    // Add book to store
    Store.addBook(book)

    // Show success message
    UI.showAlert('Book Added', 'success')

    // Clear fields
    UI.clearFields()
    }
})

// Event: remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target)

    // Remove book from library
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent)

    UI.showAlert('Book Removed', 'success')
})