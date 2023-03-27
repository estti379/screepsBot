export function occupyScreeps():void{
    for (const creepName in Game.creeps) {
        controlCreep(Game.creeps[creepName]);
    }
}

function controlCreep(creep:Creep) {
    // TODO
    //if(){}
}
