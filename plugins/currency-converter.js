/*
 Plugin name: Inline currency converter
 Description: Converts inline currency amounts using a global dropdown. Add <span class="currency" data-amount="100 USD">$100</span> to your posts.
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        const spans = document.querySelectorAll('span.currency[data-amount]');
        if (spans.length === 0) return;

        const currencies = [
            'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY',
            'INR', 'KRW', 'BRL', 'MXN', 'SEK', 'ZAR'
        ];

        // Parse data-amount="100 USD" into { value, currency }
        function parseAmount(str) {
            var parts = str.trim().split(/\s+/);
            if (parts.length !== 2) return null;
            var value = parseFloat(parts[0]);
            if (isNaN(value)) return null;
            return { value: value, currency: parts[1].toUpperCase() };
        }

        // Store original amounts on each span
        var entries = [];
        for (var i = 0; i < spans.length; i++) {
            var parsed = parseAmount(spans[i].getAttribute('data-amount'));
            if (parsed) {
                entries.push({ el: spans[i], value: parsed.value, currency: parsed.currency });
            }
        }
        if (entries.length === 0) return;

        // Build dropdown
        var wrapper = document.createElement('div');
        wrapper.className = 'currency-converter-selector';
        wrapper.style.cssText = 'margin-bottom: 1em; font-size: 0.9em;';

        var label = document.createElement('label');
        label.textContent = 'Convert currencies to: ';
        label.setAttribute('for', 'currency-select');

        var select = document.createElement('select');
        select.id = 'currency-select';

        var defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Original';
        select.appendChild(defaultOpt);

        for (var c = 0; c < currencies.length; c++) {
            var opt = document.createElement('option');
            opt.value = currencies[c];
            opt.textContent = currencies[c];
            select.appendChild(opt);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(select);

        var main = document.querySelector('main');
        if (main) {
            main.insertBefore(wrapper, main.firstChild);
        } else {
            document.body.insertBefore(wrapper, document.body.firstChild);
        }

        // Cache for fetched rates
        var rateCache = {};

        function formatCurrency(value, currency) {
            try {
                return value.toLocaleString(undefined, {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } catch (e) {
                return value.toFixed(2) + ' ' + currency;
            }
        }

        function resetToOriginal() {
            for (var i = 0; i < entries.length; i++) {
                entries[i].el.textContent = formatCurrency(entries[i].value, entries[i].currency);
            }
        }

        function convertAll(targetCurrency) {
            // Group entries by source currency
            var byCurrency = {};
            for (var i = 0; i < entries.length; i++) {
                var src = entries[i].currency;
                if (!byCurrency[src]) byCurrency[src] = [];
                byCurrency[src].push(entries[i]);
            }

            var sourceCurrencies = Object.keys(byCurrency);
            var pending = sourceCurrencies.length;

            for (var s = 0; s < sourceCurrencies.length; s++) {
                (function(src) {
                    if (src === targetCurrency) {
                        // No conversion needed
                        var group = byCurrency[src];
                        for (var j = 0; j < group.length; j++) {
                            group[j].el.textContent = formatCurrency(group[j].value, targetCurrency);
                        }
                        return;
                    }

                    var cacheKey = src + '-' + targetCurrency;
                    if (rateCache[cacheKey]) {
                        applyRate(byCurrency[src], rateCache[cacheKey], targetCurrency);
                        return;
                    }

                    var url = 'https://api.frankfurter.app/latest?from=' + src + '&to=' + targetCurrency;
                    fetch(url)
                        .then(function(res) { return res.json(); })
                        .then(function(data) {
                            var rate = data.rates[targetCurrency];
                            rateCache[cacheKey] = rate;
                            applyRate(byCurrency[src], rate, targetCurrency);
                        })
                        .catch(function() {
                            var group = byCurrency[src];
                            for (var j = 0; j < group.length; j++) {
                                group[j].el.textContent = 'Error';
                            }
                        });
                })(sourceCurrencies[s]);
            }
        }

        function applyRate(group, rate, targetCurrency) {
            for (var j = 0; j < group.length; j++) {
                var converted = group[j].value * rate;
                group[j].el.textContent = formatCurrency(converted, targetCurrency);
            }
        }

        select.addEventListener('change', function() {
            if (this.value === '') {
                resetToOriginal();
            } else {
                convertAll(this.value);
            }
        });

        // Set initial display
        resetToOriginal();
    });
})();
