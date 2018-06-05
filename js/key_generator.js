$(document).ready(function(){
  $('.btn-generate-keys').on('click', function(e){
    e.preventDefault();

    var keyPair = genKeyPair();

    $('.generated-keys').html(
      "<div class='public-key'><span>Public key:</span> <span class='copied' id='public-copied'>Copied!</span><input type='text' id='public-key-input' onclick='copyPublicToClipboard();' value='" + keyPair.pubkey + "'></div>" +
      "<div class='private-key'><span>Private key:</span> <span class='show-private-key' onclick=togglePrivateKeyVisibility();>[show]</span> <span class='copied' id='private-copied'>Copied!</span><input type='password' id='private-key-input' onclick='copyPrivateToClipboard();' value='" + keyPair.privkey + "'></div>"
    )
  });
});

function copyPublicToClipboard() {
  var copyText = document.getElementById("public-key-input");
  copyText.select();
  document.execCommand("copy");
  $('#public-copied').fadeIn("slow");
  $('#public-copied').delay(1500).fadeOut("slow");
}

function copyPrivateToClipboard() {
  $privateKey = $('#private-key-input');
  if($privateKey.attr('type') == 'text'){
    var copyText = document.getElementById("private-key-input");
    copyText.select();
    document.execCommand("copy");
    $('#private-copied').fadeIn("slow");
    $('#private-copied').delay(1500).fadeOut("slow");
  }
}

function togglePrivateKeyVisibility() {
  $privateKey = $('#private-key-input');
  $toggle = $('.show-private-key');
  if($privateKey.attr('type') == 'text'){
    $privateKey.attr('type', 'password');
    $toggle.html('[show]');
  } else {
    $privateKey.attr('type', 'text');
    $toggle.html('[hide]');
  }
}

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
    $('#about-text').animate({ "left": "0px" }, "slow" );
    $('.keys').show();
    return {pubkey, privkey, pubkeyError, privkeyError}
}
