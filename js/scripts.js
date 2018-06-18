$(document).ready(function(){
  totalWeight();

  if (location.protocol != 'https:') {
    $('#sign-private, #private-key').hide();
  }

  $("#vote").click(function(){
    getProducers();
    $('#instructions').modal('show');
    $("#votes-heading").removeClass('invisible');
    $("#vote-system").removeClass('invisible');
    $("#standings-heading").addClass('invisible');
    $("#standings-system").addClass('invisible');
  });

  $("#standings").click(function(){
    getProducerVotes();
    $("#votes-heading").addClass('invisible');
    $("#vote-system").addClass('invisible');
    $("#standings-heading").removeClass('invisible');
    $("#standings-system").removeClass('invisible');
  });

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

  getProducerVotes();
});
