import { ErrorMapper } from "utils/ErrorMapper";
import { spawnerGroupLogic} from "Logic/spawnerLogic";
import { CREEP_BODY_TYPE, CREEP_WORK_TYPE, CREEP_ROLE_TYPE,
    occupyScreeps, creepNumberLimitation} from "Logic/creeps/creepsLogic";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */


  // Memory extension samples
  interface Memory {
    totalCreeps: CreepNumbers;
  }


  interface CreepMemory {
    creepType:CREEP_BODY_TYPE;
    workType:CREEP_WORK_TYPE;
    roleType:CREEP_ROLE_TYPE;
  }

/*

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
*/

}

export interface CreepNumbers {
    harvesters: number;
    upgraders: number;
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);


    creepNumberLimitation();
    spawnerGroupLogic();
    occupyScreeps();


    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

});
