const { nanoid } = require('nanoid');
const books = require('./books');

const saveBookHandler = (request, h) => {
  // Mendapatkan data buku dari body request
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Validasi apakah properti name ada dalam request body
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  // Validasi apakah nilai properti readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Menentukan id unik untuk buku baru
  const id = nanoid(16);

  // Menentukan nilai properti finished
  const finished = pageCount === readPage;

  // Menentukan tanggal dimasukkannya buku
  const insertedAt = new Date().toISOString();

  // Menyimpan data buku
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt: insertedAt, // updatedAt sama dengan insertedAt saat buku baru dimasukkan
  };

  books.push(newBook); // Menambahkan buku baru ke dalam array books

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  if (books.length === 0) {
    return h.response({
      status: 'success',
      data: {
        books: [],
      },
    }).code(200);
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

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan ID
  const foundBook = books.find((book) => book.id === bookId);

  // Jika buku tidak ditemukan, kembalikan respons dengan status 404
  if (!foundBook) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  // Jika buku ditemukan, kembalikan respons dengan status 200 dan detail buku
  return h.response({
    status: 'success',
    data: {
      book: foundBook,
    },
  }).code(200);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Validasi apakah properti name ada dalam request body
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  // Validasi apakah nilai properti readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Cari buku berdasarkan ID
  const bookIndex = books.findIndex((book) => book.id === bookId);

  // Jika buku tidak ditemukan, kembalikan respons dengan status 404
  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  // Update data buku
  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  // Kembalikan respons berhasil
  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari indeks buku berdasarkan ID
  const bookIndex = books.findIndex((book) => book.id === bookId);

  // Jika buku tidak ditemukan, kembalikan respons dengan status 404
  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  // Hapus buku dari array menggunakan splice
  books.splice(bookIndex, 1);

  // Kembalikan respons berhasil
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  saveBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
