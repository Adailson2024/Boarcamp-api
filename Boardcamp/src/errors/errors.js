export function minNumberErrors(){
    return {type:"invalidNumber", 
    message:"stockTotal e pricePerDay devem ser números maiores que 0"}
}

export function conflictErrors(entity){
    return {type:"conflict", 
    message:`Um ${entity} com esse nome já existe`}
}
