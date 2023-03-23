
export function spawnerGroupLogic(){
    for (const name in Game.spawns) {
        tryToSpawn(Game.spawns[name]);
    }
}


function tryToSpawn(spawner:StructureSpawn):void{

    if( spawner.spawning != null){
        //Do nothing if spawner is already spawning.
        return;
    }
    if(spawner.room.energyAvailable != spawner.room.energyCapacityAvailable){
        //TODO handle point where there are no creeps alive
        return;
    }
    if(spawner.room.energyAvailable == spawner.room.energyCapacityAvailable){

    }
    // if(getNumberOfMyCreepsInRoom(spawner.room) < 1){

    // }



}


function getNumberOfMyCreepsInRoom(room:Room):Number{
    let counter = 0;
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if( creep.my == true || creep.room.name == room.name){
            counter++;
        }
    }
    return counter;
}
