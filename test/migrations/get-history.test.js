const { expect } = require('chai');

const migrations = require('../../src/nodes/get-history/migrations').default;
const { migrate } = require('../../src/helpers/migrate');

const VERSION_UNDEFINED = {
    id: 'node.id',
    type: 'api-get-history',
    name: 'label of node',
    server: 'server.id',
    startdate: '',
    enddate: '',
    entityid: '',
    entityidtype: '',
    useRelativeTime: false,
    relativeTime: '',
    flatten: true,
};
const VERSION_0 = {
    ...VERSION_UNDEFINED,
    version: 0,
    output_type: 'array',
    output_location_type: 'msg',
    output_location: 'payload',
};

describe('Migrations - Get History Node', function () {
    describe('Version 0', function () {
        it('should add version 0 to schema when no version is defined', function () {
            const migrate = migrations.find((m) => m.version === 0);
            const migratedSchema = migrate.up(VERSION_UNDEFINED);
            expect(migratedSchema).to.eql(VERSION_0);
        });
    });
    it('should update an undefined version to current version', function () {
        const migratedSchema = migrate(VERSION_UNDEFINED);
        expect(migratedSchema).to.eql(VERSION_0);
    });
});
