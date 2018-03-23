$(document).ready(function () {


    var myLat;
    var myLong;
    var zip;

    $('#icons').hide();
    $('#back').hide();
    // $('#card-display').hide();

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

        zip = $('#zip').val().trim();

        console.log(name);
        console.log(email);
        var nameDisplay = (`<h5> ${name} </h5>`);
        $('#nameDisplay').append(nameDisplay).fadeIn(2000);


        $('#inputs').hide();
        $('#icons').show(1500);
        setTimeout(restaurantsInfo, 1000);
        breweryInfo();
        movieTimes();
    });



    function restaurantsInfo() {
        var queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + myLat + '&lon=' + myLong + '&apikey=1186480d6decb5529b6df0ca0c638be9'
        $.ajax({
            url: queryURL,
            method: "Get"
        }).then(function (response) {
            console.log(response);
            $('#food').on('click', function (event) {
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
                } else if (type === "beer") {
                    breweryInfo();
                }
            })
        });
    };


    var myCity = "denver";

    function breweryInfo() {
        var queryURL = 'http://beermapping.com/webservice/loccity/ff0222dd8fe6c591c1c40a9656a717d8/' + myCity + '&s=json'
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);

            $('#beer').on('click', function (event) {
                var type = $(this).attr('id')
                $('#icons').hide();
                $('#card-display').hide();

                for (var i = 0; i < 20; i++) {
                    displayCards(i);

                    function displayCards(i) {
                        var brewInfo = {
                            name: response[i].name,
                            street: response[i].street,
                            review: response[i].reviewlink,
                            URL: response[i].url,
                            image: response[i].imageCount
                        };

                        var newCard = $('<div>');
                        newCard.addClass('newCard', 'col', 's4');

                        newCard.append(`<div class="card small">
                                  <div class="card-image waves-effect waves-block waves-light">
                                 <img id="image" class="activator" src="assets/images/nuts.jpg">
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
                                    <li>Website: <a href="${brewInfo.URL}">Link</li>
                                     <li>Photos: ${brewInfo.image}</li>
                                   </ul>
                                   </div>
                                       </div>`);


                        newCard.appendTo('#card-display');

                    }
                }
                $('#card-display').show(2000);
                $('#back').show();
                goBack();
            });
        })
    };



    function goBack() {
        $(document).on('click', '.back-btn', function (event) {
            $('#card-display').empty();
            $('#icons').show(1500);
            $('#back').hide();

        });
    };


    //movies API call
    //API KEY: 3ds9gdyq4eu8mya6kmf6uv5g

    //MUST UPDATE TO TODAY'S DATE, OTHERWISE NO RESPONSE GIVEN

    $('#movies').on('click', function (event) {
        $('#icons').hide();
        movieTimes();
    })

    function movieTimes() {
        var queryURL = `http://data.tmsapi.com/v1.1/movies/showings?startDate=2018-03-22&zip=${zip}&api_key=3ds9gdyq4eu8mya6kmf6uv5g`

        console.log(zip)
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response)
            for (var i = 0; i < 20; i++) {

                var movieInfo = {
                    posterImage:response[i].preferredImage.uri,
                    title:response[i].title,
                    rated:response[i].ratings[0].code,
                    theatres: theatre[],
                    showtimes: function showtimes(){
                        for (var j=0;j <response[i].showtimes.length;j++){
                            
                        }
                    }
                }

                var newCard = $('<div>');
                newCard.addClass('newCard', 'col', 's4');

                newCard.append(`<div class="col s12 m7">
                        <div class="card horizontal">
                          <div class="card-image">
                            <img src="${movieInfo.posterImage}">
                          </div>
                          <div class="card-stacked">
                            <div class="card-content">
                              <p>I am a very simple card. I am good at containing small bits of information.</p>
                            </div>
                            <div class="card-action">
                              <a href="#">This is a link</a>
                            </div>
                          </div>
                        </div>
                      </div>`);


                newCard.appendTo('#card-display');
            }

        });
    };


});
