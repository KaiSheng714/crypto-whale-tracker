document.addEventListener('DOMContentLoaded', function () {
  $("#loading").hide();

  currentDate = formatDate();
  showDateString(currentDate);
  fetchData(currentDate).then(function () {
    if (location.hash) {
      $('#searchInput').val(location.hash.replace('#', ''));
      search();
    }
    refreshDateButton();
  });
});

function goPrevDate() {
  const targetDate = new Date(new Date(currentDate).getTime() - DAY_DIFF);
  const dateString = formatDate(targetDate);

  showDateString(dateString);
  currentDate = targetDate;

  fetchData(dateString).then(function () {
    search();
  });
  refreshDateButton();

}

function goNextDate() {
  const nextDate = new Date(new Date(currentDate).getTime() + DAY_DIFF);
  const dateString = formatDate(nextDate);

  showDateString(dateString);
  currentDate = nextDate;

  fetchData(dateString).then(function () {
    search();
  });
  refreshDateButton();

}

function fetchData(dateString) {
  $("#result").html('');
  $("#loading").show();

  return new Promise((resolve, reject) => {
    let request = $.get(baseUrl + '/api/v1/whale/' + dateString);
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
      });
      resolve();
    });
    request.fail(function (error) {
      $("#loading").hide();
      reject();
    });

  });
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