$(document).ready(function(){
  if (location.protocol != 'https:') {
    $('#sign-private, #private-key').hide();
  } else {
    $('#sign-scatter').hide();
  }
});
