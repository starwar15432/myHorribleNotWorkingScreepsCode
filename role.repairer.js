var roleBuilder = require ('role.builder');

module.exports = {
    run: function(creep, spawn) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var hitsOfRampart = 0;
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {filter: (s) => (((s.structureType == STRUCTURE_RAMPART && s.hits <= 30000)
                || (s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)))});

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleBuilder.run(creep, spawn);
            }
        }
        else {

            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            if (dropenergy) {
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropenergy)
                }
            }
            else {
                var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    && s.store[RESOURCE_ENERGY] < s.storeCapacity});
                if (container != undefined) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }
    }
};