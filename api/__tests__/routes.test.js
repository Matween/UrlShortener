const request = require('supertest');
const app = require('../testapp');

describe('Test users and auth routes', () => {

    let token = '';

    beforeAll((done) => {
        request(app.server)
            .post('/auth')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('Should create a new user', async () => {
        const res = await request(app.server).post('/users')
            .send({
                username: 'test',
                password: 'test'
            })

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('username');
    });

    it('Should get an authentication token', async () => {
        const res = await request(app.server).post('/auth')
            .send({
                username: 'test',
                password: 'test'
            })

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    })

    // no jwt token
    it('Should not return a list of users', async () => {
        const res = await request(app.server).get('/users');

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })

    // with jwt token
    it('Should return a list of users', async () => {
        const res = await request(app.server).get('/users')
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' })

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({});
    })

});

describe('Test urls and short routes', () => {

    let token = '';

    beforeAll((done) => {
        request(app.server)
            .post('/auth')
            .send({
                username: 'admin',
                password: 'admin'
            })
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('Should create a new url', async () => {
        const res = await request(app.server).post('/urls')
            .send({
                url: 'https://stackoverflow.com/questions/61659975/start-and-stop-server-with-supertest'
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('short');
        expect(res.body.short.length).toEqual(6);
    })

    // no JWT token
    it('Should not create a new url', async () => {
        const res = await request(app.server).post('/urls')
            .send({
                url: 'https://stackoverflow.com/questions/61659975/start-and-stop-server-with-supertest'
            })
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })

    it('Should create a new url with custom short', async () => {
        const res = await request(app.server).post('/urls')
            .send({
                url: 'https://stackoverflow.com/questions/61659975/start-and-stop-server-with-supertest',
                short: 'superTest'
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('short');
        expect(res.body.short).toBe('superTest');
    })

    // short.length < 4
    it('Should not create a new url with custom short', async () => {
        const res = await request(app.server).post('/urls')
            .send({
                url: 'https://stackoverflow.com/questions/61659975/start-and-stop-server-with-supertest',
                short: 'sup'
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    })

    it('Should update a url with custom short', async () => {
        const res = await request(app.server).patch('/urls')
            .send({
                short: 'superTest',
                newShort: 'Supp'
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('short');
    })

    // newShort.length < 4
    it('Should not update a url with custom short', async () => {
        const res = await request(app.server).patch('/urls')
            .send({
                short: 'Supp',
                newShort: 'ze'
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    })

    // wrong short
    it('Should not update a url with custom short (wrong short)', async () => {
        const res = await request(app.server).patch('/urls')
            .send({
                short: 'ftw2',
                newShort: 'zeal'
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    })

    // no newShort provided
    it('Should not update a url with custom short (no newShort)', async () => {
        const res = await request(app.server).patch('/urls')
            .send({
                short: 'Supp',
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    })

    // no short provided
    it('Should not update a url with custom short (no short)', async () => {
        const res = await request(app.server).patch('/urls')
            .send({
                newShort: 'Spp',
            })
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    })

    // user short urls
    it('Should return user\'s saved urls', async () => {
        const res = await request(app.server).get('/urls/user')
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject({});
        expect(res.body[0]).toHaveProperty('clicked');
        expect(res.body[0]).toHaveProperty('short');
        expect(res.body[0]).toHaveProperty('lastAccess');
        expect(res.body[0]).toHaveProperty('url');
    })

    // user short urls no JWT
    it('Should not return user\'s saved urls', async () => {
        const res = await request(app.server).get('/urls/user');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })

    // right short and JWT
    it('Should return the short url stats', async () => {
        const res = await request(app.server).get('/Supp/stats')
            .set({ 'Authorization': `Bearer ${token}`, Accept: 'application/json' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('clicked');
        expect(res.body).toHaveProperty('short');
        expect(res.body).toHaveProperty('lastAccess');
        expect(res.body).toHaveProperty('url');
    })

    // right short no JWT
    it('Should return the short url stats', async () => {
        const res = await request(app.server).get('/Supp/stats')
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    })

    // wrong short
    it('Should not redirect to the short saved url', async () => {
        const res = await request(app.server).get('/upp')
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    })

    // right short
    it('Should not redirect to the short saved url', async () => {
        const res = await request(app.server).get('/Supp')
        expect(res.statusCode).toEqual(302);
    })
});