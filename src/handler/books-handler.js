import { nanoid } from 'nanoid';
import response from '../util/response';
import books from '../data/books';

const postBook = (request, h) => {
  const {
    name, readPage, pageCount,
  } = request.payload;

  if (!name) return response(h, 400, 'Gagal menambahkan buku. Mohon isi nama buku');
  if (readPage > pageCount) return response(h, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');

  const insertedAt = new Date().toISOString();
  const bookId = nanoid(16);
  const book = {
    ...request.payload,
    id: bookId,
    finished: readPage === pageCount,
    insertedAt,
    updatedAt: insertedAt,
  };

  books.push(book);

  return response(h, 201, 'Buku berhasil ditambahkan', { bookId });
};

const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let resultBooks;
  if (Object.keys(request.query).length === 0) {
    resultBooks = [...books];
  } else {
    resultBooks = books.filter((book) => (!name
      || book.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
      && (!reading || book.reading === (reading === '1'))
      && (!finished || book.finished === (finished === '1')));
  }
  return response(h, 200, 'Berhasil mendapatkan data buku', {
    books: resultBooks.map((b) => ({
      id: b.id,
      name: b.name,
      publisher: b.publisher,
    })),
  });
};

const getBookById = (request, h) => {
  const { id } = request.params;

  const book = books.find((b) => b.id === id);

  if (book) return response(h, 200, 'Berhasil mendapatkan buku', { book });
  return response(h, 404, 'Buku tidak ditemukan');
};

const putBook = (request, h) => {
  const { id } = request.params;
  const { name, readPage, pageCount } = request.payload;

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) return response(h, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
  if (!name) return response(h, 400, 'Gagal memperbarui buku. Mohon isi nama buku');
  if (readPage > pageCount) return response(h, 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');

  const book = books[bookIndex];
  books[bookIndex] = {
    ...book,
    ...request.payload,
    updatedAt: new Date().toISOString(),
  };

  return response(h, 200, 'Buku berhasil diperbarui');
};

const deleteBook = (request, h) => {
  const { id } = request.params;

  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) return response(h, 404, 'Buku gagal dihapus. Id tidak ditemukan');

  books.splice(bookIndex, 1);
  return response(h, 200, 'Buku berhasil dihapus');
};

export {
  postBook,
  getBooks,
  getBookById,
  putBook,
  deleteBook,
};
