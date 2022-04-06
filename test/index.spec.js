'use strict';
var { expect } = require('chai');
var convert = require('../src/');

describe('convertSchemaPointerToDataPointer()', () => {
    it('properly converts valid paths', () => {
        var pairs = [
            [ '/properties/foo', '/foo' ],
            [ '/properties/foo/properties/bar', '/foo/bar' ],
        ];

        for (var it of pairs) {
            expect(convert(it[0])).to.equal(it[1]);
        }
    });

    it('throws errors', () => {
        var pairs = [
            [
                '/',
                'empty token',
            ],
            [
                '/foo',
                'unsupported keyword: foo'
            ],
            [ 
                '/properties/foo/items',
                'cannot convert pointers inside array'
            ],
            [
                '/properties/foo/oneOf/properties/bar',
                'cannot convert pointers inside oneOf'
            ]
        ];

        for (var it of pairs) {
            var error = undefined;
            try {
                convert(it[0]);
            }
            catch (e) {
                error = e;
            }
            expect(String(error)).to.equal('Error: ' + it[1]);
        }
    });
});
