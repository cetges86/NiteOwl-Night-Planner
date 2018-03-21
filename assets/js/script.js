$(document).ready(function () {


    var myLat;
    var myLong;

    $('#icons').hide();
    $('#back').hide();
    $('#card-display').hide();

    var config = {
        apiKey: "AIzaSyCtY5eXc4wHHN7EL_cuONXMwB_1F8n939s",
        authDomain: "teamaviato-30f76.firebaseapp.com",
        databaseURL: "https://teamaviato-30f76.firebaseio.com",
        projectId: "teamaviato-30f76",
        storageBucket: "teamaviato-30f76.appspot.com",
        messagingSenderId: "552400961206"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

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
    $('#back').hide();

    $('#submit').click(function (event) {
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
        setTimeout(restaurantsInfo, 1000);
    })



    function restaurantsInfo() {
        var queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + myLat + '&lon=' + myLong + '&apikey=1186480d6decb5529b6df0ca0c638be9'
        $.ajax({
            url: queryURL,
            method: "Get"
        }).then(function (response) {
            console.log(response);
            $('.choice').on('click', function (event) {
                var type = $(this).attr('id')
                $('#icons').hide();
                $('#card-display').hide();
                if (type === "food") {
                    for (var i = 0; i < 20; i++) {
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

                            if (restInfo.photo === "") {
                                restInfo.photo = "assets/images/nuts.jpg"
                            }

                            var newCard = $('<div>');
                            newCard.addClass('newCard', 'col', 's4');

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
                                   <i id="plus" class="right-align material-icons">add_circle</i>
                                   </div>
                                       </div>`);


                            newCard.appendTo('#card-display');

                        }
                    }

                    $('#card-display').show(2000);
                    $('#back').show();
                    goBack();
                } else if (type ==="beer"){
                    //Lei's code goes here
                }
            })
        });
    };

    // created var myCity 


    var myCity = "denver";

    function breweryInfo() {
        var queryURL = 'http://beermapping.com/webservice/loccity/ff0222dd8fe6c591c1c40a9656a717d8/' + myCity + '&s=json'
        $.ajax({
            url: queryURL,
            method:'GET'
        }).then(function(response) {
            console.log(response);
            
            $('#beer').on('click', function (event) {
                var type = $(this).attr('id')
                $('#icons').hide();
                $('#card-display').hide();

                for (var i = 0; i < 10; i++) {
                    displayCards(i);

                    function displayCards(i) {
                        var brewInfo = {
                            name: response.name,
                            street: response.street,
                            review: response.reviewLink,
                            URL: response.url,
                            image: response.imageCount
                        };
                       
                        var newCard = $('<div>');
                        newCard.addClass('newCard','col','s4');

                        newCard.append(`<div class="card small">
                                  <div class="card-image waves-effect waves-block waves-light">
                                 <img id="image" class="activator" src="${brewInfo.image}">
                             </div>
                             <div class="card-content">
                                 <span class="card-title activator grey-text text-darken-4">${brewInfo.name}
                                     <i class="material-icons right">more_vert</i>
                                 </span>
                                 <p>
                                     <a target="_blank" href="${brewInfo.review}">Reviews</a>
                                 </p>
                             </div>
                             <div class="card-reveal">
                                 <span class="card-title grey-text text-darken-4">${brewInfo.name}
                                     <i class="material-icons right">close</i>
                                 </span>
                            <ul>
                                        <li>Address: ${brewInfo.street}</li>
                                    <li>Reviews: ${brewInfo.review}</li>
                                    <li>Website: ${brewInfo.URL}</li>
                                     <li>Photos: ${restInfo.image}</li>
                                   </ul>
                                   </div>
                                       </div>`);


                        newCard.appendTo('#card-display');

                    }
                }
            });  
                $('#card-display').show(2000);
                $('#back').show();
            })
        };
        breweryInfo();
    });    

    function goBack() {
        $(document).on('click', '.back-btn', function (event) {
            $('#card-display').empty();
            $('#icons').show(1500);
            $('#back').hide();

        });
    };




});
