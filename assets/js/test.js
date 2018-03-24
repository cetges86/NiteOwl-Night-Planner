


var myCity = "denver";
    var brewApi = "ff0222dd8fe6c591c1c40a9656a717d8/"
    //brewery needs city name
    // created brewApi local variable 

    function breweryInfo() {
        zipToLocation();
        console.log(enteredCity);
        var queryURL = 'https://beermapping.com/webservice/loccity/' + brewApi + enteredCity + '&s=json'
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

                for (var i = 0; i < 20; i++)
                    // if statement excluding "Beer Stores" from displaying
                    // if(response[i].status(0)=== "Beer Store") {



                var placeId = 19866;
                var queryURL = 'http://beermapping.com/webservice/locimage/' + brewApi + placeId + '&s=json'
                $.ajax({
                    url: queryURL,
                    method: 'GET'
                }).then(function (response) {
                    console.log(response)

                    displayCards(i);


                    function displayCards(i) {
                        var brewInfo = {
                            name: response[i].name,
                            street: response[i].street,
                            city: response[i].city,
                            state: response[i].state,
                            review: response[i].overall,
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
                                        <li>Address: ${brewInfo.street}<br>
                                        ${brewInfo.city}, ${brewInfo.state}</li>
                                    <li>Reviews: ${brewInfo.review}</li>

                                    <li>Website: <a target= "_blank" href="http://www.${brewInfo.URL}">Link</a></li>

                                    <i id="plus" data-name="${brewInfo.name}" data-addr = "${brewInfo.street}"class="right-align material-icons addButton">add_circle</i>
                                   </ul>
                                   </div>
                                       </div>`);


                        newCard.appendTo('#card-display');

                    }

                    $('#card-display').show(2000);
                    $('#back').show();
                    goBack();
                });
            })
        }
        )
    };