/*
 Plugin name: Post tag links
 Description: Adds clickable tag links to each post on the blog page
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        if (!document.body.classList.contains('blog')) return;

        const posts = document.querySelectorAll('.blog-posts li');

        posts.forEach(function(post) {
            const tagsAttr = post.getAttribute('data-tags');
            if (!tagsAttr || tagsAttr.trim() === '') return;

            const tags = tagsAttr.split(',');

            const tagContainer = document.createElement('span');
            tagContainer.className = 'post-tags';
            tagContainer.style.marginLeft = '4px';
            tagContainer.style.marginRight = '4px';

            tags.forEach(function(rawTag) {
                const tag = rawTag.trim();
                if (!tag) return;

                const tagLink = document.createElement('a');
                tagLink.href = '/blog/?q=' + encodeURIComponent(tag);
                tagLink.textContent = tag;
                tagLink.className = 'post-tag';
                tagLink.style.fontSize = '0.85em';
                tagLink.style.color = 'inherit';
                tagLink.style.opacity = '0.6';
                tagLink.style.textDecoration = 'none';
                tagLink.style.marginLeft = '4px';
                tagLink.style.padding = '1px 6px';
                tagLink.style.border = '1px solid currentColor';
                tagLink.style.borderRadius = '3px';
                tagLink.style.whiteSpace = 'nowrap';

                tagLink.addEventListener('mouseenter', function() {
                    this.style.opacity = '1';
                });
                tagLink.addEventListener('mouseleave', function() {
                    this.style.opacity = '0.6';
                });

                tagContainer.appendChild(tagLink);
            });

            const titleLink = post.querySelector('a');
            if (titleLink) {
                post.insertBefore(tagContainer, titleLink);
            }
        });
    });
})();
