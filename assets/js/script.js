$(document).ready(function () {

    // global variables
    var myLat;
    var myLong;
    var myZip;

    // back up lat and long in case geolocation fails
    var enteredLat;
    var enteredLong;
    var enteredCity;
    var enteredState;
    var userEvents = [];

    // initialize firebase
    var config = {
        apiKey: "AIzaSyCtY5eXc4wHHN7EL_cuONXMwB_1F8n939s",
        authDomain: "teamaviato-30f76.firebaseapp.com",
        databaseURL: "https://teamaviato-30f76.firebaseio.com",
        projectId: "teamaviato-30f76",
        storageBucket: "teamaviato-30f76.appspot.com",
        messagingSenderId: "552400961206"
    };

    // use html geolocation to find user location
    function findLocation() {
        console.log("ran")

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

    function zipToLocation() {

        var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + myZip + ',US'
        $.ajax({
            url: queryURL,
            method: "Get"
        }).then(function (response) {
            console.log(response)
            enteredLat = response.results[0].geometry.location.lat;
            enteredLong = response.results[0].geometry.location.lng;
            enteredCity = response.results[0].address_components[1].long_name;

            //BUG - address.components[3] is sometimes "US", not shortname state
            enteredState = response.results[0].address_components[3].short_name;

            if (enteredState === "US") {
                enteredState = response.results[0].address_components[2].short_name;
            }

            // need to pass enteredLat and enteredLong values to be defined by the info entered by user

            console.log(enteredCity);
            console.log(enteredLat);
            console.log(enteredLong);

            // need to pass enteredLat and enteredLong values to be defined by the info entered by user
        });
    };

    function restaurantsInfo() {
        zipToLocation();
        $('#loading').show();
        var queryURL = ''
        if (myLat === undefined && myLong === undefined) {

            queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + enteredLat + '&lon=' + enteredLong + '&radius=3000&apikey=1186480d6decb5529b6df0ca0c638be9'
        } else {
            queryURL = 'https://developers.zomato.com/api/v2.1/search?lat=' + myLat + '&lon=' + myLong + '&radius=3000&apikey=1186480d6decb5529b6df0ca0c638be9'
        };

        $.ajax({
            url: queryURL,
            method: "Get"
        }).then(function (response) {
            console.log(response);
            $('#loading').hide();
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
                             <span class="card-title activator text-darken-4">${restInfo.name}
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
                                <li>Average Cost for Two: $${restInfo.cost}</li>
                                 <li>Avg. Rating: ${restInfo.rating}</li>
                               </ul>
                               <a class="tooltipped" data-position="right" data-tooltip="Add to Night"><i id="plus" data-name="${restInfo.name}" data-addr = "${restInfo.address}"class="right-align material-icons addButton">add_circle</i></a>
                               </div>
                                   </div>`);


                    newCard.appendTo('#card-display');

                }

            };
            $('.tooltipped').tooltip();
            $('#card-display').show(2000);
            $('#back').show();
            goBack();

        });
    };

    function movieTimes() {
        $('#loading').show();
        var today = moment().format("YYYY-MM-DD");

        var queryURL = `https://data.tmsapi.com/v1.1/movies/showings?startDate=${today}&zip=${myZip}&api_key=3ds9gdyq4eu8mya6kmf6uv5g`

        console.log(myZip)
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(response)
            $('#loading').hide();
            $('#card-display').hide();

            for (var i = 0; i < response.length; i++) {
                displayCards(i);

                function displayCards(i) {

                    var movieInfo = {
                        posterImage: response[i].preferredImage.uri,
                        title: response[i].title,
                        rated: "Not Rated",
                        plot: response[i].shortDescription,
                        site: response[i].officialUrl,
                        tickets: response[i].showtimes[0].ticketURI,
                        imageHeight: response[i].preferredImage.height,
                        runTime: response[i].runTime
                    }

                    if (response[i].ratings != undefined) {
                        movieInfo.rated = response[i].ratings[0].code;
                    };

                    if (response[i].runTime === undefined) {
                        movieInfo.runTime = "000Unknown"
                    };

                    var dispRun = movieInfo.runTime.substring(3, movieInfo.runTime.length)
                    var newCard = $('<div>');
                    newCard.addClass('newCard');
                    newCard.addClass('col');
                    newCard.addClass('s12 m6 l5');

                    newCard.append(`<div class="col s12">
                        <div class="card blue-grey lighten-5">
                            <div class="card-content">
                                <span class="center-align card-title">${movieInfo.title}</span>
                                <div class= "col s6">
                                    <img src="http://developer.tmsimg.com/${movieInfo.posterImage}?api_key=3ds9gdyq4eu8mya6kmf6uv5g">
                                    <p>Runtime: ${dispRun}
                                </div>
                                <div class= "col s6">
                                    <p>${movieInfo.plot}</p> 
                                    <p>Rated: ${movieInfo.rated}</p>                            
                                </div>
                            </div>
                            <div class="card-action col s12">
                                <div class="col s9">
                                <a target= "_blank" href="${movieInfo.site}">Official Site</a><br>
                                <a target= "_blank" href="${movieInfo.tickets}">Buy Tickets</a>
                                </div>
                                <div class= "col s3 right-align">
                                <a class="tooltipped" data-position="left" data-tooltip="Add to Night"><i id="plus" data-name="${movieInfo.title}" data-addr="${movieInfo.rated}, ${dispRun}" class="right-align material-icons addButton">add_circle</i></a>
                                </div>
                            </div>
                        </div>
                    </div>`);

                    var cardHeight = movieInfo.imageHeight - 70;
                    $('.card-content').css("height", cardHeight);
                    $('.newCard').css('margin', 0)
                    newCard.appendTo('#card-display');
                }
            };

            $('.tooltipped').tooltip();
            $('#card-display').show(2000);
            $('#back').show();
            goBack();
        })
    };

    function breweryInfo() {
        zipToLocation();
        console.log(enteredCity);
        console.log(enteredState);
        $('#loading').show();

        var brewApi = "ff0222dd8fe6c591c1c40a9656a717d8/"
        var queryURL = `https://beermapping.com/webservice/loccity/${brewApi}${enteredCity},${enteredState}&s=json`
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            $('#loading').hide();
            $('#card-display').hide();
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                displayCards(i);

                function displayCards(i) {
                    var brewInfo = {
                        name: response[i].name,
                        street: response[i].street,
                        city: response[i].city,
                        state: response[i].state,
                        review: response[i].reviewlink,
                        URL: response[i].url,
                        type: response[i].status
                    };

                    var image = "";
                    if (brewInfo.type === "Brewery") {
                        image = "assets/images/beer.jpg"
                    } else if (brewInfo.type === "Brewpub") {
                        image = "assets/images/brewpub.jpg"
                    } else if (brewInfo.type === "Beer Bar") {
                        image = "assets/images/beerbar.jpg"
                    } else {
                        image = "assets/images/homebrew.jpg"
                    }

                    if (brewInfo.type != "Beer Store") {

                        var newCard = $('<div>');
                        newCard.addClass('newCard', 'col', 's4');

                        newCard.append(`<div class="card small">
                                      <div class="card-image waves-effect waves-block waves-light">
                                     <img id="image" class="activator" src="${image}">
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
                                            <li>Address: ${brewInfo.street}<br>
                                            ${brewInfo.city}, ${brewInfo.state}</li>
                                        <li>Type: ${brewInfo.type}</li>
    
                                        <li>Website: <a target= "_blank" href="http://www.${brewInfo.URL}">Link</a></li>
                                        <br>
    
                                        <a class="tooltipped" data-position="right" data-tooltip="Add to Night"><i id="plus" data-name="${brewInfo.name}" data-addr = "${brewInfo.street}"class="right-align material-icons addButton">add_circle</i></a>
                                       </ul>
                                       </div>
                                           </div>`);


                        newCard.appendTo('#card-display');


                    }

                }
            };
            $('.tooltipped').tooltip();
            $('#card-display').show(2000);
            $('#back').show();
            goBack();
        });
    };

    function addToNight() {
        $(document).on('click', '.addButton', function (event) {
            var restName = $(this).attr('data-name');
            var restAddr = $(this).attr('data-addr');

            userEvents.push({
                name: restName,
                info: restAddr
            });

            console.log(userEvents);

            var newItem = $('<li>');
            newItem.append(`<div class="collapsible-header teal darken-3 white-text">
            <i class="material-icons right-align">more_horiz</i>
            ` + restName + `
            </div>
            <div class="collapsible-body">
            <span>` + restAddr + `</span>
             </div>
            </li>`);
            newItem.appendTo('#eventList').fadeIn(1000);
            $('#finished').removeClass('disabled').addClass('waves-effect');
            $('#finished').addClass('waves-light');
        });

    };
    
    function goBack() {
        $(document).on('click', '.back-btn', function (event) {
            $('#card-display').empty();
            $('#icons').show(1500);
            $('#back').hide();
        });
    };


    // find restaurants based on user location and display cards
    firebase.initializeApp(config);
    var database = firebase.database();


    $('.collapsible').collapsible();
    $('.tooltipped').tooltip();

    $('#icons').hide();
    $('#back').hide();
    $('#inputs').hide();
    $('#itinerary').hide();
    $('#loading').hide();

    $('.btn-large').on('click', function (event) {
        $('#title').fadeOut(2000);
        $('#inputs').show(1500);
        findLocation();
    });

    $('#submit').click(function (event) {
        event.preventDefault();

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
        var nameDisplay = (`<h5> ${name}'s Night </h5>`);
        $('#nameDisplay').append(nameDisplay).fadeIn(2000);


        $('#inputs').hide();
        $('#icons').show(1500);
        $('#itinerary').show(1500);
        $('#loading').hide();
        zipToLocation();

    });

    $('#food').on('click', function (event) {
        $('#icons').hide();
        restaurantsInfo();
    });

    $('#beer').on('click', function (event) {
        $('#icons').hide();
        breweryInfo();
    });

    $('#movies').on('click', function (event) {
        $('#icons').hide();
        movieTimes();
    });

    addToNight();


});
