const baseUrl = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

function showDateString(str) {
  $('#dateText').text(str);
}