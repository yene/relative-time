
// Wrap `<time>` in `<relative-time>` element.
// <relative-time><time datetime="2019-11-19T08:58:52+01:00">2019-11-19T08:58</time></relative-time>
function relativeTime() {
  if ('customElements' in window) {
    window.customElements.define('relative-time',
      class extends HTMLElement {
        connectedCallback() {
          var time = this.querySelector('time');
          if (time === null) {return;}
          var datetime = time.getAttribute('datetime');
          time.textContent = relativeDateString(datetime);
        }
      }
    );
    return;
  }
  // Fallback for IE, Edge
  var rt = document.querySelectorAll('relative-time');
  for (var i = 0; i < rt.length; i++) {
    var time = rt[i].querySelector('time')
    if (time === null) {continue;}
    var datetime = time.getAttribute('datetime');
    time.textContent = relativeDateString(datetime);
  }
}
relativeTime();

/*
Relative time

* X seconds/minutes/hours ago, to max 5 hours
* Today at 13:00
* Yesterday at 13:00
* else 15.3.2019 (date is not ommited, for better readability)
* Note: Time formatting could be done with toLocaleDateString
*/
function relativeDateString(d) {
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var date = new Date(d); // Could be that it does not work in all browsers
  var now = new Date();
  var diff = now.getTime() - date.getTime();

  var sec = Math.floor(diff / (1000));
  if (sec < 0) {
    return d;
  }
  if (sec < 60) {
    return sec + ' seconds ago';
  }

  var min = Math.floor(diff / (1000*60))
  if (min < 60) {
    if (min == 1) {
      return '1 minute ago';
    }
    return min + ' minutes ago';
  }

  var hrs = Math.floor(diff / (1000*60*60))
  if (hrs <= 5) {
    if (hrs == 1) {
      return '1 hour ago';
    }
    return hrs + ' hours ago';
  }

  if (isToday(date)) {
    return 'Today at ' + timeFormatted(date);
  }

  if (isYesterday(date)) {
    return 'Yesterday at ' + timeFormatted(date);
  }

  return date.getDate() + '. ' + month[date.getMonth()] + ' ' + date.getFullYear();
}

function timeFormatted(date) {
  return ('0' + date.getHours()).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2);
}

function isToday(date) {
  var now = new Date();
  if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
    return true;
  }
  return false;
}

function isYesterday(date) {
  var d = new Date();
  d.setDate(d.getDate() - 1);
  if (date.getFullYear() === d.getFullYear() && date.getMonth() === d.getMonth() && date.getDate() === d.getDate()) {
    return true;
  }
  return false;
}
