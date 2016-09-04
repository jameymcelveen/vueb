/**
 * Created by Jamey McElveen on 9/1/16.
 */

import Http from './Http';
import TemplateParser from './TemplateParser';
import Utils from './Utils';

export default class ComponentFactory {

  static build(src, callback) {
    Http.GET(src, (data, err) => {
      if(err) {
        console.error(err);
        callback(null);
      } else {
        let template = TemplateParser.parse(data);
        let script = mutateScript(src, template);
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

        let func = new Function('Vue', script);

        /*jshint +W054 */
        if(template.style) {
          Utils.injectStyle(template.style);
        }
        callback(func);
      }
    });
  }

}


function mutateScript(url, template) {
  let componentName = url.substring(url.lastIndexOf('/')+1).split('.')[0];
  let objectName = snakeToCamel(componentName);
  console.log(JSON.stringify(template));
  var rx = /(^\s*)(?:export\s+default|module\.exports\s*=)\s*{(.*)/g;
  var replacement = '$1var ' + objectName + ' = {$2';
  let script =  template.script || 'export default {}';
    script = script.replace(rx, replacement);
  let t = template.template.replace(/"/g, "\\\"");
  script += '\n\n' + objectName + '.template = "' + t + '";\n'+
    'Vue.component("'+componentName+'", '+objectName+');';
  return script;
}

function snakeToCamel(s){
  return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
}
