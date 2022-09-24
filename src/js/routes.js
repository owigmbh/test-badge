import HomePage from '../pages/app/home.f7';
import NoConPage from '../pages/app/noCon.f7';
import NotFoundPage from '../pages/404.f7';

let routes = [
    {
        path: '/',
        async: function ({router, to, resolve}) {

                // resolve route
                resolve({
                    component: HomePage,
                });

        }
    },
    {
        path: '/noCon/',
        component: NoConPage,
    },

    {
        path: '/noCon/:action',
        async: function ({router, to, resolve}) {
            // loadF7Module(this.app, 'user').then(() => {
            // resolve route
            resolve({
                component: NoConPage,
            });
            // });
        }
    },

    {
        path: '(.*)',
        component: NotFoundPage,
    },
];

export default routes;