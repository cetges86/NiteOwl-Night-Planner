$(document).ready(function() {

    $('#icons').hide();
    $('#card').hide();



    
$('#submit').click(function(){
    event.preventDefault();
    var name = $('#first_name').val().trim();

    var email = $('#email').val().trim();

    var nameDisplay = (`<h5> ${name} </h5>`);

    $('#nameDisplay').append(nameDisplay).fadeIn(2000);

    console.log(email);


    $('#inputs').remove();
    $('#icons').show(1500);
})

$('.fas').on('click',function(){
    var type = $(this).attr('id')
    displayCards(this);

})

function displayCards(type){
    $('#icons').remove();
    $('#card').show(1500);
    
}


});