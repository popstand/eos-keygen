$(document).ready(function(){
  $('.btn-generate-keys').on('click', function(e){
    e.preventDefault();

    var keyPair = genKeyPair();

    $('.generated-keys').html(
      "<br/><span>Public key:</span>  <input type='text' value='" + keyPair.pubkey + "'><br/>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>Private key:</span>  <input type='password' id='private-key' value='" + keyPair.privkey + "'> <div class='show-private-key'>[show]</div>"
    )
  });

  $(document).on('click', '.show-private-key', function(){
    $privateKey = $('#private-key');
    $toggle = $('.show-private-key');
    if($privateKey.attr('type') == 'text'){
      $privateKey.attr('type', 'password');
      $toggle.html('[show]');
    } else {
      $privateKey.attr('type', 'text');
      $toggle.html('[hide]');
    }

  });
});


function genKeyPair() {
    var {PrivateKey, PublicKey} = eos_ecc
    var d = PrivateKey.randomKey()
    var privkey = d.toWif()
    var pubkey = d.toPublic().toString()

    var pubkeyError = null
    try {
      PublicKey.fromStringOrThrow(pubkey)
    } catch(error) {
      console.log('pubkeyError', error, pubkey)
      pubkeyError = error.message + ' => ' + pubkey
    }

    var privkeyError = null
    try {
      var pub2 = PrivateKey.fromWif(privkey).toPublic().toString()
      if(pubkey !== pub2) {
        throw {message: 'public key miss-match: ' + pubkey + ' !== ' + pub2}
      }
    } catch(error) {
      console.log('privkeyError', error, privkey)
      privkeyError = error.message + ' => ' + privkey
    }

    if(privkeyError || pubkeyError) {
      privkey = 'DO NOT USE'
      pubkey = 'DO NOT USE'
    }

    return {pubkey, privkey, pubkeyError, privkeyError}
}
