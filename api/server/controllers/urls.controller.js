'use strict';

const { UrlsRepository } = require('../repositories');

class UrlsController {

    constructor() { }

    list(req, res) {
        let user = req.params.userId;
        return UrlsRepository.findAllByUserId(user)
            .then(urls => res.status(200).send(urls))
            .catch((error) => res.status(400).send({ error: "Error processing your request" }));
    }

    create(req, res) {
        let url = req.body;
        let random_string = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
        url.short = url.short ? url.short : random_string;
        url.clicked = 0;

        return UrlsRepository.save(url)
            .then((url) => UrlsRepository.findById(url.dataValues.id))
            .then((url) => res.status(201).send(url))
            .catch((error) => res.status(400).send({ error: `Error creating new URL ${error}` }));
    }

    exists(req, res) {
        const id = req.params.short;
        return UrlsRepository.exists(short)
            .then((count) => {
                if (count > 0) return res.status(204).send();
                else throw err;
            })
            .catch((error) => res.status(404).send({ error: 'User id not found' }));
    }

    find(req, res) {
        const short = req.params.short;
        return UrlsRepository.updateClicked(short)
            .then((url) => res.redirect(url.dataValues.url))
            .catch((error) => res.status(404).send({ error: `Url with id ${short} not found` }));
    }

    stats(req, res) {
        const short = req.params.short;
        return UrlsRepository.findOne(short)
            .then((url) => res.status(200).send(url))
            .catch((error) => res.status(404).send({ error: `Url with id ${short}`}));
    }


}

module.exports = new UrlsController();
