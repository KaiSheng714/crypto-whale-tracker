const baseUrl = location.origin + location.pathname;

document.addEventListener('DOMContentLoaded', function () {
  $("#loading").hide();
  const dateString = formatDate();
  showDateString(dateString);
  fetchData(dateString).then(function () {
    if (location.hash) {
      $('#searchInput').val(location.hash.replace('#', ''));
      search();
    }
  });
});

function showDateString(str) {
  $('#dateText').text(str);
}

function goDate(input) {
  let diff = 24 * 60 * 60 * 1000;
  if (input === 'prev') {
    diff *= -1;
  }

  const targetDate = new Date(new Date($('#dateText').text()).getTime() + diff);
  const dateString = formatDate(targetDate);
  showDateString(dateString);
  fetchData(dateString).then(function () {
    search();
  });
}

function fetchData(dateString) {
  $("#result").html('');
  $("#loading").show();

  return new Promise((resolve, reject) => {
    let request = $.get(baseUrl + 'api/v1/data/' + dateString);
    request.done(function (response) {
      console.log(response);
      response.data.reverse().forEach(function (row) {
        row = JSON.parse(row);
        const time = '<div class="time">' + row.time + '</div>';
        const header = '<div class="tokenHeader">' +
            '<div class="tokenName">Name</div>' +
            '<div class="tokenBalance">Balance</div>' +
            '<div class="tokenUsdValue">USD</div>' +
            '<div class="tokenPercentage">Percentage</div>' +
            '</div>';

        let tokensDiv = '';
        row.top.forEach(function (token) {
          const usdValue = (parseInt(token.usdValue)).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0
          });
          const balance = (parseInt(token.balance)).toLocaleString("en-US");
          tokensDiv += '<div class="tokenRow">' +
            '<div class="tokenName">' + token.token + '</div>' +
            '<div class="tokenBalance non-select">' + balance + '</div>' +
            '<div class="tokenUsdValue">' + usdValue + '</div>' +
            '<div class="tokenPercentage">' + token.percentage.toFixed(3) + ' %</div>' +
            '</div>';
        })

        const rowDiv =
            '<div>' +
            time +
            header +
            tokensDiv +
            '</div>';
        $("#result").append(rowDiv);
        $("#loading").hide();
        resolve();
      });
      request.fail(function (error) {
        $("#loading").hide();
        resolve();
      });

    });
  });
}


// function addColor() {
//   let prev;
//   $('.tokenBalance').each(function (index, element) {
//     let number = parseInt($(element).text());
//     if (!isNaN(number) && !isNaN(prev)) {
//       if (number > prev) {
//         $(element).css('color', 'green');
//       } else if (number < prev) {
//         $(element).css('color', 'red');
//       }
//       prev = number
//     }
//   });
// }

function formatDate(d) {
  if (!d) {
    d = new Date();
  }
  // ex  2021-01-15
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}

function search() {
  const str = $('#searchInput').val().trim();
  location.hash = str;
  $('.tokenRow').each(function () {
    const text = $(this).text();
    if (text.toUpperCase().indexOf(str.toUpperCase()) > -1) {
      $(this).css('display', '');
    } else {
      $(this).css('display', 'none');
    }
  })
}

function filterDuplicate() {

}