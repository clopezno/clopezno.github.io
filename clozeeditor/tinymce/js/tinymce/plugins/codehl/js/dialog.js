var CodeHightLighter = {
    init: function() {
        var args = top.tinymce.activeEditor.windowManager.getParams();
        var code = args.code;

        // Comprobar si se ha seleccionado código en el editor.
        if (code === "") {
            document.getElementById("errorPanel").className = "visible";
        } else {
            document.getElementById("textPanel").className = "visible";

            preFormat(code);

            document.getElementById('indent').addEventListener('click', function() {
                preFormat(code);
            }, false);
            document.getElementById('inlineCSS').addEventListener('click', function() {
                posFormat();
            }, false);
        }

        function preFormat(str) {
            if (!document.getElementById("indent").checked) {
                str = jspretty({source: str, insize: 4, preserve: true, space: false});
            }
            str = str.replace(/</g, "&lt;");
            str = str.replace(/>/g, "&gt;");
            str = str.replace(/\n/g, "<br/>");
            str = str.replace(/\s/g, '&nbsp;');
            document.getElementById("codearea").innerHTML = '<pre class="prettyprint"> ' + str + '</pre>';
            prettyPrint();
            
            if (document.getElementById("inlineCSS").checked)posFormat();
        }

        function posFormat() {
            if (document.getElementById("inlineCSS").checked) {
                var str = document.getElementById("codearea").innerHTML;
                styles = parseCSS("prettify.css");
                for (var x = 0; x < styles.length; x++) {
                    text = 'class="' + styles[x].rule + '"';
                    find = new RegExp(text, 'g');
                    str = str.replace(find, 'style="' + styles[x].text + '"');
                }
                document.getElementById("codearea").innerHTML = str;
            }
        }
    }
};
