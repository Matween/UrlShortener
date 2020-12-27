'use strict';

const { UrlsRepository, UsersRepository } = require('../repositories');
const {JwtService } = require('../services');

class UrlsController {

    constructor() { }

    list(req, res) {
        const user = verify(req);
        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        return UrlsRepository.findAllByUserId(user)
            .then(urls => res.status(200).send(urls))
            .catch((error) => res.status(400).send({ error: "Error processing your request" }));
    }

    create(req, res) {
        const user = verify(req);
        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        const url = req.body;
        if (url.short && url.short.length < 4) return res.status(400).send({ error: 'Short must be at least 4 characters long. Or let the server generate one for you.'});

        let randomString = randomizeUrl();
        url.short = url.short ? url.short : randomString;
        url.userId = user;
        url.clicked = 0;

        return UrlsRepository.save(url)
            .then((url) => UrlsRepository.findById(url.dataValues.id))
            .then((url) => res.status(201).send(url))
            .catch((error) => res.status(400).send({ error: `Error creating new URL ${error}` }));
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
            .then((url) => {   
                    const user = verify(req);
                    if (user == url.userId) return res.status(200).send(url);
                    else return res.status(401).send({error: 'Unauthorized'});
            })
            .catch((error) => res.status(404).send({ error: `Url with id ${short} not found`}));
    }

    update(req, res) {
        const user = verify(req);
        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        const url = req.body;
        const short = url.short;
        const newShort = url.newShort;

        if (!short || !newShort) return res.status(400).send({ error: 'Please provide short and new short link.'});
        if (newShort.length < 4) return res.status(400).send({ error: 'New short must be at least 4 characters long.'});

        return UrlsRepository.update(short, newShort, user)
                .then(() => UrlsRepository.findOne(newShort))
                .then(url => res.status(200).send(url))
                .catch((error) => res.status(404).send({ error: error }));
    }

}

function randomizeUrl() {
    const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']; 
    const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz']; 
    const allNumbers = [...'0123456789'];

    const base = [...allCapsAlpha, ...allLowerAlpha, ...allNumbers];

    return Array.from({length: 6}, () => base[Math.floor(Math.random() * base.length)]).join('');
}

function verify(req) {
    const bearer = req.header('Authorization') || '';
    const token = bearer.split(' ')[1];
    const valid = JwtService.verify(token);

    return valid.user;
}

module.exports = new UrlsController();
