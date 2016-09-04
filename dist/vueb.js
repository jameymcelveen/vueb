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
        script.push( line );
      } else if (inStyle) {
        style.push(line);
      }
    }

    return {
      template: template.join(''),
      script: script.join('\n'),
      style: style.join('\n')
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
    Http.GET(src, function (data, err) {
      if(err) {
        console.error(err);
        callback(null);
      } else {
        var template = TemplateParser.parse(data);
        var script = mutateScript(src, template);
        console.log(script);

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

        var func = new Function('Vue', script);

        /*jshint +W054 */
        if(template.style) {
          Utils.injectStyle(template.style);
        }
        callback(func);
      }
    });
  };

  function mutateScript(url, template) {
    var componentName = url.substring(url.lastIndexOf('/')+1).split('.')[0];
    var objectName = snakeToCamel(componentName);
    console.log(JSON.stringify(template));
    var rx = /(^\s*)(?:export\s+default|module\.exports\s*=)\s*{(.*)/g;
    var replacement = '$1var ' + objectName + ' = {$2';
    var script =  template.script || 'export default {}';
      script = script.replace(rx, replacement);
    var t = template.template.replace(/"/g, "\\\"");
    script += '\n\n' + objectName + '.template = "' + t + '";\n'+
      'Vue.component("'+componentName+'", '+objectName+');';
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

    function loadScript(src) {
      console.log( src );
      ComponentFactory.build(src, function (data, err) {
        if(err) {
          console.error(err);
          return;
        }
        console.log(data.toString());
      data(Vue);
      var index = srcs2.indexOf(src);
      srcs2.splice(index, 1);
      if(srcs2.length === 0){
        new Vue({el:'html'});
      }
    });
    }

    return {};

  })();

  return VueComponent;

}());