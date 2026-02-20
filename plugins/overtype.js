/*
 Plugin name: Overtype Editor
 Description: Replaces the Bear Blog post editor with the Overtype markdown editor, providing syntax highlighting and shortcuts for markdown features.
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        document.head.appendChild(script);
    }

    function initOvertype() {
        if (typeof $textarea === 'undefined' || !$textarea) return;

        $textarea.style.display = 'none';

        if (typeof $uploadButton !== 'undefined' && $uploadButton) {
            $uploadButton.style.display = 'none';
        }

        var overtypeDiv = document.createElement('div');
        overtypeDiv.className = 'overtype-editor';
        overtypeDiv.style.height = '700px';
        $textarea.insertAdjacentElement('afterend', overtypeDiv);

        var OT = window.OverType.default || window.OverType;
        new OT('.overtype-editor', {
            value: $textarea.value,
            toolbar: true,
            theme: 'cave',
            showStats: true,
            placeholder: '...',
            onChange: function(value) {
                $textarea.value = value;
            }
        });

        var overtypeTextarea = document.querySelector('.overtype-input');
        if (overtypeTextarea) {
            overtypeTextarea.scrollTop = sessionStorage.getItem('overtypeEditorY') || 0;
            overtypeTextarea.addEventListener('scroll', function() {
                sessionStorage.setItem('overtypeEditorY', overtypeTextarea.scrollTop);
            });
        }
    }

    loadScript('https://unpkg.com/overtype', function() {
        initOvertype();
    });
})();
