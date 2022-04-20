const Checker = require("./data_checker.js")


const mychecker = new Checker()

const mydata = {
    mystring: "Darth Vader",

}

const template = {
    mystring: [/Darth Vader/],
    mytest: "string"
}



//Sync Custom Function
console.log(JSON.stringify(mychecker.analyse(mydata,template),[]))

