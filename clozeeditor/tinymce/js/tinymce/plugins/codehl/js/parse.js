function parseCSS(cssfile) {
    var css = "";
    var list = [];
    // Get CSS rules.
    for (var x = 0; x < document.styleSheets.length; x++) {
        if (document.styleSheets[x].href && (document.styleSheets[x].href.indexOf(cssfile) > 0)) {
            classes = document.styleSheets[x].cssRules;
            break;
        }
    }
    if (classes === null)
        return null;
    // Get CSS atributes from the rules.
    for (var x = 0; x < classes.length; x++) {
        css += classes[x].cssText;
    }
    var cssl = css.length;

    var rule = new RegExp('\\.\[A-Za-z0-9.]+');
    var text = new RegExp('\\{.+\}');
    var subexp = new RegExp('\[^\.|^\{|^\}]+');

    while ((mrule = css.match(rule)) !== null) {
        mtext = css.match(text);
        // Avoid select preview rules.
        if (css.indexOf(mrule) > css.indexOf(mtext)) {
            css = css.slice((css.indexOf(mtext) + mtext.length), cssl);
            mtext = css.match(text);
        }
        list.push({rule: mrule.toString().match(subexp), text: mtext.toString().match(subexp)});
        // Delete added rules.
        css = css.slice((css.indexOf(mrule) + mrule.length), cssl);
    }
    return list;
}