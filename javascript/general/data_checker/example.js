const data_checker = require("./data_checker.js")

const mydata = {
    myname: "name", //must be string
    myint: 5.0, //must be a integer
    myfloat: "314 67 8 890 34 ,  789 45 ", //must be a float
    mybool: "false",// must be a boolean
    myarray: ["me","you"], //muss be an array
    myobject: {horse: "animal", beer: "drink"} //must be a object (but no array)
}

const template = {
    myname: "string",
    myint: "integer",
    myfloat: "float", 
    mybool: "boolean",
    myarray: "array",
    myobject: "object"
}

console.log(data_checker.analyse(mydata,template))

