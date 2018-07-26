const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => {
        dropCollection('films');
        dropCollection('studios');
        dropCollection('actors');
        dropCollection('reviews');
        dropCollection('reviewers');
    });

    let horrible;
    let donJohnson;
    let universal;
    let machete;
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
            rating: 1,
            reviewer: chip._id,
            review: 'This is horrible',
            film: machete._id
        })
            .then(data => {
                horrible = data;
            });
    });


    it('saves a reviewer', () => {
        assert.isOk(chip._id);
        assert.isOk(tyrone._id);
    });

    it('gets a reviewer by id', () => {
        const reviewer = {
            _id: chip._id,
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana',
            reviews: [{ 
                _id: horrible._id,
                rating: 1,
                review: 'This is horrible',
                film: { _id: machete._id, title: 'Machete' } 
            }] 
        };

        return request
            .get(`/api/reviewers/${chip._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, reviewer);
            });
    });

    it('gets all reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [tyrone, chip]);
            });
    });

    it('updates a reviewer', () => {
        tyrone.company = 'Very Bad Wizards';
        return request
            .put(`/api/reviewers/${tyrone._id}`)
            .send(tyrone)
            .then(checkOk)
            .then(() => {
                assert.equal(tyrone.company, 'Very Bad Wizards');
            });
    });
});