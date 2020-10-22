
function randomNumber(){
    let number = ''
    for(var i = 0 ; i < 4 ; i ++){
        number += Math.floor(Math.random() * 10)
    }
    return number
}

module.exports = randomNumber