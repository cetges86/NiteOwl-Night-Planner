$(document).ready(function () {

    
    var myLat;
    var myLong;
    
    function displayCards(type) {

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

    $('body').on('click', '#food', function (event) {
        alert("clicked on food!");
    });

});