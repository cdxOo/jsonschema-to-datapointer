'use strict';

var convertSchemaPointerToDataPointer = (schemaPointer) => {
    if (!schemaPointer.startsWith('/')) {
        throw new Error('given pointer does not start with "/"');
    }

    var schemaTokens = schemaPointer.split('/').slice(1);
    var dataTokens = [];

    var inObject = false;
    var inOneOf = false;
    for (var it of schemaTokens) {
        if (!it) {
            throw new Error('empty token');
        }

        if (inOneOf) {
            throw new Error('cannot convert pointers inside oneOf')
        }

        if (!inObject) {
            switch (it) {
                case 'properties':
                    inObject = true;
                    break;
                case 'items':
                    throw new Error('cannot convert pointers inside array')
                    break;
                case 'oneOf':
                    inOneOf = true;
                    break;
                default:
                    throw new Error('unsupported keyword: ' + it);
                    break;
            }
        }
        else {
            if (inObject) {
                dataTokens.push(it);
                inObject = false;
            }
            if (inOneOf) {
                inOneOf = false;
            }
        }
    }

    return '/' + dataTokens.join('/');
}

module.exports = convertSchemaPointerToDataPointer;
