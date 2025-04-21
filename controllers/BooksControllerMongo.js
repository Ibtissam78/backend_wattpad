
const { body } = require('express-validator');
const Book = require('../models/bookModelMongo'); 

const postBooks = async (req, res) => {
    try {

         const newBook = await Book.addBook(req.body)

        res.status(200).send({
            message: 'Données ajoutées avec succès',
            data: newBook,
        });
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de l\'ajout des données', details: err.message });
    }
};

const getBooks = async (req, res) => {
    const { limit, offset } = req.query;
    try {
        const data = await Book.getBooks(limit, offset);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la récupération des données', details: err.message });
    }
};

const getBook = async (req, res) => {
    try {
        const data = await Book.findById(req.params.id);
        if (!data) {
            return res.status(404).send({ error: 'Aucun livre trouvé' });
        }
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ error: 'Erreur lors de la récupération des données', details: err.message });
    }
};

module.exports = {
    postBooks,
    getBooks,
    getBook, 
};