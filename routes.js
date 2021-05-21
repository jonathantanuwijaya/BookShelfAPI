const {
    addBookHandler,
    getAllBooksHandler,
    getBookById,
    editBookByIdHandler,
    deleteBookByIdHandler
} = require('./handler');
const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookById
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler:deleteBookByIdHandler
    }
];

module.exports = routes;