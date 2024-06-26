tinymce.PluginManager.requireLangPack('codehl', 'es');
tinymce.PluginManager.add("codehl", function(t, e) {
    function cmdcodehl() {
        var code = t.selection.getContent({format: 'text'});
        t.windowManager.open({
            title: 'title',
            url: e + '/dialog.html',
            width: 780,
            height: 600,
            inline: true,
            buttons: [{text: "Insert", onclick: function() {
                        var e = t.windowManager.getWindows()[0];
                        t.insertContent(e.getContentWindow().document.getElementById("codearea").innerHTML), e.close()
                    }}, {text: "Close", onclick: "close"}]
        }, {
            code: code
        });
    }

    function clozeExport() {
        var content = t.getContent({format: 'raw'});
         // Question format.
                question = '{[0-9.]*:[A-Z.\_?]+:[^}]*}';
                find = new RegExp(question, 'g');
                list = content.match(find);
                // Array to save question's values and feedback.
                I = 'I = new Array;';
                if (list === null) {
                    alert("CLOZE question not found");
                    return;
                }
                for (var i = 0; i < list.length; i++) {
                    elements = extractElements(list[i]);
                    content = content.replace(list[i], htmlOutput(i, elements));
                    encodeAnswers(i, elements.answers);
                }

                // Create a new window to try CLOZE questions.
                var opened = window.open("");
                opened.document.write(getHeader() + getBody(content));

                /**
                 * Extract the question's elements
                 * @param {string} cloze_question Question in CLOZE format
                 * @returns questions's elements
                 */
                function extractElements(cloze_question) {
                    subexp = new RegExp('[a-zA-Z0-9.\_?]+');

                    expWeight = new RegExp('{[0-9.]*:');
                    expType = new RegExp(':[A-Z.\_?]+:');
                    expAnswers = new RegExp('%[^}]+');

                    weight = cloze_question.match(expWeight);
                    type = cloze_question.match(expType);
                    list_answers = cloze_question.match(expAnswers);

                    var elements = {
                        weight: weight.toString().match(subexp),
                        type: type.toString().match(subexp),
                        answers: extractAnswers(list_answers.toString())};
                    return elements;
                }

                /**
                 * Extract the different asnwers for a question
                 * @param {type} answers answer
                 * @returns {Array} value, asnwer and feedback for every asnwer
                 */
                function extractAnswers(answers) {
                    var list = new Array;

                    textValue = '%[0-9.]+%';
                    textAnswer = '%[a-zA-Z.]+';
                    textFeedback = '#[a-zA-Z0-9.]*';

                    subexp = new RegExp('[a-zA-Z0-9.]+');
                    expValue = new RegExp(textValue, 'g');
                    expAnswer = new RegExp(textAnswer, 'g');
                    expFeedback = new RegExp(textFeedback, 'g');

                    list_values = answers.match(expValue);
                    list_answers = answers.match(expAnswer);
                    list_feedback = answers.match(expFeedback);
                    for (var i = 0; i < list_values.length; i++) {
                        list[i] = new Array;
                        list[i][0] = list_values[i].match(subexp);
                        list[i][1] = list_answers[i].match(subexp);
                        list[i][2] = (list_feedback[i].match(subexp) === null ? '' : list_feedback[i].match(subexp));
                    }
                    return list;
                }

                /**
                 * Generate the HTML expressions for a question.
                 * @param {type} id question id
                 * @param {type} question question values
                 * @returns {String} HTML code
                 */
                function htmlOutput(id, question) {
                    switch (question.type.toString()) {
                        case 'SHORTANSWER':
                        case 'SHORTANSWER_C':
                            return '<input type="text" id="quest_' + id + '"><span id="span_' + id + '"></span>';
                        case 'MULTICHOICE':
                            var options = '';
                            for (var i = 0; i < question.answers.length; i++) {
                                options += '<option>' + question.answers[i][1] + '</option>';
                            }
                            return '<select id="quest_' + id + '">' + options + '</select><span id="span_' + id + '"></span>';
                        case 'MULTICHOICE_H':
                        case 'MULTICHOICE_V':
                            var radio = '';
                            for (var i = 0; i < question.answers.length; i++) {
                                radio += '<input type="radio" name="radio" id="quest_' + id + '" value="' + question.answers[i][1] + '">' + question.answers[i][1];
                            }
                            return radio + '<span id="span_' + id + '"></span>';
                    }
                }

                /**
                 * Encode the question's answers and feedback.
                 * @param {type} str text to encode
                 * @returns {String} unicode equivalence
                 */
                function toUnicode(str) {
                    var unicodeString = '';
                    for (var i = 0; i < str.length; i++) {
                        var unicode = str.charCodeAt(i).toString(16).toUpperCase();
                        while (unicode.length < 4) {
                            unicode = '0' + unicode;
                        }
                        unicode = '\\u' + unicode;
                        unicodeString += unicode;
                    }
                    return unicodeString;
                }

                /**
                 * Encode and save asnwers and feedback
                 * @param {type} id question id
                 * @param {type} questions question
                 * @returns void
                 */
                function encodeAnswers(id, questions) {
                    I += 'I[' + id + '] = new Array;';
                    for (var i = 0; i < questions.length; i++) {
                        I += 'I[' + id + '][' + i + '] = new Array; I[' + id + '][' + i + '][0] = ' + questions[i][0] + '; I[' + id + '][' + i + '][1] = "' + toUnicode(questions[i][1].toString()) + '"; I[' + id + '][' + i + '][2] = "' + toUnicode(questions[i][2].toString()) + '";';
                    }
                }

                /**
                 * Print the header of the export window.
                 * @returns {String} HTML header
                 */
                function getHeader() {
                    var header = {
                        meta: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
                        title: '<title>Cloze Test</title>',
                        css: '<style>.has-error{border-color:#A94442}.has-success{border-color:#3C763D}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;word-break:break-all;word-wrap:break-word;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}.container{max-width: 970px;margin-right:auto;margin-left:auto;padding-left:5px;padding-right:5px;}.pln{color:#000}@media screen{.str{color:#080}.kwd{color:#008}.com{color:#800}.typ{color:#606}.lit{color:#066}.clo,.opn,.pun{color:#660}.tag{color:#008}.atn{color:#606}.atv{color:#080}.dec,.var{color:#606}.fun{color:red}}@media print,projection{.str{color:#060}.kwd{color:#006;font-weight:700}.com{color:#600;font-style:italic}.typ{color:#404;font-weight:700}.lit{color:#044}.clo,.opn,.pun{color:#440}.tag{color:#006;font-weight:700}.atn{color:#404}.atv{color:#060}}pre.prettyprint{padding:2px;border:1px solid #888}ol.linenums{margin-top:0;margin-bottom:0}li.L0,li.L1,li.L2,li.L3,li.L5,li.L6,li.L7,li.L8{list-style-type:none}li.L1,li.L3,li.L5,li.L7,li.L9{background:#eee}</style>',
                        script: '<script>' + I + 'function checkAnswers(){var e=0;var t=0;while((a=document.getElementById("quest_"+e+""))!==null){for(var n=0;n<I[e].length;n++){if(I[e][n][0]===100&&a.value===I[e][n][1]){isCorrect(e,I[e][n][2]);t+=I[e][n][0];break}else if(a.value===I[e][n][1]){isWrong(e,I[e][n][2]);break}if(n===I[e].length-1)isWrong(e,"Incorrecto")}e++}alert("Tu resultado final: "+t+" puntos.")}function isCorrect(e,t){var n=document.getElementById("quest_"+e+"").className="has-success";var r=document.getElementById("span_"+e+"").innerHTML=t}function isWrong(e,t){document.getElementById("quest_"+e+"").className="has-error";var n=document.getElementById("span_"+e+"").innerHTML=t}</script>'
                    };
                    return '<!DOCTYPE html><html><head>' + header.meta + header.title + header.css + header.script + '</head>';
                }

                /**
                 * Print the body of the export window
                 * @param {type} content body content
                 * @returns HTML body
                 */
                function getBody(content) {
                    return '<body><div class="container">' + content + '</div><div class="container"><button id="check" onclick="checkAnswers();">Check!</button></div></body></html>';
                }
             }

    t.addButton("codehl", {title: 'Give format to selected code', image: e + '/img/codehl.gif', onclick: cmdcodehl}),
    t.addMenuItem("codehl", {text: 'Give format to selected code', image: e + '/img/codehl.gif', context: "tools", onclick: cmdcodehl}),
    t.addButton("clozeexport", {title: 'Exporta tus preguntas CLOZE', image: e + '/img/codehle.gif', onclick: clozeExport},
    t.addMenuItem("clozeexport", {text: 'Exporta tus preguntas CLOZE', image: e + '/img/codehle.gif', context: "tools", onclick: clozeExport}));
});