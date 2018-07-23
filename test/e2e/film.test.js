const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');

const { checkOk } = request;

describe('Films API', () => {
    
    beforeEach(() => {
        dropCollection('films');
        dropCollection('studios');
        dropCollection('actors');
    });

    function saveFilm(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveActor(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }
    // Save a studio and then an actor

    let universal;


    beforeEach(() => {
        return saveStudio({
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

    let winonaRyder;


    beforeEach(() => {
        return saveActor({
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        })
            .then(data => {
                winonaRyder = data;
            });
    });
    

    let dracula;
    // let machete;

    
    beforeEach(() => {
        console.log('*** winonaRyder._id ***', winonaRyder);
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

    // beforeEach(() => {
    //     return saveFilm({ 
    //         title: 'Machete',
    //         studio: Types.ObjectId,
    //         released: 2010,
    //         cast: [{
    //             role: 'Von Jackson',
    //             actor: Types.ObjectId
    //         }]
    //     })
    //         .then(data => machete = data);
    // });

    it('saves a film', () => {
        assert.isOk(dracula._id);
    });
});