const Authors = require('../models/Authors');

const getAllAuthors = (req, res) => {
  res.status(200).json({ 
    success: true ,
    message: `${req.method} - Request made to Author endpoint`, 
  });
};

const getAuthorById = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ 
    id,
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
};

const createAuthor = async (req, res) => {
  const {author} = req.body;
  const newAuthor = await Authors.create(author);
  console.log("data >>>", newAuthor);
  res.status(200).json({ 
    success: true ,
    message: `${req.method} - Request made to Author endpoint`, 
    data: newAuthor,
  });
};

const updateAuthor = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ 
    id,
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
};

const deleteAuthor = (req, res) => {
  const { id } = req.params;
  res.status(200).json({ 
    id,
    success: true ,
    message: `${req.method} - Request made to author endpoint`, 
  });
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};