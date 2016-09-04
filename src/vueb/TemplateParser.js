/**
 * Created by Jamey McElveen on 9/1/16.
 */

const TEMPLATE_START = '<template>';
const TEMPLATE_END = '</template>';
const SCRIPT_START = '<script>';
const SCRIPT_END = '</script>';
const STYLE_START = '<style>';
const STYLE_END = '</style>';

export default class TemplateParser {

  static parse(templateText) {
    templateText = templateText || '';
    let
      i,
      line,
      inTemplete = false,
      inScript = false,
      inStyle = false,
      lines  = templateText.split('\n'),
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

  }
}
