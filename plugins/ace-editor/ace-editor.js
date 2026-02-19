/*
 Plugin name: Ace Editor
 Description: Replaces the Bear Blog post editor with the Ace code editor, providing Markdown syntax highlighting and enhanced editing features.
 Author: X3
 Author URI:
*/

(function() {
    'use strict';

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function initAceEditor() {
        // Only run if Bear Blog's $textarea global is available
        if (typeof $textarea === 'undefined' || !$textarea) return;

        // Make the default text area invisible. It still exists and holds the current page or post content, but it just isn't shown on screen
        $textarea.style.display = "none";

        // ace-editor needs a div with a given ID to be created.
        // This creates a new div right after the invisible text area
        // to be transformed into the editor
        const aceDiv = document.createElement("div");
        aceDiv.id = "ace-editor";
        aceDiv.style.height = "700px";
        $textarea.insertAdjacentElement('afterend', aceDiv);

        // Now that the div is ready, create the editor
        const editor = ace.edit("ace-editor");

        // Hide the line number gutter for a cleaner writing experience
        editor.renderer.setShowGutter(false);

        // Apply theme and set the editing mode to markdown so syntax highlighting works
        editor.setTheme("ace/theme/solarized_dark");
        editor.session.setMode("ace/mode/markdown");

        // Populate ace-editor with the existing page or post content in the hidden text area
        editor.setValue($textarea.value);

        // Reset the cursor back to the top of the editor
        editor.gotoLine(0);

        // Allow scrolling past the last line of the editor. This is a personal preference, but I think it works well in this case!
        editor.setOption("scrollPastEnd", 0.5);

        // Wrap long lines at the editor's width to avoid having to scroll horizontally
        editor.session.setUseWrapMode(true);

        // When you click the "Publish" button, Bear saves the text that is in the original hidden text area, not the text in ace-editor.
        // These last lines make sure that any modifications to the text in ace-editor get synced to the hidden text area, so that your edited content gets saved when you click "Publish"
        editor.session.on("change", function() {
            $textarea.value = editor.getValue();
        });
    }

    // Load ace.js first, then the markdown mode, then initialise the editor.
    // Scripts placed in the footer run after the DOM is ready, so no DOMContentLoaded needed.
    loadScript('https://cdn.jsdelivr.net/npm/ace-builds@1.43.4/src-min/ace.js', function() {
        loadScript('https://cdn.jsdelivr.net/npm/ace-builds@1.43.4/src-min/mode-markdown.js', function() {
            initAceEditor();
        });
    });
})();
