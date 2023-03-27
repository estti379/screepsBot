export enum CREEP_BODY_TYPE {
    Balanced = "balanced",
  }

export function spawnerGroupLogic():void{
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
        let hasEnoughEnergy:boolean = spawner.room.energyAvailable >=  (BODYPART_COST.work + BODYPART_COST.carry + BODYPART_COST.move);
        if(getNumberOfMyCreepsInRoom(spawner.room) < 1 && hasEnoughEnergy){
            spawnCreep(spawner, spawner.room.energyAvailable, CREEP_BODY_TYPE.Balanced);
        }
        return;
    }
    if(spawner.room.energyAvailable == spawner.room.energyCapacityAvailable){
        spawnCreep(spawner, spawner.room.energyAvailable, CREEP_BODY_TYPE.Balanced);
    }
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

function spawnCreep(spawner:StructureSpawn, maxEnergyCost:number, creeperType:CREEP_BODY_TYPE):void{
    let body:BodyPartConstant[];
    body = createBody(maxEnergyCost, creeperType);

    spawner.spawnCreep(body, creeperType + spawner.name + "_" + Game.time, {
        memory: {creepType: creeperType}
    });

}

function createBody(maxEnergyCost: number,  creeperType:CREEP_BODY_TYPE):BodyPartConstant[] {
    let body: BodyPartConstant[] = [];
    let bodyWork: number = 0;
    let bodyCarry: number = 0;
    let bodyMove: number = 0;

    while (maxEnergyCost > BODYPART_COST.move) {
        if (bodyMove == 0) {
            bodyMove++;
            maxEnergyCost = maxEnergyCost - BODYPART_COST.move;
        }
        if (bodyMove >= bodyWork && maxEnergyCost >= BODYPART_COST.work) {
            bodyWork++;
            maxEnergyCost = maxEnergyCost - BODYPART_COST.work;
        }
        if (bodyWork > bodyCarry && maxEnergyCost >= BODYPART_COST.carry) {
            bodyCarry++;
            maxEnergyCost = maxEnergyCost - BODYPART_COST.carry;
        }
        if (bodyWork > bodyWork && maxEnergyCost >= BODYPART_COST.move) {
            bodyMove++;
            maxEnergyCost = maxEnergyCost - BODYPART_COST.move;
        }
    }

    for (let i = 0; i < bodyMove - 1; i++) {
        body.push("move");
    }
    for (let i = 0; i < bodyCarry - 1; i++) {
        body.push("carry");
    }
    for (let i = 0; i < bodyWork - 1; i++) {
        body.push("work");
    }
    if(bodyCarry >= 1){
        body.push("carry");
    }
    if(bodyWork >= 1){
        body.push("work");
    }
    if(bodyMove >= 1){
        body.push("move");
    }

    return body;
}

