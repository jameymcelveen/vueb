/**
 * Created by Jamey McElveen on 9/4/16.
 */

var Deps = (function() {
  var
    script = document.currentScript,
    config = null;

  if (!script) {
    console.error('Unknown error');
    return;
  }

  config = script.getAttribute('data-config');

  if (!cnfig) {
    console.error('Config not set');
    return;
  }

  Http.GET(config, function(data, error) {
    loadAll({data: data, error: error}, function(data, error) {
      if (error) {
        console.error(error);
      };
    });
  });

})();

function loadAll(opts, callback) {
  if (opts.deps) {
    opts.deps.forEach(function(dep) {
      Http.GET( config, function( data, error ) {
        loadAll( {data: data, error: error}, function( data, error ) {
          if ( error ) {
            console.error( error );
          };
        });
      });
    });
  }

  if (opts.styles) {

  }
}

function loadDeps(deps, callback) {

}

function loadIcons(deps, callback) {

}

function loadStyles(deps, callback) {
  deps.styles.forEach(function(style) {
    Http.GET( style, function( data, error ) {
      if ( error ) { console.error( error ); };

      callback(data, error);
    });
  });
}

function loadScripts(deps, callback) {

}


function Http() {

  this.GET = function(url, callback) {
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
  };

}
