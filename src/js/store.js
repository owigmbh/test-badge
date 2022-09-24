import { createStore } from 'framework7';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import crypto from 'crypto-pouch';
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(crypto);

import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Badge } from '@robingenz/capacitor-badge';

const _databaseClient = 'mycare_rep_';
const _databaseApp = 'mycare_app';
const _databaseUsers = '_users';
// const _databaseAnamnese = 'mycare_anamnese';
const _databaseUsr = 'userdb-';

// const _dbCon = 'http://mycare.owitec.lan';
// const _dbPort = '5984';

// if (process.env.NODE_ENV == 'production') {
//     const _dbCon = 'https://mycare.owitech.ch';
//     const _dbPort = '';
//     const _srvUrl = 'https://mycare-server.owitech.ch';

// } else {
    const _dbCon = 'http://mycare-demo.owitec.ch';
    const _dbPort = ':15984';
    const _srvUrl = 'http://mycare-demo.owitec.ch:18085';
// }
// const _srvUrl = 'http://localhost:8085';
// const _dbPort = '443';

const store = createStore({
    state: {
        user: null,
        dbEncrypted: false,
        auth: null,
        clientId: null,
        settings: null,
        dbApp: null,
        dbClient: null,
        db: null,
        offline: false,
        lastSync: null,
        srvUrl: _srvUrl,
        target: null,
        hasResizedView: false
    },
    getters: {
        getAllowedCancelTime({state}) {
            return new Date(new Date().setHours(new Date().getHours() + state.settings.hoursAllowedCancel + state.settings.confirmCancelAppointment));
        }
    },
    actions: {
        setUser({state}, u) {
            state.user = u;
        },
        setAuth({state}, a) {
            state.auth = a;
        },
        setClientId({state}, cId) {
            state.clientId = cId;
        },
        setSettings({state}, s) {
            state.settings = s;
        },
        goto({state}, t) {
            // this.$router.redirect(t);
            if(app.f7.views.main && app.f7.views.main.router) {
                app.f7.views.main.router.navigate(t, {reloadCurrent:true});

            } else {
                app.f7.router.navigate(t);
            }
        },
        markDirty({}, d) {
            let self = app.f7;

            if (d) {
                self.$('.activeSave').removeClass('disabled').removeAttr('disabled');
                self.$('.editBlock').addClass('disableList');
                self.$('.dataList').addClass('disableList');
                //self.$('#new-link').addClass('disableList');

            } else {
                self.$('.activeSave').addClass('disabled').attr('disabled');
                self.$('.editBlock').removeClass('disableList');
                self.$('.dataList').removeClass('disableList');
                //self.$('#new-link').removeClass('disableList');
            }
        },
        assignMenu({state}, show = true) {
            let self = app.f7;

            //self.$('.item-title.articles').html(self.mod.helper.lng('articles'));
            //self.$('.item-title.notifications').html(self.mod.helper.lng('notifications'));
            //self.$('.item-title.appointments').html(self.mod.helper.lng('appointments'));
            //self.$('.item-title.treatment').html(self.mod.helper.lng('treatment.txt'));
            self.$('.panel-right .item-title.payment span').html(self.mod.helper.lng('payments'));
            self.$('.panel-right .item-title.order span').html(self.mod.helper.lng('orders'));
            self.$('.panel-right .item-title.product span').html(self.mod.helper.lng('products'));
            self.$('.panel-right .item-title.about span').html(self.mod.helper.lng('aboutUs'));
            self.$('.panel-right .item-title.profile span').html(self.mod.helper.lng('profile'));
            self.$('.panel-right .item-title.search span').html(self.mod.helper.lng('search'));
            self.$('.item-title.register span').html(self.mod.helper.lng('register'));

            self.$('.panel-right .item-title.about span').html(self.mod.helper.lng('aboutUs'));
            self.$('.panel-right .item-title.partner span').html(self.mod.helper.lng('partner'));
            self.$('.panel-right .item-title.shop span').html(self.mod.helper.lng('shop'));
            self.$('.panel-right #lnkMap .item-title span').html(self.mod.helper.lng('maps'));
            self.$('.panel-right #lnkOpen .item-title span').html(self.mod.helper.lng('openTimes'));

            self.$('.panel-right .item-title.aboutApp span').html(self.mod.helper.lng('aboutApp'));
            self.$('.panel-right .item-title.privacy span').html(self.mod.helper.lng('privacy'));
            self.$('.panel-right .item-title.legal span').html(self.mod.helper.lng('legal'));
            self.$('.panel-right .item-title.impressum span').html(self.mod.helper.lng('impressum'));

                self.$('.navbar .menu').removeClass('right');
                self.$('.navbar .menu').css('right', null);

                self.$('.navbar .item-link.articles').show();
                self.$('.navbar .item-link.appointments').show();
                self.$('.navbar .item-link.notifications').show();
                self.$('.navbar .item-link.treatment').show();
                // self.$('.item-title.shop').show();
                self.$('.item-title.product').show();
                self.$('.item-title.payment').show();
                self.$('.item-title.order').show();
                self.$('.item-title.partner').show();
                self.$('.item-title.search').show();
                self.$('.item-title.profile').show();
                // self.$('#lnkOpen').show();

                this.setBadges();


            if (state.settings && state.settings.address) {
                self.$('.panel-right #lnkMap').attr('href', self.mod.helper.getMaps() + state.settings.address);
            } else {
                self.$('.panel-right #lnkMap').hide();
            }

            if (state.settings && state.settings.shopUrl) {
                self.$('.panel-right #lnkShop').attr('href', state.settings.shopUrl);

            } else {
                self.$('.panel-right #lnkShop').hide();
            }

            if(state.settings && state.settings.logo) {
                app.f7.$('.navbar.head .treatment').html('<img src="' + state.settings.logo + '"/>');
            }
        },
        setBadges() {
            let self = app.f7;
            let noti = self.$('.navbar .item-link.notifications .cnt');
            let appoint = self.$('.navbar .item-link.appointments .cnt');
            let cntNoti = 1;
            let cntAppoint = 3;
            let promises = [];


                if (cntNoti > 0) {
                    if (noti.length == 0) {
                        self.$('.navbar .item-link.notifications').append('<span class="cnt badge color-red">' + cntNoti + '</span>');
                    }
                } else {
                    noti.remove();
                }

                if (cntAppoint > 0) {
                    if (appoint.length == 0) {
                        self.$('.navbar .item-link.appointments').append('<span class="cnt badge color-red">' + cntAppoint + '</span>');
                    }
                } else {
                    appoint.remove();
                }

                Badge.checkPermissions().then((r) => {
                    if(r.display != 'granted') {
                        Badge.requestPermissions();
                    }
                });

                Badge.set({count: (cntNoti + cntAppoint) });

        },
        intLink({}, lnk) {
            let self = app.f7;
            self.dialog.alert('interner link' + lnk);
        },
        loadLng({}, iso) {
            return new Promise((resolve, reject) => {
                let self = app.f7;

                self.dbApp.get('language-' + iso, function (err, doc) {
                    if (!err) {
                        resolve(doc);

                    } else {
                        reject(err);
                    }
                });
            });
        },
        openAppDbs({state, dispatch}) {
            return new Promise((resolve, reject) => {
                let self = app.f7;
                //maybe: , {adapter: 'websql'}

                //app-db
                self.dbApp = new PouchDB(_databaseApp);

                //set language
                let iso = state.user && state.user.doc && state.user.doc.iso ? state.user.doc.iso
                    : (state.settings && state.settings.language ? state.settings.language
                        : 'de');

                //load lang
                dispatch('loadLng', iso)
                    .then((doc) => {
                        self.mod.helper.lngStr = doc;
                        resolve();
                    })
                    .catch();

                //get app requirements
                self.dbApp.replicate.from(_dbCon + _dbPort + '/' + _databaseApp, {
                    live: false
                })
                    .on('complete', function (res) {
                        console.log('updated app db and language');
                        //reload if updated
                        dispatch('loadLng', iso)
                            .then((doc) => {
                                self.mod.helper.lngStr = doc;
                                resolve();
                            });
                    })
                    .on('error', function (e) {
                        console.log('app db FAILED to replicate');
                        if(e.message == "Failed to fetch") {

                        } else {
                            reject(e);
                        }
                    });
            });
        },
        openUserDbs({state, dispatch}) {
            return new Promise((resolve, reject) => {
                let self = app.f7;


                if (state.user && state.clientId) {
                    //db auth
                    state.auth = {username: state.user.uId, password: state.user.pwd};

                    self.db = new PouchDB(_databaseUsr + self.mod.helper.toHex(state.user.uId));

                    //client db
                    self.dbClient = new PouchDB(_databaseClient + state.clientId);

                    dispatch('doDbEnc')
                        .then(resolve)
                        .catch(reject);

                } else {
                    resolve('noUserData');
                }
            });
        },
        loginUser({state, dispatch}) {
            return new Promise((resolve, reject) => {
                let self = app.f7;

                if (state.user) {
                    let rev;
                    let promises = [];

                    promises.push(self.db.get('org.couchdb.user:' + state.user.uId)
                        .then((doc) => state.user.doc = doc)
                        .catch((ex) => {
                            if(ex.name == "not_found") {
                                console.log('all good: user not replicated yet');

                            } else {
                                console.log(ex);
                            }
                        })
                    );

                    promises.push(self.request({
                            url: _srvUrl + '/login',
                            method: 'GET',
                            data: {
                                cId: state.clientId,
                                uId: state.user.uId,
                                pwd: state.user.pwd
                            },
                            cache: false,
                            timeout: 20000,
                            // dataType: 'application/json',
                            crossDomain: true,
                            // contentType: 'application/json',
                            processData: true,
                            success: (res) => {
                                rev = JSON.parse(res);
                            },
                            error: (ex) => {
                                //server offline
                                if (ex.status === 0) {
                                    state.offline = true;
                                    resolve('offline');

                                } else {
                                    reject(ex);
                                }
                            }
                        })
                    );

                    Promise.allSettled(promises)
                        .then((res) => {
                            if (res[1].status != 'rejected' && (!state.user.doc || state.user.doc.userRev != rev)) {
                                //todo remove all client-data of client from app because user isnt with client anymore, but keep clientName for history of entries in userDb

                                self.request({
                                    url: _srvUrl + '/getUsrDoc',
                                    method: 'GET',
                                    data: {
                                        uId: state.user.uId,
                                        pwd: state.user.pwd
                                    },
                                    cache: false,
                                    timeout: 20000,
                                    // dataType: 'application/json',
                                    crossDomain: true,
                                    // contentType: 'application/json',
                                    processData: true,
                                    success: (doc) => {
                                        let oldRev = state.user.doc ? state.user.doc._rev : null;
                                        state.user.doc = JSON.parse(doc);

                                        //swap rev
                                        state.user.doc.userRev = state.user.doc._rev;

                                        if(oldRev) {
                                            state.user.doc._rev = oldRev;

                                        //first login
                                        } else {
                                            delete state.user.doc._rev;
                                        }

                                        delete state.user.doc.salt;
                                        delete state.user.doc.password_scheme;
                                        delete state.user.doc.derived_key;
                                        delete state.user.doc.iterations;

                                        self.db.put(state.user.doc)
                                            .then((doc) => {
                                                state.user.doc._rev = doc.rev;

                                                // dispatch('replicate', true)
                                                // console.log(state.user.doc)
                                            })
                                            .catch(console.log);

                                        let active = state.user.doc.roles[0].split('-');

                                        state.clientId = parseInt(active[1]);
                                        window.localStorage.setItem('clientId', state.clientId);

                                        resolve('login & get');
                                    },
                                    error: reject
                                });

                            } else if (res[1].status != 'rejected' && state.user.doc) {
                                let active = state.user.doc.roles[0].split('-');

                                //v1 choose which client you use
                                // res.roles.forEach(function (r) {
                                //     let tmp = r.split('-');
                                //
                                //     if (tmp[0] == users._writer) {
                                //         active.push(tmp[1]);
                                //     }
                                //
                                //     if (tmp[0] == users._client) {
                                //         active.push(tmp[1]);
                                //     }
                                // });

                                //set client db
                                state.clientId = parseInt(active[1]);
                                window.localStorage.setItem('clientId', state.clientId);

                                resolve('login');
                            } else {
                                // resolve('guestLogin');
                                reject(res[1].reason);
                            }
                        });
                }
            });
        },
        loginSuccess({state, dispatch}) {
            return new Promise((resolve, reject) => {
                let self = app.f7;

                state.offline = state.offline ? state.offline : (self.device.capacitor && self.device.android && (!navigator || navigator.connection.type === 'none'));

                document.addEventListener('online', function () {
                    state.offline = false;
                    self.$('.navbar .offline').removeClass('isOffline');

                }, false);

                document.addEventListener('offline', function () {
                    state.offline = true;
                    self.$('.navbar .offline').addClass('isOffline');

                }, false);

                //if online connect
                if (state.offline === false) {

                    dispatch('replicate')
                        .then(() => {
                            if (!state.settings) {
                                self.mod.settings.get()
                                    .then((rs) => {
                                        state.settings = rs;
                                        resolve();
                                    })
                                    .catch(reject);
                            } else {
                                resolve();
                            }
                        })
                        .catch(reject);

                } else {
                    self.mod.settings.get()
                        .then((rs) => {
                            state.settings = rs;
                            resolve();
                        })
                        .catch(reject)
                }
            });
        },
        setup({state}) {
            return new Promise((resolve, reject) => {
                let self = app.f7;

                let idx = {
                    'index': {
                        'fields': ['archive', 'clientId', 'type']
                    },
                    'ddoc': 'appoint',
                    'name': 'idx-app.appointment',
                    'type': 'json'
                };

                let idxPay = {
                    'index': {
                        'fields': ['status', 'payNr', 'total', 'd_created']
                    },
                    'ddoc': 'payment',
                    'name': 'idx-app.payment',
                    'type': 'json'
                };
                // app.f7.db.getIndexes(function (err:any, indexesResult:any) {
                //     if (err) {
                //         return console.log(err);
                //     } else {
                //         return console.log(indexesResult);
                //     }

                // app.f7.db.deleteIndex(indexesResult.indexes[1], function (err, result) {
                //     if (err) {
                //         return console.log(err);
                //     }
                //     // handle result
                //     console.log(result);
                // });
                // });

                self.db.createIndex(idx, function (err) {
                    if (err) {
                        reject(err);
                    }
                    // handle result
                    // console.log(result);
                });

                self.db.createIndex(idxPay, function (err) {
                    if (err) {
                        reject(err);
                    }
                    // handle result
                    // console.log(result);
                });

                resolve();
            });
        },
        replicate({state, dispatch}, upload) {
            return new Promise((resolve, reject) => {
                let self = app.f7;
                let promises = [];
                //set sync 24h timer
                state.lastSync = window.localStorage.getItem('lastSync');

                //maybe: need to do it regularly, where shall i trigger it???
                //only sync every 24h
                // if (upload || (state.lastSync && state.lastSync >= new Date(new Date().getTime() - (3600000 * 24)))) {

                //replicate client db to local
                //     new Promise(res => {
                let rep = self.dbClient.replicate.from(_dbCon + _dbPort + '/' + _databaseClient + state.clientId, {
                    live: false,
                    auth: state.auth
                })
                    .on('complete', function () {
                        console.log('complete dbC');
                        // res();
                    })
                    .on('error', function (e) {
                        dispatch('catchDb', e);
                        // res(false);
                    });
                //     })
                // );
                if(!upload) {
                    promises.push(rep);
                }

                //replicate userDB
                promises.push(
                    new Promise(res => {
                        // let doReplication = false;

                        self.db.sync(_dbCon + _dbPort + '/' + _databaseUsr + self.mod.helper.toHex(state.user.uId), {
                            live: false,
                            auth: state.auth,
                            filter(doc) {
                                return doc.type;
                            }
                        })
                            .on('complete', function () {
                                console.log('complete userDb');

                                // conflict: maybe
                                // if(doReplication && !upload) {
                                // setTimeout(() => {
                                //     ref.replicate({state}, true);
                                // }, 5000);
                                // }

                                res();
                            })
                            .on('change', function (e) {
                                //set d_replicated if recieve
                                if (e.direction == 'pull') {
                                    for (let x in e.change.docs) {
                                        // let id = e.change.docs[x]._id;
                                        let doc = e.change.docs[x];

                                        switch (doc.type) {
                                            case 'notification':
                                            case 'appointment':

                                                if ((doc.d_replicated && doc.d_replicated < doc.d_updated) ||
                                                    (!doc.d_replicated && doc.messages && !doc.messages[doc.messages.length - 1].d_replicated)) {
                                                    //server call
                                                    app.f7.request({
                                                        url: state.srvUrl + '/usrReplicated',
                                                        method: 'GET',
                                                        data: {
                                                            uId: state.user.uId,
                                                            pwd: state.user.pwd,
                                                            id: doc._id
                                                        },
                                                        cache: false,
                                                        // dataType: 'application/json',
                                                        crossDomain: true,
                                                        // contentType: 'application/json',
                                                        processData: true,
                                                        success: (res) => {
                                                            console.log(res);
                                                        },
                                                        error: console.log
                                                    });
                                                }

                                                break;

                                            //todo if article && archive then delete it to save space
                                        }
                                    }
                                }
                                /*else if (e.direction == 'push') {
                                 e.change.docs.forEach((doc) => {
                                 let isDirty = false;

                                 switch (doc.type) {
                                 // case 'notification':
                                 //     doc.d_replicated = new Date().toISOString();
                                 //     isDirty = true;
                                 //     break;

                                 case 'appointment':
                                 //if sending from app data to server
                                 if (doc.proposals) {
                                 doc.proposals.forEach((p) => {
                                 //from app & not replicated yet
                                 if (p.origin == 'user' && !p.d_replicated) {
                                 p.d_replicated = new Date().toISOString();
                                 }
                                 });

                                 }

                                 doc.d_replicated = new Date().toISOString();
                                 isDirty = true;

                                 break;

                                 default:
                                 //nothing
                                 }

                                 //save doc
                                 if(isDirty) {
                                 self.db.put(doc);
                                 // creates loop and might be better on server:
                                 //doReplication = true;
                                 }
                                 });
                                 }*/
                            })
                            .on('error', function (e) {
                                // console.error('err db sync');
                                state.offline = true;
                                // console.error(e);
                                dispatch('catchDb', e);
                                res(false);
                            });
                    })
                );

                //replicate app but doesnt have to wait for it
                if (!window.localStorage.getItem('lastSync')) {
                    promises.push(dispatch('setup'));
                }

                //keep last sync
                state.lastSync = new Date().toISOString();
                window.localStorage.setItem('lastSync', state.lastSync);

                Promise.all(promises)
                    .then(() => {
                        self.preloader.hide();
                        resolve();
                    })
                    .catch(reject);
            });
        },
        getUser({state}) {
            return new Promise((resolve, reject) => {
                let promises = [];

                if (!state.user) {
                    state.user = {};

                    state.clientId = window.localStorage.getItem('clientId');

                    //saved login
                    if (state.clientId) {
                        //get usr & pwd
                        promises.push(this.getEncPass('uId')
                            .then(res => state.user.uId = res.value)
                            .catch(res => { state.user = null; })
                        );

                        promises.push(this.getEncPass('pwd')
                            .then(res => state.user.pwd = res.value)
                            .catch(res => { state.user = null; })
                        );

                    } else {
                        state.user = null;
                    }
                }

                Promise.all(promises).then(() => {
                    resolve()
                });
            });
        },
        init({state, dispatch}) {
            return new Promise((resolve, reject) => {
                let self = app.f7;
                let err;
                state.appOpening = true;

                self.preloader.show();

                dispatch('getUser')
                    .then(() => {
                        dispatch('openAppDbs')
                            .then(() => {
                                dispatch('openUserDbs')
                                    .then(() => {
                                        if (state.user && !state.user.noCon) {
                                            dispatch('loginUser')
                                                .then(() => {
                                                    dispatch('loginSuccess')
                                                        .then(() => {
                                                            let uri;

                                                            //goto link
                                                            if (state.target) { //self.view.current.router.currentRoute.params.id
                                                                uri = state.target;
                                                                state.target = null;

                                                                //tablet
                                                            } else if (self.mod.user.isServicedesk(state.user.doc)) {
                                                                uri = '/noCon/';

                                                                //home
                                                            } else {
                                                                uri = '/';
                                                                // uri = '/list-appointments/';
                                                                // uri = '/list-notifications/';
                                                                // uri = '/list-products/';
                                                                // uri = '/list-partners/';
                                                                // uri = '/usr-settings/';
                                                            }

                                                            //query notis and appointments
                                                            dispatch('localNotiQuery');

                                                            if (!self.views.current) {
                                                                self.views.create('.view-main', {
                                                                    url: uri
                                                                });

                                                            } else {
                                                                self.views.main.router.navigate(uri);
                                                            }

                                                            dispatch('assignMenu', true);

                                                            self.preloader.hide();

                                                            resolve();
                                                        })
                                                        .catch(reject);

                                                })
                                                .catch((ex) => {
                                                    console.log('login failed');

                                                    self.dialog.alert(
                                                        self.mod.helper.lng('errLogin') + (ex && ex.status != 401 ? '<br>' + ex : ''),
                                                        self.mod.helper.lng('error')
                                                    );

                                                    dispatch('noCon', ex);

                                                    reject();

                                                    // state.user = {
                                                    //     uId: state.user.uId,
                                                    //     // doc: {fcmId: state.user.doc.fcmId, apnsId: state.user.doc.apnsId},
                                                    //     noCon: true
                                                    // };
                                                });

                                        } else if (!state.user) {
                                            dispatch('noCon');
                                            resolve();

                                        } else {
                                            reject('noValidPath');
                                        }
                                    })
                            })
                            .catch((ex) => {
                                //db connection failed
                                if (state.user) {
                                    state.offline = true;

                                    //query notis and appointments
                                    dispatch('localNotiQuery');

                                    let uri = '/';
                                    if (!self.views.current) {
                                        self.views.create('.view-main', {
                                            url: uri
                                        });

                                    } else {
                                        self.views.main.router.navigate(uri);
                                    }

                                    dispatch('assignMenu', true);

                                    self.preloader.hide();
                                    resolve();

                                    self.dialog.alert(self.mod.helper.lng('offline'));

                                } else {
                                    //todo what when no login and no internet -> goto noCon
                                    // reject('noUser')
                                    reject(ex);
                                }

                                console.log(ex);
                            });
                    });
            });
        },
        noCon({state, dispatch}, ex) {
            let self = app.f7;
            let uri = '/noCon/';

            if (state.user && !state.user.noCon && !state.settings) {
                self.mod.settings.get()
                    .then((rs) => {
                        state.settings = rs;
                    });
            }

            if (!self.views.current) {
                self.views.create('.view-main', {
                    url: uri
                });

            } else {
                self.views.main.router.navigate(uri);
            }

            self.preloader.hide();

            if (ex) {
                //self.$('.error').html(ex);
                console.log(ex);
            }

            dispatch('assignMenu', false);
        },
        catchDb({state, dispatch}, ex) {
            let self = app.f7;
            let errs = [];
            let err;

            if (self.preloader) self.preloader.hide();

            //todo app or server offline
            if(ex && ex.message == "Load failed") {
                self.dialog.alert(self.mod.helper.lng('err.noServer'));

                //server request or validation
            } else if (ex instanceof XMLHttpRequest) {
                let status = ex.status;
                let response = JSON.parse(ex.responseText);

                //validation
                if (status == 501 && response._id) {
                    ex = response;

                    //server error
                } else if (status == 500 && !response.error) {
                    ex = {error: 'dontKnow', message: response};

                    //unkown error
                } else {
                    ex = response;
                }
            //todo proper error-object
            } else if (typeof ex == 'string') {
                err = ex;

            } else if (ex && ex.error) {
                switch (ex.error) {
                    case 'alreadyRated':
                        err = self.mod.helper.lng('alreadyRated');
                        break;

                    case 'conflict':
                        err = self.mod.helper.lng('errConflict');
                        // dispatch('replicate', true);
                        //reload page
                        // self.views.main.router.navigate(self.view.current.history[self.view.current.history.length - 1]);
                        break;

                    case 'anamnese':
                        err = self.mod.helper.lng(ex.message);
                        break;

                    default:
                        err = 'ACHTUNG bitte scrennshot machen und and andy senden mit Beschrieb von den letzten 2 aktionen die du gemacht hast: ' +
                            (ex.reason ? ex.reason : '') +
                            (ex.error ? ex.error : '') +
                            (ex.message ? ex.message : '');
                }
            }

            if(err) {
                //todo show error
                self.dialog.alert(err);

            } else {
                console.log(ex);
            }


        },
        clearErrors() {
            let self = app.f7;
            self.$('.page-current .item-inner').removeClass('invalid');
            self.$('.page-current .errorMsg').remove();
        },

        /**
         * render notification in app and add actions
         * @param passState
         * @param title
         * @param body
         * @param target
         * @param bg
         * @param action
         */
        displayNotis({state, dispatch}, { title, body, target, bg = false, action = null }) {
            let self = app.f7;

            //console.log("Notification message received");
            //from bg
            //in fg
            //display popup
            //on same page

            //when app is closed
            if (bg && !action) {
                //if app not startet and has not loaded view yet
                if(!app.f7.views.main) {
                    state.target = target;

                    //click event of noti
                } else {
                    dispatch('goto', target);
                }

                if (!target.startsWith('/notification')) {
                    setTimeout(() => {
                        let id = target.split('/')[2];
                        self.emit('refreshAppoint', id);
                    }, 700);
                }

                //when app open
            } else if (!action) {
                //show message
                self.dialog.create({
                    text: body,
                    title: title,
                    buttons: [
                        {
                            text: self.mod.helper.lng('stay'),
                            onClick: function (o, i) {
                                o.close();
                            }
                        },
                        {
                            text: self.mod.helper.lng('goto'),
                            onClick: function (o, i) {
                                //goto link
                                if (!target.startsWith('/notification')) {
                                    dispatch('goto', target);
                                    let id = target.split('/')[2];
                                    self.emit('refreshAppoint', id);

                                } else {
                                    dispatch('goto', target); //self.emit('refreshNoti', id);

                                }
                            }
                        }
                    ]
                })
                    .open();

                //ios because LOCAL-NOTI trigger doesnt work
            } else if (action) {
                //show message
                self.dialog.create({
                    text: body,
                    title: title,
                    buttons: [
                        {
                            text: self.mod.helper.lng('stay'),
                            onClick: function (o, i) {
                                o.close();
                            }
                        },
                        {
                            text: self.mod.helper.lng('no'),
                            onClick: (v) => this.cancelAppointment(action._id)
                        },
                        {
                            text: self.mod.helper.lng('yes'),
                            onClick: (v) => {
                                if (action && action.type == 'accept') {
                                    this.acceptAppointment(action._id);

                                } else {
                                    this.confirmAppoitnment({id: action._id, type: action.type});
                                }
                            }
                        }
                    ]
                })
                    .open();

                self.$('.dialog-no-buttons').on('click', function () {
                    self.dialog.close();
                });
            }

            // if (message.tap) {
            //     console.log("Tapped in " + message.tap);
            // }
        },
        initPush: async function ({state, dispatch}) {
            let self = app.f7;

            let permStatus = await PushNotifications.checkPermissions();

            if (permStatus.receive === 'prompt') {
                permStatus = await PushNotifications.requestPermissions();
            }

            if (permStatus.receive !== 'granted') {
                let txt = self.mod.helper.lng('permReq.usrDeclined');
                throw new Error(txt);
            }

            await PushNotifications.addListener('registration', token => {
                console.info('Registration token: ', token.value);

                let deviceType, diffToken;

                if(self.device.ios === true) {
                    deviceType = 'apnsId';
                    diffToken = 'fcmId';

                } else {
                    deviceType = 'fcmId';
                    diffToken = 'apnsId';
                }

                // data.registrationId
                if (state.user && state.user.doc && (!state.user.doc[deviceType] || state.user.doc[deviceType] != token.value)) {
                    state.user.doc[deviceType] = token.value;
                    delete state.user.doc[diffToken];
                    state.user.doc.device = self.device.os + ' ' + self.device.osVersion;

                    self.mod.user.saveApp(state.user.doc)
                        .then(function (res) {
                            state.user.doc = res;
                            // window.localStorage.setItem('login', JSON.stringify(state.user));
                        })
                        .catch(ex => dispatch('catchDb', ex));
                }
            });

            await PushNotifications.addListener('registrationError', err => {
                console.error('Registration error: ', err.error);
            });

            await PushNotifications.addListener('pushNotificationReceived', notification => {
                console.log('Push notification received: ', notification);

                let tit, msg, action, data;

                dispatch('replicate', true)
                    .then(() => {

                        //arrives in different format
                        if (self.device.ios) {
                            //ios triggers local notis here
                            // if (!notification.title) {
                            //     data = notification.data;
                            //     tit = notification.title;
                            //     msg = notification.body;
                            //
                            //     //local notis not just push come here as well in ios
                            //     // data.target = (JSON.parse(data.data)).target;
                            //
                            // } else {
                            tit = notification.title;
                            msg = notification.body;
                            data = notification.data;
                            // }
                        } else {
                            tit = notification.data.title;
                            msg = notification.data.body;
                            data = notification.data;
                        }

                        if (data.actions && data.actions != '') {
                            //action like accept new appointment                     or  ios local noti data
                            let tmp = typeof data.actions == 'object' ? data.actions : JSON.parse(notification.data);
                            action = {_id: tmp._id, type: tmp.type};
                        }

                        let cnt = 0;
                        let promises = [];

                        //get counters
                        promises.push(self.mod.notification.getUnreadCnt()
                            .then((res) => {
                                cnt += res;
                            }));

                        promises.push(self.mod.appointment.getUnreadCnt()
                            .then((res) => {
                                cnt += res;
                            }));

                        Promise.all(promises).then(() => {
                            dispatch('displayNotis', {
                                title: tit,
                                body: msg,
                                target: data.target,
                                bg: (self.device.ios ? false : !data.notification_foreground),
                                action: action
                            });
                        });
                    })
                    .catch((e) => dispatch('catchDb', e));
            });

            await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
                console.log('Push notification action performed', notification.actionId, notification.inputValue);

                if(notification.actionId == 'tap') {
                    self.preloader.show();

                    dispatch('replicate', true)
                        .then(() => {
                            self.preloader.hide();

                            dispatch('goto', notification.notification.data.target);
                        });
                }
            });

            await PushNotifications.register();
        },
        acceptAppointment(id) {
            app.f7.mod.appointment.acceptAppointment(id)
                .catch(ex => store.dispatch('catchDb', ex));
        },
        confirmAppoitnment(params) {
            app.f7.mod.appointment.confirm(params.id, params.type, 'yes')
                .catch(ex => store.dispatch('catchDb', ex));
        },
        cancelAppointment(id) {
            let self = app.f7;
            self.views.main.router.navigate('/list-appointments/');
            setTimeout(() => {
                self.emit('deleteConfirm', id);     // self.mod.appointment.confirm(noti.data._id, noti.data.type, 'no');
            }, 700);
        },
        cancel(noti) {
            // console.log('CANCEL');
            // console.log(noti);
            // console.log(eopts);

            if(noti.title == app.f7.mod.helper.lng('local.cancelTit')) {
                let tmp = noti.text.substr(noti.text.indexOf('\n')+1, 10);
                document.cookie = 'seen-' + noti.data._id + '=1; expires=' + new Date(tmp) + '; path=/';
            }

        },

    }
});
export default store;
