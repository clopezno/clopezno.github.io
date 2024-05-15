tinymce.PluginManager.add("clozeeditor", function(t, e) {
    tinymce.PluginManager.requireLangPack('clozeeditor', 'es');
    function mceclozeeditor() {
        lang = t.getParam("language");
        t.windowManager.open({
            title: "Cloze Editor",
            url: e + '/dialog.html?lang=' + lang,
            width: 620 + parseInt(t.getLang('clozeeditor.delta_width', 0)),
            height: 360 + parseInt(t.getLang('clozeeditor.delta_height', 0)),
            inline: true,
            buttons: [{text: "Close", onclick: "close"}]
        }, {
            content: t.selection.getContent({format: 'text'})
        });
    }
    t.addButton("clozeeditor", {title: "This is an editor for CLOZE questions", image: e + '/img/cloze_editor.png', onclick: mceclozeeditor}),
    t.addMenuItem("clozeeditor", {text: "This is an editor for CLOZE questions", image: e + '/img/cloze_editor.png', context: "tools", onclick: mceclozeeditor})
});
