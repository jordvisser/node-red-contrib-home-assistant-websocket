const { expect } = require('chai');

const migrations = require('../../src/nodes/poll-state/migrations').default;
const { migrate } = require('../../src/helpers/migrate');

const VERSION_UNDEFINED = {
    id: 'node.id',
    type: 'poll-state',
    name: 'label of node',
    server: 'server.id',
    updateinterval: '60',
    updateIntervalUnits: 'seconds',
    outputinitially: false,
    outputonchanged: false,
    entity_id: '',
    state_type: 'str',
    halt_if: '',
    halt_if_type: 'str',
    halt_if_compare: 'is',
    outputs: 1,
};
const VERSION_0 = {
    ...VERSION_UNDEFINED,
    version: 0,
};
const VERSION_1 = {
    ...VERSION_0,
    version: 1,
    state_type: 'str',
    halt_if_type: 'str',
    halt_if_compare: 'is',
    updateIntervalUnits: 'seconds',
};
const VERSION_2 = {
    ...VERSION_1,
    version: 2,
    updateIntervalType: 'num',
};

describe('Migrations - Poll State Node', function () {
    describe('Version 0', function () {
        it('should add version 0 to schema when no version is defined', function () {
            const migrate = migrations.find((m) => m.version === 0);
            const migratedSchema = migrate.up(VERSION_UNDEFINED);
            expect(migratedSchema).to.eql(VERSION_0);
        });
    });
    describe('Version 1', function () {
        it('should update version 0 to version 1 setting new defaults', function () {
            const migrate = migrations.find((m) => m.version === 1);
            const migratedSchema = migrate.up(VERSION_0);
            expect(migratedSchema).to.eql(VERSION_1);
        });
    });
    describe('Version 2', function () {
        it('should update version 1 to version 2 setting new defaults', function () {
            const migrate = migrations.find((m) => m.version === 2);
            const migratedSchema = migrate.up(VERSION_1);
            expect(migratedSchema).to.eql(VERSION_2);
        });
    });
    it('should update an undefined version to current version', function () {
        const migratedSchema = migrate(VERSION_UNDEFINED);
        expect(migratedSchema).to.eql(VERSION_2);
    });
});
