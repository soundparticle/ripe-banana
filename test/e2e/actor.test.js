const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Actors API', () => {


    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('reviewers'));

    let token;
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
            });
    });

    function save(actor) {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let winonaRyder;
    let donJohnson;
    let universal;
    let dracula;

    beforeEach(() => {
        return save({
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        })
            .then(data => {
                winonaRyder = data;
            });
    });

    beforeEach(() => {
        return save({
            name:'Don Johnson',
            dob: new Date(1949, 11, 15),
            pob: 'MO'
        })
            .then(data => {
                donJohnson = data;
            });
    });

    beforeEach(() => {
        return request  
            .post('/api/studios')
            .send({
                name: 'Universal',
                address: {
                    city: 'Los Angeles',
                    state: 'CA',
                    country: 'USA'
                }
            })
            .then(checkOk)
            .then(({ body }) => {
                universal = body;
            });
    });

    beforeEach(() => {
        return request  
            .post('/api/films')
            .send({
                title: 'Dracula',
                studio: universal._id,
                released: 1992,
                cast: [{
                    role: 'Mina Harker',
                    actor: winonaRyder._id
                }]
            })
            .then(checkOk)
            .then(({ body }) => dracula = body);
    });
    

    it('saves an actor', () => {
        assert.isOk(winonaRyder._id);
    });

    it('gets an actor by id', () => {
        const actor = { name: 'Winona Ryder',
            dob: winonaRyder.dob,
            pob: winonaRyder.pob,
            __v: 0,
            films:
         [{ _id: dracula._id,
             title: 'Dracula',
             released: 1992 }] };
        return request
            .get(`/api/actors/${winonaRyder._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body, actor);
            });
    });

    it('get all actors', () => {
        const actors = [{
            _id: winonaRyder._id,
            name: winonaRyder.name
        },
        {
            _id: donJohnson._id,
            name: donJohnson.name
        }];
        return request  
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, actors);
            });
    });

    it('updates an actor', () => {
        winonaRyder.pob = 'kleptoland';
        return request
            .put(`/api/actors/${winonaRyder._id}`)
            .set('Authorization', token)
            .send(winonaRyder)
            .then(checkOk)
            .then(() => {
                assert.equal(winonaRyder.pob, 'kleptoland');
            });
    });

    it('deletes an actor', () => {
        return request
            .delete(`/api/actors/${donJohnson._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });
    });
});