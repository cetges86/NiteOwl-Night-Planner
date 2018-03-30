var nightInfo = [
    {
        info: "15110 East Hampden Avenue",
        name: "Dry Dock Brewing Co."
    },
    {
        info: "2376 15th Street, Denver 80202",
        name: "My Brother's Bar"
    },
    {
        info: "PG-13, 2H20M",
        name: "Ready Player One"
    }
]

for (var i = 0; i < nightInfo.length; i++) {
    var message = $('<li>')
    message.append(`<ul>
<h1>Your first event:${nightInfo[i].name}</h1>
<li> ${nightInfo[i].info}</li></ul>
`)



}


var obj = {
    timeStamp: 1522371650283,
    userEmail:
        "c.etges86@gmail.com" <,
    userName:
        "Chris",
    userZip:
        "80015"
}


