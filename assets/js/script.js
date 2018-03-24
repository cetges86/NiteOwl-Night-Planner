$(document).ready(function () {

    // global variables
    var myLat;
    var myLong;
    var myCity = "denver";
    var myDestination = {};


    var myZip;
    var enteredLat;
    var enteredLong;
    var enteredCity;

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

    $('.collapsible').collapsible();


    function findLocation() {
        var options = {
            enableHighAccuracy: true,
            timeout: 100000,
            maximumAge: 60000
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


    // find restaurants based on user location and display cards

    function addToNight() {
        $('#itinerary').on('click', function (event) {
            var newItem = $('<li>');
            newItem.append(`<div class="collapsible-header">
            First
        </div>
        <div class="collapsible-body">
            <span>Lorem ipsum dolor sit amet.</span>
        </div>
    </li>`);
            newItem.appendTo('#eventList');
        });

    };

    findLocation();
    addToNight();

    $('#icons').hide();
    $('#back').hide();
    
    $('#itinerary').hide();


    $('.btn-large').on('click', function (event) {

        $('#title').fadeOut(2000);
        $('#inputs').show(1500);
    });



    $('#submit').click(function (event) {
        event.preventDefault();
        $('#inputs').hide();
        var name = $('#first_name').val().trim();

        var email = $('#email').val().trim();

        myZip = $('#zip').val().trim();

        var newUser = {
            userName: name,
            userEmail: email,
            userZip: zip
        };

        database.ref().push(newUser)

        console.log(name);
        console.log(email);
        var nameDisplay = (`<h5> ${name} </h5>`);
        $('#nameDisplay').append(nameDisplay).fadeIn(2000);


        $('#inputs').hide();
        $('#icons').show(1500);
        $('#itinerary').show(1500);
        setTimeout(restaurantsInfo, 1500);
        breweryInfo();
        nightList();
        zipToLocation();
        movieTimes();
    })


       
        });
    
    });


    // will need to add functionality to pull database info for now can't pass the variables back out to use globally

    function zipToLocation(enteredLat, enteredLong, enteredCity) {

        var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + myZip + ',US'
        $.ajax({
            url: queryURL,
            method: "Get"
        }).then(function (response) {
            console.log(response)
            enteredLat = response.results[0].geometry.location.lat;
            enteredLong = response.results[0].geometry.location.lng;
            enteredCity = response.results[0].address_components[1].long_name;

            // need to pass enteredLat and enteredLong values to be defined by the info entered by user

            console.log(enteredLat)
            // need to pass enteredLat and enteredLong values to be defined by the info entered by user
        });
    };

    function restaurantsInfo() {
        zipToLocation()
        console.log(enteredLat);
        console.log(enteredLong);
        var queryURL = ''
        if (myLat === undefined && myLong === undefined) {
            zipToLocation()
            queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + enteredLat + '&lon=' + enteredLong + '&apikey=1186480d6decb5529b6df0ca0c638be9'
        }
        else {
            queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + myLat + '&lon=' + myLong + '&apikey=1186480d6decb5529b6df0ca0c638be9'
        };
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
                            newCard.addClass('newCard', 'col', 's4', i);

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
                                   <i id="plus" data-name="${restInfo.name}" data-addr = "${restInfo.address}"class="right-align material-icons addButton">add_circle</i>
                                   </div>
                                       </div>`);


                            newCard.appendTo('#card-display');

                        }
                    }

                    $('#card-display').show(2000);
                    $('#back').show();
                    goBack();

                }
            })
        });
    };



    function addToNight() {
        $(document).on('click', '.addButton', function (event) {
            console.log(this);
            var restName = $(this).attr('data-name');
            var restAddr = $(this).attr('data-addr');
            console.log(restName);

            var newItem = $('<li>');
            newItem.append(`<div class="collapsible-header">
            ` + restName + `
        </div>
        <div class="collapsible-body">
            <span>` + restAddr + `</span>
        </div>
        </li>`);
            newItem.appendTo('#eventList');
        });

    };


    var myCity = "denver";
    //brewery needs city name

    function breweryInfo() {
        zipToLocation(enteredCity);
        console.log(enteredCity);
        var queryURL = 'http://beermapping.com/webservice/loccity/ff0222dd8fe6c591c1c40a9656a717d8/' + myCity + '&s=json'
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response);

            $('#beer').on('click', function (event) {
                zipToLocation();
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


findLocation();
addToNight();

$('#icons').hide();
$('#back').hide();
$('#card-display').hide();
$('#itinerary').hide();

//    $('.collapsible').collapsible();

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
    $('#itinerary').show(1500);
    setTimeout(restaurantsInfo, 1000);
    breweryInfo();
})

    //movies API call
    //API KEY: 3ds9gdyq4eu8mya6kmf6uv5g

    //MUST UPDATE TO TODAY'S DATE, OTHERWISE NO RESPONSE GIVEN

    $('#movies').on('click', function (event) {
        $('#icons').hide();
        movieTimes();
    })

    function movieTimes() {

        var queryURL = `http://data.tmsapi.com/v1.1/movies/showings?startDate=2018-03-23&zip=${myZip}&api_key=3ds9gdyq4eu8mya6kmf6uv5g`

        console.log(myZip)
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response)

            for (var i = 0; i < 20; i++) {
                $('#showtimes').empty();
                var times = [];
                var theater = [];
                var link = [];

                // getShowtimes(i);

                // function getShowtimes(i) {
                //     for (var j = 0; j < response[i].showtimes.length; j++) {
                //         times.push(response[i].showtimes[j].dateTime)
                //         theater.push(response[i].showtimes[j].theatre.name)
                //         link.push(response[i].showtimes[j].ticketURI)
                //     }

                // };

                var movieInfo = {
                    posterImage: response[i].preferredImage.uri,
                    title: response[i].title,
                    rated: response[i].ratings[0].code,
                    plot: response[i].shortDescription,
                    site: response[i].officialUrl,
                    tickets: response[i].showtimes[0].ticketURI
                }


                var newCard = $('<div>');
                newCard.addClass('newCard', 'col', 's12');

                //     newCard.append(`<div class="card horizontal">
                //     <div class="card-image">
                //   <img src="http://developer.tmsimg.com/${movieInfo.posterImage}&api_key=+3ds9gdyq4eu8mya6kmf6uv5g+">
                //         </div>
                //     <div class="card-stacked">
                //   <div class="card-content">
                //   <h5>${movieInfo.title}</h5>
                //     <p>${movieInfo.plot}</p>

                //   </div>
                //   <div class="card-action">
                //     <a href="${movieInfo.site}">Official Site</a>
                //   </div>
                //   <ul class="collapsible">
                //         <li>
                //           <div class="collapsible-header"><i class="material-icons">local_movies</i>Showtimes</div>
                //           <div id="${i}" class="collapsible-body"></div>
                //         </li>  
                //          </ul>
                //     </div>
                //         </div>`);

                newCard.append(`<div class="row">
                    <div class="col s12">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">${movieInfo.title}</span>
                                <p>${movieInfo.plot}</p>
                            </div>
                            <div class="card-action">
                                <a target= "_blank" href="${movieInfo.site}">Official Site</a>
                                <a target= "_blank" href="${movieInfo.tickets}">Buy Tickets</a>
                            </div>
                        </div>
                    </div>
                </div>`);

                console.log(times);
                // var count = times.length;
                // displayShowtimes(count);

                // function displayShowtimes(count) {
                //     for (var k = 0; k < count; k++) {
                //         var timeDisplay = $('<p>')
                //         timeDisplay.append(`<a target="_blank" href="${link[k]}">${times[k]} @ ${theater[k]}</a>`)
                //         timeDisplay.appendTo(`#${i}`);
                //     }
                // }


                newCard.appendTo('#card-display');
            }
        })
        $('#card-display').show(2000);
        $('#back').show();
        goBack();
    }

});
