getProducers();

function checkLibertyBlock() {
  document.querySelector("input[value=libertylion1]").checked = true
  updateSelectedBPs();
}

function toggleKeyInput () {
  var checked = document.querySelector('input[name="signing-method"]:checked').value;
  var privateKeyInput =  document.getElementById("private-key");
  var keyAlert = document.getElementById("key-alert");
  if (checked == "key") {
    privateKeyInput.style.display = "block";
  }
  else {
    privateKeyInput.style.display = "none";
    if (typeof scatter === "undefined") {
      var alert = `<div class="alert alert-danger" role="alert">
        Scatter is not installed. <a class="menu-link http" target="_blank" href="https://scatter-eos.com/">https://scatter-eos.com/</a> Refresh page after installing.
      </div>`
      document.getElementById('alerts').innerHTML = alert;
      return false;
    }
    else {
      scatter.getIdentity().catch(err => {
        if (err.type == "locked") {
          var alert = `<div class="alert alert-danger" role="alert">
            Please refresh page after unlocking Scatter.
          </div>`
          document.getElementById('alerts').innerHTML = alert;
        }
      });
    }
  }
}

function filterProds () {
  var search = document.getElementById('filter-prods').value;
  document.querySelectorAll('.prod-row').forEach(function (row) {
    if (search === "")
      row.style.display = "table-row";
    else if (row.childNodes[3].textContent.indexOf(search) > -1)
      row.style.display = "table-row";
    else
      row.style.display = "none";
  });
}

function getEos() {
  var method = document.querySelector('input[name="signing-method"]:checked').value;
  var network = "";
  if ( document.getElementById("producers-select").classList.contains('invisible') ) {
    network = document.getElementById('custom-network').value;
  } else {
    network = document.getElementById('network').value;
  }


  var protocol = network.slice(0, network.lastIndexOf(":"));
  var ip = network.slice(network.lastIndexOf("/") + 1, network.lastIndexOf(":"));
  var port = network.slice(network.lastIndexOf(":") + 1);
  if (method == "scatter") {
    var scatterNetwork = {
      blockchain: 'eos',
      host: ip,
      port: port,
      chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
    }
    var config = {
      broadcast: true,
      sign: true,
      chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
    }
    return scatter.eos(scatterNetwork, Eos, config, protocol);
  }
  else {
    var privateKey = document.getElementById('private-key').value;
    var config = {
      keyProvider: [privateKey],
      httpEndpoint: network,
      broadcast: true,
      sign: true,
      chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
      expireInSeconds: 30
    }
    return Eos(config);
  }
}

function getProducers() {
  var eos = getEos();
  console.log('eos: ', eos);
  var params = {
      json: true,
      scope: "eosio",
      code: "eosio",
      table: "producers",
      limit: 200
  }
  var tbody = document.querySelector("#block-producers tbody");
  tbody.innerHTML = '';

  eos.getTableRows(params).then(resp => {
                        //.sort((a,b) => Number(a.total_votes) > Number(b.total_votes) ? -1:1);
    var sorted = resp.rows.sort(function(a, b){return 0.5 - Math.random()});
    sorted.map(prod => `<tr class="prod-row">
        <td><input type="checkbox" name="vote-prods" value="${prod.owner}"></td>
        <td>${prod.owner}</td>
    </tr>`)
    .forEach(row => tbody.innerHTML += row);

    document.getElementsByName('vote-prods').forEach(e => {
        e.onclick = updateSelectedBPs;
    });

  }).catch(err => {
    var alert = `<div class="alert alert-danger" role="alert">
        Failed to load Block Producers from the Custom Network.
    </div>`;
    document.getElementById('alerts').innerHTML = alert;

    document.getElementById('vote').disabled = false;
  });
}

function getProducerVotes() {
  var eos = getEos();
  var params = {
    json: true,
    scope: "eosio",
    code: "eosio",
    table: "producers",
    limit: 200
  }
  var tbody = document.querySelector("#total-votes-block-producers tbody");
  tbody.innerHTML = '';

  eos.getTableRows(params).then(resp => {

    var sorted = resp.rows.sort((a,b) => Number(a.total_votes) > Number(b.total_votes) ? -1:1);
    sorted.map((prod, i) => `<tr class="prod-row">
        <td>${i+1}</td>
        <td>${prod.owner}</td>
        <td>${numberWithCommas((prod.total_votes  / calculateVoteWeight() / 10000).toFixed(0))}</td>
    </tr>`)
    .forEach(row => tbody.innerHTML += row);
  }).catch(err => {
    var alert = `<div class="alert alert-danger" role="alert">
        Failed to load Block Producers from the Custom Network.
    </div>`;
    document.getElementById('alerts').innerHTML = alert;

    document.getElementById('vote').disabled = false;
  });

}

function getSelectedBPs () {
  var checked = []
  document.getElementsByName('vote-prods').forEach(function (prod) {
    if (prod.checked)
      checked.push(prod.value);
  });
  return checked;
}

function updateSelectedBPs() {
  var checked = getSelectedBPs();
  document.getElementById("selected-bps").innerHTML = checked.join(', ');
  document.getElementById("selected-count").innerHTML = checked.length;
}

function prettyNumber(num) {
  num = parseInt(parseInt(num) / 1e10 * 2.67708);
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function calculateVoteWeight() {
  //time epoch:
  //https://github.com/EOSIO/eos/blob/master/contracts/eosiolib/time.hpp#L160
  //stake to vote
  //https://github.com/EOSIO/eos/blob/master/contracts/eosio.system/voting.cpp#L105-L109
  var timestamp_epoch = 946684800000;
  var dates_ = (Date.now() / 1000) - (timestamp_epoch / 1000);
  var weight_ = (dates_ / (86400 * 7)) / 52;  //86400 = seconds per day 24*3600
  return Math.pow(2, weight_);
}

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
}

function refreshKeys() {
  scatter.forgetIdentity()
    .then(scatter.getIdentity)
    .then(() => {
      var alert = `<div class="alert alert-info" role="alert">
        Keys refreshed.
      </div>`
      document.getElementById('alerts').innerHTML = alert;
    });
}

function vote () {
  var eos = getEos();

  var selectedBPs = getSelectedBPs();
  if (selectedBPs.length > 30) {
    var alert = `<div class="alert alert-danger" role="alert">
      Maximum 30 block producers can be selected
    </div>`
    document.getElementById('alerts').innerHTML = alert;
    return false;
  }

  document.getElementById('vote').disabled = true;

  var sortedBPs = selectedBPs.sort();
  var account = document.getElementById('eos-account').value;
  eos.transaction(tr => {
    tr.voteproducer(account, "", sortedBPs);
  }).then(tx => {
    var alert = `<div class="alert alert-success" role="alert">
      Your vote has been cast. Refresh page for new vote counts.<br>
      TxID: ${tx.transaction_id}
    </div>`
    document.getElementById('alerts').innerHTML = alert;
    document.getElementById('private-key').value = "";

    document.getElementById('vote').disabled = false;
  }).catch(err => {
    console.error(err);
    if (typeof err == "string") {
      err = JSON.parse(err);
      var message = `Error: ${err.error.details[0].message}`;
    }
    else if (err.type == "account_missing")
      var message = `Error: Key does not match account. Click here to use a <a href="#" onclick="refreshKeys()">different identity</a>`;
    else if (err.message)
      var message = `Error: Transaction failed. ${err.message}`;
    else
      var message = `Error: Transaction failed. ${err.type}. Try refreshing page.`;
    var alert = `<div class="alert alert-danger" role="alert">
      ${message}
    </div>`;
    document.getElementById('alerts').innerHTML = alert;

    document.getElementById('vote').disabled = false;
  });
}

function sendAlert (message, type) {
  var alert = `<div class="alert alert-warning" role="alert"></div>`
}
