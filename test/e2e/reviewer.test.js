const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('films'));

    let machete;
    let horrible;
    let token;
    let tyrone;
    let donJohnson;
    let universal;

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Tyrone Payton',
                company: 'Fermented Banana',
                email: 'tyrone@banana.com',
                password: 'abc123',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                tyrone = body.reviewer;
            });
    });

    function saveFilm(film) {
        return request
            .post('/api/films')
            .set('Authorization', token)
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveReview(review) {
        return request
            .post('/api/reviews')
            .set('Authorization', token)
            .send(review)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveActor(actor) {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return saveActor({
            name:'Don Johnson',
            dob: new Date(1949, 11, 15),
            pob: 'MO'
        })
            .then(data => donJohnson = data);
    });

    beforeEach(() => {
        return saveStudio({
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => universal = data);
    });

    beforeEach(() => {
        return saveFilm({ 
            title: 'Machete',
            studio: universal._id,
            released: 2010,
            cast: [{
                role: 'Von Jackson',
                actor: donJohnson._id
            }]
        })
            .then(data =>
                machete = data);
    });

    beforeEach(() => {
        return saveReview({
            rating: 1,
            reviewer: tyrone._id,
            review: 'This is horrible',
            film: machete._id
        })
            .then(data => {
                horrible = data;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('saves a reviewer', () => {
        assert.isOk(tyrone._id);
    });

    it('gets a reviewer by id', () => {
        const reviewer = {
            _id: tyrone._id,
            name: 'Tyrone Payton',
            company: 'Fermented Banana',
            email: 'tyrone@banana.com',
            password: 'abc123',
            roles: ['admin'],

            reviews: [{ 
                _id: horrible._id,
                rating: 1,
                review: 'This is horrible',
                film: { _id: machete._id, title: 'Machete' } 
            }]
        };
        
        return request
            .get(`/api/reviewers/${tyrone._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body._id, reviewer._id);
            });
    });

    it('gets all reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [tyrone]);
            });
    });

    it('updates a reviewer', () => {
        tyrone.company = 'Very Bad Wizards';
        return request
            .put(`/api/reviewers/${tyrone._id}`)
            .set('Authorization', token)
            .send(tyrone)
            .then(checkOk)
            .then(() => {
                assert.equal(tyrone.company, 'Very Bad Wizards');
            });
    });
});