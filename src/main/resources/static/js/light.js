document.addEventListener('DOMContentLoaded', function () {
  const dateString = formatDate();
  showDateString(dateString);

  $('#fearIndexImg').on('load', function () {
    $('#fearIndexImgLoading').hide();
  });
  $('#fearIndexImg').on('error', function () {
    $('#fearIndexImgLoading').hide();
  });

  fetchAll(dateString)
});

function fetchFearIndexImg(dateString) {
  $('#fearIndexImgLoading').show();
  let url = 'https://alternative.me/images/fng/crypto-fear-and-greed-index-' + dateString + '.png';
  $('#fearIndexImg').attr('src', url);
}

function goDate(input) {
  let diff = 24 * 60 * 60 * 1000;
  if (input === 'prev') {
    diff *= -1;
  }

  const targetDate = new Date(new Date($('#dateText').text()).getTime() + diff);
  const dateString = formatDate(targetDate);
  showDateString(dateString);
  fetchAll(dateString);
}

function fetchAll(dateString) {
  fetchFearIndexImg(dateString);
  fetch2140Data(dateString).then(function () {
    $("#2140Loading").show();
  }).finally(function () {
    $("#2140Loading").hide();
  });
}

function fetch2140Data(dateString) {
  return new Promise((resolve, reject) => {
    let request = $.get(baseUrl + '/api/v1/light/' + dateString);

    $('#2140div').html('');

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

function formatDate(d) {
  if (!d) {
    d = new Date();
  }
  // ex  2021-1-15
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + ("0" + d.getDate()).slice(-2);
}