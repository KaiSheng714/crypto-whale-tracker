console.log('hello');

const baseUrl = location.origin + location.pathname;

document.addEventListener('DOMContentLoaded', function () {
  const dateString = formatDate();
  showDateString(dateString);
  fetchData(dateString);
});

function showDateString(str) {
  $('#dateText').text(str);
}

function goPrevDate() {
  const date = new Date($('#dateText').text());
  const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);

  const dateString = formatDate(prevDate);
  fetchData(dateString);
  showDateString(dateString);
}

function goNextDate() {
  const date = new Date($('#dateText').text());
  const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

  const dateString = formatDate(nextDate);
  fetchData(dateString);
  showDateString(dateString);
}

function fetchData(dateString) {
  $("#result").html('Loading...');

  $.get(baseUrl + 'data/' + dateString, function (response) {
    $("#result").html('');
    console.log(response);
    response.data.reverse().forEach(function (row) {
      row = JSON.parse(row);
      var time = '<div class="time">' + row.time + '</div>';
      var header = '<div class="tokenHeader"><div class="tokenName">Name</div> <div class="tokenPercentage">Percentage</div>  </div>'
      var tokensDiv = '';
      row.top.forEach(function (token) {
        tokensDiv += '<div class="tokenRow"><div class="tokenName">' + token.token + '</div><div class="tokenPercentage">' + token.percentage.toFixed(3) + ' %</div></div>';
      })

      var rowDiv =
        '<div>' +
        time +
        header +
        tokensDiv +
        '</div>';

      $("#result").append(rowDiv);
    });
  });
}


function formatDate(d) {
  if (!d) {
    d = new Date();
  }
  // ex  2021-01-15
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}

function search() {
  const str = $('#searchInput').val();
  $('.tokenRow').each(function () {
    const text = $(this).text();
    if (text.toUpperCase().indexOf(str.toUpperCase()) > -1) {
      $(this).css('display', '');
    } else {
      $(this).css('display', 'none');
    }
  })
}