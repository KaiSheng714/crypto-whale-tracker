document.addEventListener('DOMContentLoaded', function () {
  currentDate = formatDate();
  showDateString(currentDate);
  fetchAll(currentDate)
});

function fetchFearIndexImg(dateString) {
  let loadingUrl = 'image/loading.gif';
  $('#fearIndexImg').attr('src', loadingUrl);
  let url = 'https://alternative.me/images/fng/crypto-fear-and-greed-index-' + dateString + '.png';
  $('#fearIndexImg').attr('src', url);
}

function goPrevDate() {
  const targetDate = new Date(new Date(currentDate).getTime() - DAY_DIFF);
  const dateString = formatDate(targetDate);

  showDateString(dateString);
  currentDate = targetDate;
  fetchAll(dateString);
}

function goNextDate() {
  const nextDate = new Date(new Date(currentDate).getTime() + DAY_DIFF);
  const dateString = formatDate(nextDate);

  showDateString(dateString);
  currentDate = nextDate;
  fetchAll(dateString);
}

function fetchAll(dateString) {
  fetchFearIndexImg(formatDateForFearImg(dateString));
  fetch2140Data(dateString).then(function () {
    $("#2140Loading").show();
  }).finally(function () {
    $("#2140Loading").hide();
  });

  refreshDateButton();
}

function fetch2140Data(dateString) {
  $('#2140div').html('');

  return new Promise((resolve, reject) => {
    let request = $.get(baseUrl + '/api/v1/light/' + dateString);
    request.done(function (response) {
      response.data.split('。').forEach(function (data) {
        $('#2140div').append('<p>' + data + ' </p>');
      });
      resolve();
    });

    request.fail(function (error) {
      $('#2140div').text('No Data');
      reject();
    });
  });
}

function formatDateForFearImg(d) {
  if (!d) {
    d = new Date();
  } else {
    d = new Date(d);
  }
  // ex  2021-1-15
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + ("0" + d.getDate()).slice(-2);
}