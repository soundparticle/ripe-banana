const { assert } = require('chai');
const request = require('./request');
const { dropCollection  } = require('./db');

const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => {
        dropCollection('films');
        dropCollection('studios');
        dropCollection('actors');

    });
    
    function saveActor(actor) {
        return request
            .post('/api/actors')
            .send(actor)
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

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let universal;
    let paramount;

    beforeEach(() => {
        return save({
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => {
                universal = data;
            });
    });

    beforeEach(() => {
        return save({
            name: 'Paramount',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => {
                paramount = data;
            });
    });
    // Film
    let dracula;
    let winonaRyder;

    function saveFilm(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

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


    
    it('saves a studio', () => {
        assert.isOk(universal._id);
    });
    
    it('gets a studio by id', () => {
        const studio = { 
            _id: universal._id,
            address: { 
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA' 
            },
            name: 'Universal',
            films: [{
                _id: dracula._id,
                title: 'Dracula' 
            }] };
        return request
            .get(`/api/studios/${universal._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, studio);
            });
    });

    it('get all studios', () => {
        return request
            .get('/api/studios')
            .then(checkOk)
            .then(({ body }) => {
                body.forEach(i => delete i._id);
                assert.deepEqual(body, [{ name: 'Universal' }, { name: 'Paramount' }]);
            });
    });

    it('deletes a studio', () => {
        return request
            .delete(`/api/studios/${paramount._id}`)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });
    });
});