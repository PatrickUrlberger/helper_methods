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
    let parsed = parseFloat(thisval.toString().replace(",",".").replace(/ /g, '')).toString();
    if(parseFloat(parsed).toString() != parsed){return no}
    if(Number.isNaN(parseFloat(parsed))){return no}
    if(parseFloat(parsed).toString() != parsed){return no}
    if(parseFloat(parsed) - parseInt(parsed) == 0){return yes}
    if(parseFloat(parsed) % 1 !== 0){return yes}
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


function customchecker(object,key,customfunc){
    if(key in object){
        const thisval = object[key]
        if(typeof(thisval) == "undefined"){return err_key}
        else{
            try {
                let result = customfunc(thisval)  

                if(result){return yes}
                else{return no}

            } catch (error) {
                return no
            }

        }
    }
    else{return {existing: false,correct: false, wrongtemplate: false}}
    
}

function regExpChecker(object,key,regexp) {
    if(key in object){
        const thisval = object[key]
        if(typeof(thisval) == "undefined"){return err_key}
        else {
            try {
                let result = regexp.test(thisval);

                if(result){return yes}
                else{return no}

            } catch (error) {
                return no
            }

        }
    }
    else{return {existing: false,correct: false, wrongtemplate: false}}
    
}

function customPipelineChecker(payload,key,checkPipeLine,customfunc){

    let returnedResult = {
        existing: true,
        correct: false,
        wrongtemplate: false,
        wrongkey: false
    };

    if(key in payload){
        for (let check of checkPipeLine) {

            let result;
            if(check instanceof RegExp){
                result = regExpChecker(payload,key,check);
            }
            else if(check instanceof Function){
                result = customchecker(payload,key,check)
            }
            else if(Array.isArray(check)){
                result = customPipelineChecker(payload,key,check,customfunc);
            }
            else if(check == "custom"){
                result = customchecker(payload,key,customfunc)}
            else {
                result = checkkey(payload,key,check)
            } 
            if(!result.correct){
                return result;
            }

            returnedResult = result;
        }
        return returnedResult;
    }
    else {
        return no;
    }
}

function analyse(payload,template,additional){

    try{
        let customfunc = (data) => true
        let requirements = [];
        if(additional instanceof Function){
            customfunc = additional;
        }
        else if(Array.isArray(additional)){
            requirements = additional;
        }
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
            let result
            if(type instanceof RegExp){
                result = regExpChecker(payload,key,type);
            }
            else if(type instanceof Function){
                result = customchecker(payload,key,type)
            }
            else if(Array.isArray(type)){
                result = customPipelineChecker(payload,key,type,customfunc);
            }
            else if(type == "custom"){
                result = customchecker(payload,key,customfunc)}
            else{
    
                result = checkkey(payload,key,type)
            }    
            if(result.wrongtemplate)
            {wrongtemplate.push({
                key:key ,
                val:payload[key],
                template: Array.isArray(type)?type.map(t => t.toString()).join():type.toString()
            });return}
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
  
        let result = {
                correct: correct,
                wrong: wrong,
                unavailable: unavailable,
                wrongtemplate: wrongtemplate,
                invalidParameters: null
            }
        if(Object.keys(result).length != Object.keys(template).length){
            result.invalidParameters = parseInvalidParameters(result,requirements)
        }
        return result;
    }
    catch(error){
        return {error: error}
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
              
            case "email":
                if(typeof (thisval) != "string"){return no}
                else{
                    const mailR = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    const mail = thisval.match(mailR)
                    if(mail){return yes}
                    else{return no}
                }

            case "url":
                if(typeof (thisval) != "string"){return no}
                else{
                    const urlR = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                    const url = thisval.match(urlR)
                    if(url){return yes}
                    else{return no}
                }

            default:
                return err_temp
          }

    }

    else{return {existing: false,correct: false, wrongtemplate: false}}
  
  
}

function parseInvalidParameters(analysed,requirements = []){
    try {        
        let invalidParameters = {}
        Object.keys(analysed.wrong).forEach(key => {
            let mode = getErrorInfo(requirements, key);
            invalidParameters[key] = {info: `invalid value (${mode})` , value: analysed.wrong[key]}
        });
        analysed.unavailable.forEach(key => {
            let mode = getErrorInfo(requirements, key);
            invalidParameters[key] = `missing (${mode})`
        });
        return invalidParameters

    } catch (error) {
        return {}
    }

}

function getErrorInfo(requirements, key) {

    try{
        if(requirements.length > 0){
            if(requirements.includes(key)){
                return "required";
            } 
            else {
                let follows = requirements.find(item => item.endsWith(`=>${key}`))

                if(follows){
                    let isRequired = !follows.startsWith("can:")
                    if(!isRequired){
                        follows = follows.substr(4);
                    }
                    let prefix = isRequired?"required": "optional"
                    let followsKey = follows.split("=")[0];
                    let followsValue = follows.split("=")[1].split("||").join(" or ");
                    return `${prefix} parameter: only provide if ${followsKey} is set to: '${followsValue}'`;
                }

                let or = requirements.find(item => item.includes(`||${key}`) || item.includes(`${key}||`));

                if(or){
                    let alternatives = or.split("||").filter(alt => alt != key);
                    return `required (alternatives: ${alternatives.join()})`
                }
                return "optional";   
            }

        } else {
            return "required";
        }

    } catch(err) {
        return "required";
    }
}




const Checker = class Checker {
    constructor(){

    }

    analyse(payload,template,customfunc){
    return analyse(payload,template,customfunc)
    }


}




module.exports = Checker