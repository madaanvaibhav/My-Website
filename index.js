/* global zuix */
'use strict';

let currentPage;
let mainPage;
let detailsPage;

zuix.using('script', './service-worker.js');
zuix.using('style', '//zuixjs.github.io/zkit/css/flex-layout-attribute.min.css');
zuix.using('style', './index.css');

window.options = {
    mainPage: {
        lazyLoad: false,
        ready: function() {
            mainPage = this.cover({
                "vote_average":7.2,
                "title":"Money Heist",
                "poster_path":"https://th.bing.com/th/id/OIP.vWHVTkB5Ceq32QwoeGb9WgHaNK?w=182&h=324&c=7&r=0&o=5&dpr=1.25&pid=1.7",
                "backdrop_path":"https://images7.alphacoders.com/913/thumb-1920-913392.jpg",
                "overview":"An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
                "release_date":"2017-2021",
                "trailer": "https://everythin.me/webseries/moneyheist/index.html"
            });
            showPage(0);
        }
    },
    detailsPage: {
        lazyLoad: false,
        on: {
            'page:show': function() { bodyScrollEnable(false); },
            'page:hide': function() { bodyScrollEnable(true); }
        },
        ready: function() {
            detailsPage = this;
        }
    },
    footerBar: {
        ready: function(){
            const view = zuix.$(this.view());
            const buttons = view.find('button');
            buttons.each(function(i, el) {
                this.on('click', function() {
                    buttons.removeClass('active');
                    this.addClass('active');
                    window.location.href = '#'+this.attr('ref');
                });
            });
        }
    },
    pageScroll: {
        on: {
            'scroll:change': function(e, data) {
                // synchronize/animate main cover with scroll
                if (currentPage == 0 && mainPage) {
                    mainPage.sync(data);
                }
            }
        }
    },
    content_no_css: {
        css: false
    }
};

// site navigation
window.onhashchange = function() {
    if (window.location.hash.length > 0) {
        switch (window.location.hash) {
            case '#home':
                showPage(0);
                break;
            case '#search':
                showPage(1);
                break;
            case '#notifications':
                showPage(2);
                break;
            case '#about':
                showPage(3);
                break;
        }
    } else showPage(0);
};

function showPage(i) {
    currentPage = i;
    // sync header bar transparency
    if (currentPage == 0) {
        mainPage.sync();
    } else {
        zuix.field('header-bar')
            .css('background-color', 'rgba(33,33,33,1)');
    }
    // hide details page if open
    if (detailsPage && detailsPage.view().style['display'] !== 'none') {
        detailsPage.hide();
    } else {
        // show page
        zuix.field('pages')
            .children().hide()
            .eq(i).show();
    }
}

function bodyScrollEnable(enable) {
    const body = zuix.$(document.body);
    if (enable === false) body.addClass('noscroll');
    else body.removeClass('noscroll');
}

// increase lazy-load hit area up to
// 300px off the viewport boundaries
// (circa 3 movie items ahead)
//zuix.lazyLoad(true, -500);

// Turn off debug output
window.zuixNoConsoleOutput = true;
