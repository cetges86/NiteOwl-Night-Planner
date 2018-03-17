$(document).ready(function() {

    $('#icons').hide();


    
$('#submit').click(function(){
    event.preventDefault();
    var name = $('#first_name').val().trim();

    var email = $('#email').val().trim();

    console.log(name);
    console.log(email);


    $('#inputs').remove();
    $('#icons').show(1500);
})


function displayCards(type){

    
}


});