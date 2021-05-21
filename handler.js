const {nanoid} = require('nanoid');
const books = require('./book');
const getAllBooksHandler = (request, handler) => {
    const {name, reading, finished} = request.query;
    let result = books;
    if (name !== undefined) {
        result = books.filter((book) => book.name.toLowerCase().toString().includes(name.toLowerCase()));
    } else if (reading !== undefined) {
        result = books.filter((book) => book.reading == reading)
    } else if (finished !== undefined) {
        result = books.filter((book) => book.finished == finished);
    }
    const response = handler.response({
        status: 'success',
        data: {
            books: result.map((book)=>({
                id:book.id,
                name:book.name,
                publisher:book.publisher
            }))
        }

    })
    response.code(200);
    return response;
};
const getBookByIdHandler = (request, handler) => {
    const {id} = request.params;
    const fb = books.filter((book) => book.id === id)[0];

    if (fb !== undefined) {

        const o = fb;
        fb.finished = false;
        const response = handler.response({
            status: 'success',
            data: {
                book: o
            }
        });
        response.code(200);
        return response;
    } else {
        const response = handler.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });
        response.code(404);
        return response;
    }
}
const addBookHandler = (request, handler) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        name, year, author, summary, publisher, pageCount,finished: readPage === pageCount,
        readPage, reading, id:id, insertedAt, updatedAt
    };
    if (request.payload.name === undefined) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    if (request.payload.readPage > request.payload.pageCount) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;


    if (!isSuccess) {
        const response = handler.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan'
        });
        response.code(500);
        return response;

    } else {
        const response = handler.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });
        response.code(201);
        return response;
    }

}
const editBookByIdHandler = (request, handler) => {
    const {bookId} = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    console.log(`index = ${index}`);

    if (request.payload.name === undefined) {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    if (request.payload.readPage > request.payload.pageCount) {
        const response = handler.response({
            status: 'fail',
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };
        const response = handler.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    } else {
        const response = handler.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }

}
const deleteBookByIdHandler = (request, handler) => {
    const {bookId} = request.params;
    const index = books.findIndex((book => book.id === bookId));
    if (index !== -1) {
        books.splice(index, 1);
        const response = handler.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    } else {
        const response = handler.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
}
module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookById: getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};