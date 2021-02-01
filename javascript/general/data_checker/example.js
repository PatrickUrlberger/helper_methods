const Checker = require("./data_checker.js")


const mychecker = new Checker()

const mydata = {
    mystring: "Darth Vader", //must be string
    myint: 42, //must be a integer
    myfloat: "3,14150", //must be a float
    mybool: "false",// must be a boolean
    myarray: ["Jedi","Sith"], //muss be an array
    myobject: {rex: "clone", han_solo: "rebell"}, //must be a object (but no array)
    myemail: "palpatine@empire.com",
    myurl: "https://starwars.com",
    myfunc: "Jedi",
    mycustom : 1337

}

const template = {
    mystring: "string",
    myint: "integer",
    myfloat: "float", 
    mybool: "boolean",
    myarray: "array",
    myobject: "object",
    myemail: "email",
    myurl: "url",
    myfunc: ( value => {
        return ["Jedi","Sith"].includes(value);
    }), 
    mycustom: "custom"
}

function custom(val){
    if ((!Number.isNaN(val)) && val > 187){return true}
    else{return false}
} 




//Sync Custom Function
console.log(mychecker.analyse(mydata,template,custom))



