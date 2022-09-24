var helper = {};

function generateGUID(str){
    var d = new Date().getTime();

    var uuid = str.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });

    return uuid;
}

function padZero(v) {
    return ('0' + v).substr(-2);
}

helper.lngStr = null;
helper.lng = function(val) {
    var t;

    //check that val is valid and lang is loaded
    if (/[a-z]+/i.test(val) && helper.lngStr) {
        t = eval('helper.lngStr.' + val);
        return t ? t : '_' + val;

    } else if(!helper.lngStr) {
        return 'langNotLoaded - ' + val;

    } else {
        return 'invalid-' + val;
    }
};

helper.generateDocId = function () {
    return generateGUID('xxxxxxx-xxxxxxx-xxxxxxxx-xxxxxxx');
};

helper.generateUsrDocId = function (uid) {
    var userId = uid ? uid : app.f7.store.state.user.uId;
    return userId + generateGUID(':xxxxxxxxxxxxxxx');
};

helper.generateUserId = function () {
    return generateGUID('xxxxxxxxxxxxxxx');
};

helper.nl2br = function(str) {
    return str ? str.replace(/\n/g, '<br/>') : '';
};

helper.isReceived = function(obj, expire) {
    var cls = '';
    var exp = expire ? expire : app.f7.store.state.settings.expire;

    if(exp) {
        var dateOffset = (24*60*60*1000) * exp; //days
        var myDate = new Date();
        myDate.setTime(myDate.getTime() + dateOffset);
        myDate.setHours(0);
        myDate.setMinutes(0);
        myDate.setSeconds(0);

        if ((obj.d_appointment && new Date(obj.d_appointment) < myDate) ||
            (obj.d_proposal && (!obj.txt && new Date(obj.d_proposal) < myDate))) {

            cls = 'expired';
        }
        //not d_recieve date
    } else if(!obj.d_replicated) {
        cls = 'notReceived';
    }

    return cls;
};

helper.displayMoney = function (v) {
    let s = v.toString();

    if(s.indexOf('.') == -1)
        s += '.00';
    else
        s += '0';

    v = s.substr(0, s.indexOf('.') + 3);

    return v;
};


helper.displayTime = function (v) {
    return v.length == 4 ? '0' + v : v;
};

helper.getMaps = function () {
    var url;

    // if(typeof cordova == 'undefined' || cordova.platformId == 'android')
    url = 'google';
    // else
    //     url = 'apple';

    return 'http://maps.' + url + '.com?q=';
};

helper.toHex = function (str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
};
// helper.isClient = function(uid) {
//     return uid == 'client';
// };
helper.getOffset = function(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop; // - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
};

helper.showDate = function(d) {
    if(!d) return '-';

    d = new Date(d);

    if(d == 'Invalid Date') return helper.lng('errValid.date');

    return padZero(d.getDate()) + '.' + padZero(d.getMonth()+1) + '.' + d.getFullYear();
};

helper.showTime = function(d) {
    if(!d) return '';

    d = new Date(d);

    if(d == 'Invalid Date') return helper.lng('errDate');

    return padZero(d.getHours()) + ':' + padZero(d.getMinutes());
};

helper.showDateTime = function(d) {
    return helper.showDate(d) + ' ' + helper.showTime(d);
};

helper.showDateTimeUntil = function(doc, field) {
    let until = new Date(doc[field]).getTime() + (doc.duration * 60000);
    return helper.showDateTime(doc[field]) + ' - ' + helper.showTime(until);
};

helper.showHalfDay = function(d) {
    return new Date(d).getHours() < 12 ? helper.lng('morning') : helper.lng('afternoon');
};

helper.showHM = function(d) {
    d = d / 60000;
    const m = d % 60;
    const h = Math.floor(d / 60);
    return h + ':' + padZero(m);
};

helper.getDateInfos = function(d) {
    if(!d) return '';

    d = new Date(d);

    if(d == 'Invalid Date') return helper.lng('errDate');

    return {
        day: helper.lng('d_' + d.getDay()),
        date: d.getDate(),
        month: helper.lng('m_' + d.getMonth()),
        time: padZero(d.getHours()) + ":" + padZero(d.getMinutes())
    }
};

helper.showReceived = function(d) {
    return d.origin == 'user' ? '' : '<i class="f7-icons received">' + (d.d_replicated ? 'checkmark' : 'hourglass_tophalf_fill') + '</i>';
};

helper.hasAnswer = function(a) {
    let has = false;

    a.messages.forEach(msg => {
        if (msg.replyYesNo != undefined) { //msg.origin == 'user' &&
            has = true;
        }
    });

    return has;
};

helper.showUserContact = function(doc) {
    return '<span title="' + helper.lng('contact') + ': ' + doc.contact + '"><span class="copyEl">' + doc.userId + '</span> ' + doc.user + '</span>';
};

helper.showUpdatedAt = function(doc) {
    let d = new Date();
    let d2 = new Date(doc.d_updated ? doc.d_updated : doc.d_created);

    if ((d - d2) / (1000 * 3600 * 24 * 365) <= 2) {
        return app.f7.mod.helper.lng('d_updated') + ': ' + helper.showDate(d2);
    } else {
        return '';
    }
};

helper.setConfirmLang = function() {
    let b = app.f7.$('.dialog .dialog-button');
    b[0].innerText = helper.lng('cancel').toUpperCase();
    b[1].innerText = helper.lng('yes').toUpperCase();
};

helper.getAnswer = function(a) {
    let has = false;
    let need = a.needAnswer;

    if(!need) return false;

    a.messages.forEach(msg => {
        if (need != 'yesNo' && need != 'offer' && msg.origin == 'user') {
            has = msg.txt ? msg.txt : app.f7.mod.helper.lng('photo');

        } else if ((need == 'yesNo' || need == 'offer') && msg.replyYesNo != undefined) {
            has = app.f7.mod.helper.lng(msg.replyYesNo === true ? 'yes' : 'no');
        }
    });

    return has ? has : need;
};

helper.getAttach = function(a, i) {
    return '<img src="data:' + a[i].type + ';base64,' + a[i].data + '"/>';
};

helper.debounce = function(func, wait, immediate) {
    var timeout;

    return function () {
        var context = this, args = arguments;

        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

helper.cutText = function(txt) {
    if(txt.length > 250) {
        let pos = txt.substr(250).indexOf(' ');
        return txt.substr(0, 250 + pos) + `... <a href="#" class="more">${helper.lng('more')}</a>`;

    } else
        return txt;
};

export default helper;