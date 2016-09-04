/**
 * Created by Jamey McElveen on 9/1/16.
 */

export default class Http {
  static GET(url, callback) {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
        if (xmlhttp.status == 200) {
          callback(xmlhttp.responseText, null);
        }
        else if (xmlhttp.status == 400) {
          callback(null, 'There was an error 400');
        }
        else {
          callback(null, 'something else other than 200 was returned');
        }
      }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
}
