import $ from 'dom7';
import Framework7, { getDevice } from './f7-custom.app.js';

// Import Icons and App Custom Styles
import '../css/icons.css';
// Import custom Styles
import '../css/f7-custom.app.less';
import '../css/app.less';

// Import Capacitor APIs
import capacitorApp from './capacitor-app.js';
// Import Routes
import routes from './routes.js';
// Import Store
import store from './store.js';

// Import main app component
import App from '../pages/app.f7';

import helper from './helper.utils.js';
// import validator from './validator.ts';

// import { defineCustomElements } from '@ionic/pwa-elements/loader';

var device = getDevice();

var app = new Framework7({
    name: 'DentaLink', // App name
    theme: 'auto', // Automatic theme detection
    el: '#app', // App root element
    component: App, // App main component
    id: 'ch.owitec.dentalink.app', // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,

    // Input settings
    input: {
        scrollIntoViewOnFocus: device.capacitor,
        scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    on: {
        init: function () {
            var f7 = this;

            f7.$('.page, .navbar.head').show();
            f7.preloader.show();

            //load modules
            f7.mod = {
                helper: helper
            // validator: validator
            };

            if (f7.device.capacitor) {
                // Init capacitor APIs (see capacitor-app.js)
                capacitorApp.init(f7);
            }

            store.dispatch('init')
                .then(() => {
                    if (f7.device.capacitor) {
                        store.dispatch('initPush');
                    }
                })
                .catch(ex => store.dispatch('catchDB', ex));
        },
        // pageAfterIn: function() {
        //     defineCustomElements(window);
        // }
    },
});