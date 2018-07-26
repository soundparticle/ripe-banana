const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk, simplify } = request;

describe('Films API', () => {
    
    beforeEach(() => {
        dropCollection('films');
        dropCollection('studios');
        dropCollection('actors');
        dropCollection('reviews');
        dropCollection('reviewers');
    });

    let amazing;
    let winonaRyder, donJohnson;
    let universal;
    let dracula, machete;
    let chip, tyrone;

    //*** save reviewer function ***

    function saveReviewer(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save film function ***

    function saveFilm(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save review function ***

    function saveReview(review) {
        return request
            .post('/api/reviews')
            .send(review)
            // .then(() => console.log('***review***', review))
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save actor function

    function saveActor(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save a studio function

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return saveActor({
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        })
            .then(data => winonaRyder = data);
    });

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
            title: 'Dracula',
            studio: universal._id,
            released: 1992,
            cast: [{
                role: 'Mina Harker',
                actor: winonaRyder._id
            }]
        })
            .then(data => dracula = data);
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
        return saveReviewer({
            name: 'Tyrone Payton',
            company: 'Fermented Banana'
        })
            .then(data => tyrone = data);
    });
    
    beforeEach(() => {
        return saveReviewer({
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana'
        })
            .then(data => chip = data);
    });

    beforeEach(() => {
        return saveReview({
            rating: 5,
            reviewer: tyrone._id,
            review: 'This is amazing',
            film: dracula._id
        })
            .then(data =>  amazing = data);
    });

    beforeEach(() => {
        return saveReview({
            rating: 1,
            reviewer: chip._id,
            review: 'This is horrible',
            film: machete._id
        })
            .then(data => {
                horrible = data;
            });
    });

    it('saves a film', () => {
        assert.isOk(dracula._id);
    });

    it('get a film by id', () => {
        const film = { 
            _id: dracula._id,
            title: 'Dracula',
            studio: { _id: universal._id, name: 'Universal' },
            released: 1992,
            cast:
                [{ _id: dracula.cast[0]._id,
                    role: 'Mina Harker',
                    actor: { _id: winonaRyder._id, name: 'Winona Ryder' } }],
            reviews:
                [{ _id: amazing._id,
                    rating: 5,
                    reviewer: { _id: tyrone._id, name: 'Tyrone Payton' },
                    review: 'This is amazing' }] };
        return request
            .get(`/api/films/${dracula._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, film);
            });
    });

    it('gets all films', () => {
        return request
            .get('/api/films')
            .then(checkOk) 
            .then(({ body }) => {
                dracula = {
                    _id: dracula._id,
                    title: dracula.title,
                    released: dracula.released,
                    studio: simplify(universal)
                };
                machete = {
                    _id: machete._id,
                    title: machete.title,
                    released: machete.released,
                    studio: simplify(universal)
                };
                

                assert.deepEqual(body, [dracula, machete]);
            });    
    });

    it('deletes a film', () => {
        return request
            .delete(`/api/films/${dracula._id}`)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });
    });
});