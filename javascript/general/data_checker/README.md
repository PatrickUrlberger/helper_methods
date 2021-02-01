The Datachecker is analysing a cartain javacript object.
The Data gets compared with a individual template and checks 
if all the keys that are included in the template exist in the 
passed object too.
It also checks if the passed data is of the correct datatype
Its also possible to assign a custom function to the template, that 
checks the data, if the type custom is used a cutomfunction must be handed over as 
third parameter

Possible types are:

- string
- integer
- float
- boolean
- array
- object
- custom
- [Function]

if a number or a bool is passed as a string the Checker converts it in the 
datatype it should actually be.

For german users it is interesting that float number with comma are also supported
(for example "5,34" becomes 5.34)

A example of the Datachecker is included in this folder