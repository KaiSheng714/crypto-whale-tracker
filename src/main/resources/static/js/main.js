const baseUrl = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
const DAY_DIFF = 24 * 60 * 60 * 1000;
let currentDate;

function showDateString(str) {
  $('#dateText').text(str);
}

function formatDate(d) {
  if (!d) {
    d = new Date();
  }
  // ex  2021-01-15
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
}

function refreshDateButton() {
  const nextDate = new Date(new Date(currentDate).getTime() + DAY_DIFF);
  let today = new Date();
  if (nextDate.getDate() == 1 || nextDate.getDate() > today.getDate()) {
    $('#goNextDate').css("visibility", "hidden");
  } else {
    $('#goNextDate').css("visibility", "unset");
  }
}
