module.exports ={
    printObject: function(objectToPrint){
        if(!objectToPrint)
        {
            return "null";
        }else{
            return JSON.stringify(objectToPrint)+"\n";
            
        }
    }
} 