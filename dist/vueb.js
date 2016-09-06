var VueB = (function () {
  'use strict';

  /**
   * Created by Jamey McElveen on 9/1/16.
   */

  var Http = function Http () {};

  Http.GET = function GET (url, callback) {
    var xmlhttp = new XMLHttpRequest();

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

  /**
   * Created by Jamey McElveen on 9/1/16.
   */

  var TEMPLATE_START = '<template>';
  var TEMPLATE_END = '</template>';
  var SCRIPT_START = '<script>';
  var SCRIPT_END = '</script>';
  var STYLE_START = '<style>';
  var STYLE_END = '</style>';
  //const IMPORT_DEFAULT = /\s*import\s+(\S+)\s+from\s+['"](\S+)["'].*/g;
  var IMPORT_DEFAULT = /\s*import\s+(\S+)\s+from\s+['"](\S+)["'].*/;

  var TemplateParser = function TemplateParser () {};

  TemplateParser.parse = function parse (templateText) {
    templateText = templateText || '';
    var
      i,
      line,
      inTemplete = false,
      inScript = false,
      inStyle = false,
      lines= templateText.split('\n'),
      template = [],
      script = [],
      style = [];

    for ( i=0; i<lines.length; i++ ) {
      line = lines[i].trim();

      if( line.toLocaleLowerCase() === TEMPLATE_START ) {
        inTemplete = true;
      } else if( line.toLocaleLowerCase() === TEMPLATE_END ) {
        inTemplete = false;
      } else if( line.toLocaleLowerCase() === SCRIPT_START ) {
        inScript = true;
      } else if( line.toLocaleLowerCase() === SCRIPT_END ) {
        inScript = false;
      } else if( line.toLocaleLowerCase() === STYLE_START ) {
        inStyle = true;
      } else if( line.toLocaleLowerCase() === STYLE_END ) {
        inStyle = false;
      } else if (inTemplete) {
        template.push(line);
      } else if (inScript) {
        if(line.match(IMPORT_DEFAULT)) {
          console.log('match');
          line = line.replace(IMPORT_DEFAULT, "// var $1 = require('$2');");
          console.log(line);
        }
        script.push( line );
      } else if (inStyle) {
        style.push(line);
      }
    }

    return {
      template: template,
      script: script,
      style: style
    };

  };

  /**
   * Created by Jamey McElveen on 9/1/16.
   */

  var query = function (selector, ctx) {
    return (ctx || document).querySelectorAll(selector);
  };

  var injectStyle = function (css) {
    var
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  };

  var Utils = {
    query: query,
    injectStyle: injectStyle
  };

  /**
   * Created by Jamey McElveen on 9/1/16.
   */

  var ComponentFactory = function ComponentFactory () {};

  ComponentFactory.build = function build (src, callback) {

    // if(components[src]) {
    // callback(components[src]);
    // return;
    // }

    Http.GET(src, function (data, err) {
      if(err) {
        console.error(err);
        callback(null);
      } else {
        var template = TemplateParser.parse(data);
        var componentName = src.substring(src.lastIndexOf('/')+1).split('.')[0];
        var objectName = snakeToCamel(componentName);
        var script = mutateScript(src, componentName, objectName, template);
        if(template.style) {
          Utils.injectStyle(template.style.join('\n'));
        }

        //console.log(script);

        var func = createModuleFunctionFromScript(script);

        callback(func);
      }
    });
  };

  function createModuleFunctionFromScript(script) {
    /* jshint -W054 */
    /* Executing functions as eval is fundamental to vueb.
     *
     * vueb.js should only be used for development or prototyping never for release or
     * production you can build using vueb-cli or your favorite build method.
     * ```
     * # **vueb-cli usage:**
     * # vueb <input html file> -o <output directory>
     * # ex: $ vueb ./index.html -o ./dist
     * ```
     */

    var func = new Function('module', 'require', script);

    /*jshint +W054 */

    return func;
  }

  function mutateScript(url, componentName, objectName, template) {

    var
      rx = /(^\s*)(?:export\s+default|module\.exports\s*=)\s*{(.*)/g,
      layout = '',
      replacement = '$1var ' + objectName + ' = {$2',
      script =  template.script.join('\n') || '  export default {}';
      //t = template.template.replace(/"/g, "\\\"");

    layout += '[\n';
    template.template.forEach(function (line) {
      layout += "    [\"" + (line.replace(/"/g, "\\\"")) + "\"],\n";
    });
    layout += "  ].join('\\n')";


    script = [
      script.replace(rx, replacement),
      ("  " + objectName + ".template = " + layout + ";"),
      ("  " + objectName + ".name = \"" + componentName + "\";"),
      ("  " + objectName + " = Vue.extend(" + objectName + ");"),
      ("  Vue.component(\"" + componentName + "\", " + objectName + ");"),
      ("  module.exports = " + objectName + ";"),
    ].join('\n');


    console.log(script);
      //'Vue.component("'+componentName+'", '+objectName+');\n'+
      //'return '+objectName+';';
    return script;
  }

  function snakeToCamel(s){
    return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
  }

  /**
   * Created by Jamey McElveen on 9/1/16.
   */

  var VueComponent = (function () {
    var srcs = [];
    var srcs2 = [];
    var _modules = {
      'vue': Vue
    };

    if(window) {
      window.require = requireModule;
    }

    window.onload=function() {
      var i;
      var scripts = document.getElementsByTagName("script");
      for (i=0;i<scripts.length;i++) {
        if (scripts[i].getAttribute( "type" ) === "vue/component") {
          srcs.push(scripts[i].getAttribute( "src" ));
          srcs2.push(scripts[i].getAttribute( "src" ));
        }
      }

      for (i=0;i<srcs.length;i++) {
        loadScript(srcs[i]);
      }

    };

    function requireModule(name) {
      return _modules[name];
    }

    function loadScript(src) {
      console.log( src );
      ComponentFactory.build(src, function (func, err) {

        if(err) {
          console.error(err);
          return;
        }

        // execute the function
        defineModule(src, func);
        var index = srcs2.indexOf(src);
        srcs2.splice(index, 1);
        if(srcs2.length === 0) {
          new Vue({el:'html'});
          modulesLoaded();
        }
      });
    }

    function modulesLoaded() {
      for (var k in _modules){
        if (_modules.hasOwnProperty(k)) {
          console.log(k + ':\n');
          console.log(_modules[k].toString() +'\n');
          console.log('\n');
        }
      }
    }

    function defineModule(src, func) {
      var
        module = {},
        require = requireModule;
      console.log(func.toString());
      func(module, require);
      _modules[src] = module;
    }

    return {};

  })();

  return VueComponent;

}());