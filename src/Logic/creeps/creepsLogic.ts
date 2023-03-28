export enum CREEP_WORK_TYPE {
    Undefined = "undefined",
    Harvesting = "harvesting",
    Storing = "storing",
    Upgrading = "upgrading",
  }

export enum CREEP_BODY_TYPE {
    Balanced = "balanced",
}

export enum CREEP_ROLE_TYPE {
    Undefined = "undefined",
    Harvester = "harvester",
    Upgrader = "upgrader",
}

export function occupyScreeps():void{
    for (const creepName in Game.creeps) {
        controlCreep(Game.creeps[creepName]);
    }
}

export function creepNumberLimitation():void{
    Object.keys(Game.creeps).length != Memory.totalCreeps.harvesters + Memory.totalCreeps.harvesters;
}

function controlCreep(creep:Creep):void {
    switch (creep.memory.roleType) {
        case CREEP_ROLE_TYPE.Harvester:
            creepHarvestEnergy(creep);
            break;

        case CREEP_ROLE_TYPE.Upgrader:
            creepUpgradeRoomController(creep);
            break;

        case CREEP_ROLE_TYPE.Undefined:
            //TODO: handle creeps with undefined role

            break;

        default:
            creep.memory.roleType = CREEP_ROLE_TYPE.Undefined;
            controlCreep(creep);
            break;
    }
}


function creepHarvestEnergy(creep: Creep):void {
    if (creep.memory.workType == CREEP_WORK_TYPE.Undefined) {
        creep.memory.workType = CREEP_WORK_TYPE.Harvesting;
    }
    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.workType == CREEP_WORK_TYPE.Storing) {
        creep.memory.workType = CREEP_WORK_TYPE.Harvesting;
    } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && creep.memory.workType == CREEP_WORK_TYPE.Harvesting) {
        creep.memory.workType = CREEP_WORK_TYPE.Storing;
    }

    // If the creep is carrying energy and is near an energy drop-off point, transfer energy
    if (creep.memory.workType == CREEP_WORK_TYPE.Storing) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_EXTENSION /*||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0*/

                );
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }

    // If the creep is not carrying energy, find and harvest energy
    else if (creep.memory.workType == CREEP_WORK_TYPE.Harvesting) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

function creepUpgradeRoomController(creep:Creep):void{
    if (creep.memory.workType == CREEP_WORK_TYPE.Undefined) {
        creep.memory.workType = CREEP_WORK_TYPE.Harvesting;
    }
    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.workType == CREEP_WORK_TYPE.Upgrading) {
        creep.memory.workType = CREEP_WORK_TYPE.Harvesting;
    } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && creep.memory.workType == CREEP_WORK_TYPE.Harvesting) {
        creep.memory.workType = CREEP_WORK_TYPE.Upgrading;
    }

    // If the creep is carrying energy and is near an energy drop-off point, transfer energy
    if (creep.memory.workType == CREEP_WORK_TYPE.Upgrading) {
        var target = creep.room.controller;
        if (target != undefined && target.my) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else{
            creep.memory.roleType = CREEP_ROLE_TYPE.Undefined;
        }
    }

    // If the creep is not carrying energy, find and harvest energy
    else if (creep.memory.workType == CREEP_WORK_TYPE.Harvesting) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}
