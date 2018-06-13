$(document).ready(function(){
  $('#instructions').modal('show');
  if (location.protocol != 'https:') {
    $('#sign-private, #private-key').hide();
  }
  
  getProducerVotes();

  $("#custom-server").click(function() {
    if (location.protocol == 'https:') {
      if($(this).is(":checked")) {
        $('#producers-select').addClass('invisible');
        $('#custom-server-input').removeClass('invisible');
        $('#eos-small-https').fadeIn( "fast" );
      } else {
        $('#producers-select').removeClass('invisible');
        $('#custom-server-input').addClass('invisible');
        $('#custom-network').val("");
        $('#eos-small-https').fadeOut( "fast" );
        getProducers();
      }
    } else {
      if($(this).is(":checked")) {
        $('#producers-select').addClass('invisible');
        $('#custom-server-input').removeClass('invisible');
        $('#eos-small-http').fadeIn( "fast" );
      } else {
        $('#producers-select').removeClass('invisible');
        $('#custom-server-input').addClass('invisible');
        $('#custom-network').val("");
        $('#eos-small-http').fadeOut( "fast" );
        getProducers();
      }
    }
  });
});
