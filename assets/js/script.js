$(document).ready(function () {

    
    var myLat;
    var myLong;

    $('#icons').hide();
    $('#card').hide();
  
  function displayCards(type){
    $('#icons').remove();
    $('#card').show(1500);
    
}



    function findLocation() {

        var options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;

            myLat = crd.latitude;
            myLong = crd.longitude;

            console.log("my latitude: " + crd.latitude);
            console.log("my longitude: " + crd.longitude);
        };
        function error(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
        };

        navigator.geolocation.getCurrentPosition(success, error, options);

    }

    findLocation();
  
  var nameDisplay = (`<h5> ${name} </h5>`);

    $('#nameDisplay').append(nameDisplay).fadeIn(2000);

    console.log(email);

    $('#icons').hide();

    $('#submit').click(function () {
        event.preventDefault();
        var name = $('#first_name').val().trim();

        var email = $('#email').val().trim();

        console.log(name);
        console.log(email);


        $('#inputs').remove();
        $('#icons').show(1500);
    })

$('.fas').on('click',function(){
    var type = $(this).attr('id')
    displayCards(this);
})

function restaurantsInfo(){
    var queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + myLat + '&lon=' + myLon + '&apikey=1186480d6decb5529b6df0ca0c638be9'
    $.ajax({
        url: queryURL,
        method: "Get"
    }).then(function(response){
        console.log(response)
    });
};
restaurantsInfo();

});