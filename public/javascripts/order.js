$("#qty").one("click", function () {
    $(this).data('oldQty', $(this).val());
    $('#price').data('small', $('#price').val());
    console.log("Saving value " + $('#price').val());
});
/*$("#qty").focus(function(){
 //console.log("Saving value " + $(this).val());
 $(this).data('oldQty', $(this).val());
 $('#price').data('small', $('#price').val());
 console.log("Saving value " + $('#price').val());
 });*/
/*$( "#size" ).one( "click", function() {
 //console.log("Saving value " + $(this).val());
 $('#price').data('small', $('#price').val());
 console.log("Saving value " + $('#price').val());
 });*/

$("#qty").change(function () {
    var price = $(this).val() * ( $('#price').val() / $(this).data('oldQty'));
    console.log(price);
    // alert( "Handler for .change() called. "+ price );
    $('#price').val(price);

});

/*
 $("#size").focus(function(){
 //console.log("Saving value " + $(this).val());
 $('#price').data('small', $('#price').val());
 console.log("Saving value " + $('#price').val());
 });
 */

$("#size").change(function () {
    var price = parseInt($('#qty').val()) * (parseInt($('#price').data('small')) + parseInt($(this).val()));
    // alert( "Handler for .change() called. "+ price );
    $('#price').val(price);

});

