/*
 Plugin name: Translate snippets
 Description: Translates Bear Blog UI snippets into another language. Defaults to Portuguese (pt-BR). Modify the translations object to match your language.
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    // Modify these translations to match your language
    const translations = {
        poweredBy: 'Desenvolvido por ',
        toastButton: 'Recomendar este post',
        toasted: 'Recomendado',
        subscribeHeading: 'Assinar este blog',
        emailPlaceholder: 'Endereço de e-mail...',
        subscribeButton: 'Assinar',
    };

    document.addEventListener('DOMContentLoaded', function() {
        // "Powered by" in the footer
        const footer = document.querySelector('footer span:last-child');
        if (footer) footer.childNodes[0].textContent = translations.poweredBy;

        // "Toast this post" / "Toasted" on the upvote button
        const btn = document.querySelector('.upvote-button');
        if (btn) {
            btn.title = btn.title.replace('Toast this post', translations.toastButton).replace('Toasted', translations.toasted);
            btn.setAttribute('aria-label', btn.getAttribute('aria-label').replace('Toast this post', translations.toastButton).replace('Toasted', translations.toasted));
        }

        // Subscribe page elements
        const form = document.querySelector('.email-signup');
        if (form) {
            const heading = document.querySelector('main p b');
            if (heading) heading.textContent = translations.subscribeHeading;

            const emailInput = form.querySelector('input[name="email"]');
            if (emailInput) emailInput.placeholder = translations.emailPlaceholder;

            const submitBtn = form.querySelector('input[type="submit"]');
            if (submitBtn) submitBtn.value = translations.subscribeButton;
        }
    });
})();
