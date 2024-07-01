const books = require('./books');
const { nanoid } = require('nanoid');

const getAllBooksHandler = (request, h) => {
    let filteredBooks = [...books];

    const {name} = request.query;
    if(name) {
        const lowercaseName = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(lowercaseName));
    }

    const {reading} = request.query;
    if (reading === '0') {
        filteredBooks = filteredBooks.filter((book) => book.reading === false);
    } else if (reading === '1') {
        filteredBooks = filteredBooks.filter((book) => book.reading === true);
    }

    const {finished} = request.query;
    if (finished === '0') {
        filteredBooks = filteredBooks.filter((book) => book.finished === false);
    } else if (finished === '1') {
        filteredBooks = filteredBooks.filter((book) => book.finished === true);
    }

    const response = {
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    };

    return h.response(response).code(200);
};

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if(!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }
    if(readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };
    books.push(newBook);
    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    }).code(201);
};

const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((b) => b.id === bookId)[0];
    if(!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        }).code(404);
    }
    return h.response({
        status: 'success',
        data: {
            book
        }
    }).code(200);
};

const updateBookHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    if(!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }
    if(readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if(bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        }).code(404);
    }
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt
    };
    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const bookIndex = books.findIndex((b) => b.id === bookId);
    if(bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        }).code(404);
    }
    books.splice(bookIndex, 1);
    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    }).code(200);
};

module.exports = {
    getAllBooksHandler,
    addBookHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookByIdHandler
};