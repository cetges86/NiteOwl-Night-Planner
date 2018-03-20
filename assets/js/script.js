$(document).ready(function () {


    var myLat;
    var myLong;

    $('#icons').hide();
    $('#card').hide();

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

        var zip = $('#zip').val().trim();

        console.log(name);
        console.log(email);
        var nameDisplay = (`<h5> ${name} </h5>`);
        $('#nameDisplay').append(nameDisplay).fadeIn(2000);


        $('#inputs').hide();
        $('#icons').show(1500);
        setTimeout(restaurantsInfo, 1500);
    })



    function restaurantsInfo() {
        var queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + myLat + '&lon=' + myLong + '&apikey=1186480d6decb5529b6df0ca0c638be9'
        $.ajax({
            url: queryURL,
            method: "Get"
        }).then(function (response) {

            $('.fas').on('click', function () {
                var type = $(this).attr('id')
                $('#icons').hide();
                $('#card-display').hide();

                for (var i = 0; i < 10; i++) {
                    displayCards(i);

                    function displayCards(i) {
                        var restInfo = {
                            name: response.restaurants[i].restaurant.name,
                            address: response.restaurants[i].restaurant.location.address,
                            cuisine: response.restaurants[i].restaurant.cuisines,
                            menuLink: response.restaurants[i].restaurant.menu_url,
                            rating: response.restaurants[i].restaurant.user_rating.aggregate_rating,
                            cost: response.restaurants[i].restaurant.average_cost_for_two,
                            photo: response.restaurants[i].restaurant.thumb
                        };

                        var newCard = $('<div>');
                        newCard.addClass('newCard','col','s4');

                        newCard.append(`<div class="card small">
                                  <div class="card-image waves-effect waves-block waves-light">
                                 <img id="image" class="activator" src="${restInfo.photo}">
                             </div>
                             <div class="card-content">
                                 <span class="card-title activator grey-text text-darken-4">${restInfo.name}
                                     <i class="material-icons right">more_vert</i>
                                 </span>
                                 <p>
                                     <a target="_blank" href="${restInfo.menuLink}">View Menu</a>
                                 </p>
                             </div>
                             <div class="card-reveal">
                                 <span class="card-title grey-text text-darken-4">${restInfo.name}
                                     <i class="material-icons right">close</i>
                                 </span>
                            <ul>
                                        <li>Address: ${restInfo.address}</li>
                                    <li>Cuisine: ${restInfo.cuisine}</li>
                                    <li>Average Cost for Two: ${restInfo.cost}</li>
                                     <li>Avg. Rating: ${restInfo.rating}</li>
                                   </ul>
                                   </div>
                                       </div>`);


                        newCard.appendTo('#card-display');

                    }
                }
                $('#card-display').show(2000);
            })
        });
    };


});