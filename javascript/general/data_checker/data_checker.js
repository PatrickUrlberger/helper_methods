const no = {existing: true,correct: false,wrongtemplate: false,wrongkey: false}
const yes = {existing: true,correct: true,wrongtemplate: false, wrongkey: false}
const err_temp = {existing: true,correct: false,wrongtemplate: true,wrongkey: false}
const err_key = {existing: true,correct: false,wrongtemplate: false,wrongkey: true}



function stringchecker(thisval){
    if(typeof thisval == "string"){return yes}
    else{return no}
}

function integerchecker(thisval){
    if(Number.isInteger(parseInt(thisval))){return yes}
    else{return no}
}

function floatchecker(thisval){
    let withdot = thisval.toString().replace(",",".").replace(/ /g, '');
    if(parseFloat(withdot).toString() != withdot){return no}
    if(Number.isNaN(parseFloat(withdot))){return no}
    if(parseFloat(withdot).toString() != withdot){return no}
    if(parseFloat(withdot) - parseInt(withdot) == 0){return yes}
    if(parseFloat(withdot) % 1 !== 0){return yes}
    else{return no}
}

function booleanchecker(thisval){
    if(thisval == "true" || thisval == "false"){return yes}
    if(typeof thisval == "boolean"){return yes}
    else{return no}
}

function arraychecker(thisval){
    if(Array.isArray(thisval)){return yes}
    else{return no}
}

function objectchecker(thisval){
    if(Array.isArray(thisval)){return no}
    if(typeof thisval == "object"){return yes}
    else{return no}
}

function analyse(payload,template){

    let correct = {}
    let wrong = {}
    let wrongtemplate = []
    let unavailable = []
    if(payload == null || template == null){
        return {error: "Invalid template or payload Object"}
    }
    keys = Object.keys(template)

    keys.forEach(key => {

        let type = template[key]
        let result = checkkey(payload,key,type)
        if(result.wrongtemplate)
        {wrongtemplate.push({key:key ,val:payload[key],template: type});return}
        if(result.wrongkey)
        {unavailable.push(key);return}
        if(result.correct){
            if(type == "float"){correct[key]= parseFloat(payload[key].toString().replace(",",".").replace(/ /g, ''));return}
            if(type == "boolean" && typeof payload[key] == "string"){correct[key] = (payload[key] == "true");return}
            correct[key]= payload[key]}
        else{
            if(result.existing){wrong[key]= payload[key]}
            else{unavailable.push(key)}
        }

    })

    return {
        correct: correct,
        wrong: wrong,
        unavailable: unavailable,
        wrongtemplate: wrongtemplate,

    }
}

function checkkey(object,key,type){
    if(key in object){
        const thisval = object[key]
        if(typeof(thisval) == "undefined"){return err_key}

        switch (type) {
            case "string":
                return stringchecker(thisval)

            case "integer":
                return integerchecker(thisval)
 
            case "float":
                return floatchecker(thisval)

            case "boolean":
                return booleanchecker(thisval)

            case "array":
              return arraychecker(thisval)

            case "object":
              return objectchecker(thisval)       

            default:
                return err_temp
          }

    }

    else{return {existing: false,correct: false, wrongtemplate: false}}
  
  
}





const Checker = class Checker {
    constructor(){

    }

    analyse(payload,template){
    return analyse(payload,template)
    }


}




module.exports = Checker