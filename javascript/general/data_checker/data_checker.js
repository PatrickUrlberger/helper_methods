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
        wrongtemplate: wrongtemplate
    }
}


function checkkey(object,key,type){
    if(key in object){
        const no = {existing: true,correct: false,wrongtemplate: false}
        const yes = {existing: true,correct: true,wrongtemplate: false}
        const err_temp = {existing: true,correct: false,wrongtemplate: true}
        const thisval = object[key]

        switch (type) {
            case "string":
                if(typeof thisval == type){return yes}
                else{return no}

            case "integer":
                if(Number.isInteger(parseInt(thisval))){return yes}
                else{return no}
 
            case "float":
                let withdot = thisval.toString().replace(",",".").replace(/ /g, '');
                if(parseFloat(withdot).toString() != withdot){return no}
                if(Number.isNaN(parseFloat(withdot))){return no}
                if(parseFloat(withdot).toString() != withdot){return no}
                if(parseFloat(withdot) - parseInt(withdot) == 0){return yes}
                if(parseFloat(withdot) % 1 !== 0){return yes}
                else{return no}

            case "boolean":
                if(thisval == "true" || thisval == "false"){return yes}
                if(typeof thisval == type){return yes}
                else{return no}

            case "array":
                if(Array.isArray(thisval)){return yes}
                else{return no}
            case "object":
                if(Array.isArray(thisval)){return no}
                if(typeof thisval == type){return yes}
                else{return no}
            default:
                return err_temp
          }

    }

    else{return {existing: false,correct: false, wrongtemplate: false}}
  
  
}




module.exports = {
    analyse: analyse,
    checkkey: checkkey
}