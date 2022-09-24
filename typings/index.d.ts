declare const app: any;

interface record {
    _id: string;
    _rev?: string;
    type: string;
    d_created: string;
    d_updated?: string;
    updated_by?: string;
}

interface recordUser extends record {
    clientId: number;
}

interface article extends record {
    title: string;
    txt: string;
    productLinks?: string[];
    titlePic?: string;
    avgRating?: number;
    cnt?: number;
    translations?: object[];
    archive?: boolean;
    templateRef?: {};
    quickSelect?: boolean;
    titleCode?: string;
    warningMsg?: string;
    warningMerge?: boolean;
    duration?: number;
    pos?: number;
    bookingPlace: string;
}

interface template extends record {
    title: string;
    txt: string;
    titlePic?: string;
    description: string;
    translations?: object[];
    buy?: number;
}

interface product extends record {
    title: string;
    txt: string;
    // target: string;
    price: string;
    web?: string;
    titlePic?: string;
}

interface partner extends record {
    name: string;
    zip: string;
    street: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    web: string;
    offering?: string;
    openTimes?: string;
    pic?: string;
    pos?: number;
}

interface timestamp extends record {
    stamps: any[];
    total: any;
}

interface user extends record {
    password?: string;
    password_scheme?: string;
    iterations?: number;
    salt?: string;
    derived_key?: string;
    name: string;
    firstname: string;
    surname: string;
    street: string;
    zip: string;
    city: string;
    country: string;
    email?: string;
    phone?: string;
    gender: string;
    birthday: string;
    fields?: any[];
    roles?: string[];
    articles?: string[];
    iso?: string;
    source: string;
    status?: string;
    importer?: any;
    bring?: string;
    pi?: string;
    gi?: string;
    encrypt?: boolean;
    hasApp?: boolean;
    allAgb?: string;
    fcmId?: string;
    apnsId?: string;
    device?: string;
    format: string;
    alarm?: number;
    delivery?: string;
    token?: string;
    tokenExpiration?: string;
    _attachments?: any;
    rated?: string[];
    userRev?: string;
    pensum?: any;
}
/*
interface user_ext {
    profession: string;
    employer: string;
    ahvNr: string;
    abroad_street: string;
    abroad_zip: string;
    abroad_city: string;
    abroad_country: string;
    invoice_pay: string;
    invoice_insurance: string;
    insurance: string;
    social_services: string;
    general_practitioner: string;
    previous_doctor: string;
    howLearned: string;
    reasonVisit: string;
    med_history: any;
    clAgbs?: string;
}
*/
interface message {
    origin: string;
    txt?: string;
    replyYesNo?: boolean;
    d_created: string;
    d_replicated?: string;
    d_seen?: string;
    pics?: string[];
    tmpPics?: any;
}

interface notification extends recordUser {
    messages: message[];
    status: string;
    params?: object;
    needAnswer?: string;
    d_needAnswer?: string;
    replyYesNo?: boolean;
    _attachments?: any;
    d_replicated?: string;
    d_lastOpened?: string;
}

interface order extends recordUser {
    refId: string;
    amount: number;
    delivery: string;
    status: string;
}

interface promotion extends record {
    refId: string;
    title?: string;
    titleOverride?: string;
    target: string;
    d_start?: string;
    d_end?: string;
    recipients?: any[];
    author: string;
    visum?: string;
    d_sent?: string;
    status?: string;
    archive?: boolean;
}

interface proposal {
    origin: string;
    d_proposal: string;
    d_created: string;
    d_replicated?: string;
    txt?: string;
    status: string;
}

interface appointment extends recordUser {
    title: string;
    titleCode?: string;
    duration?: number;
    proposals: proposal[];
    d_appointment?: string;
    d_replicated?: string;
    d_userCancel?: string;
    cancelled?: string;
    hasOnlyRejects?: boolean;
    archive?: boolean;
    reasonArchive?: string;
    d_accept?: string;
    d_confirm_hour?: string;
    d_confirm_cancel?: string;
    importId?: string;
    d_imported?: string;
    showImportId?: string;
}

interface media extends record {
    refId: string;
    name: string;
    date: string;
    size: number;
    mime: string;
    data: string;
}

interface payment extends recordUser {
    importId: string;
    showImportId: string;
    d_imported?: string;
    amount: number;
    total: number;
    payNr: string;
    status: number;
    requestId?: string;
    transactionId?: string;
    d_replicated?: string;
    d_reminder1?: string;
    d_reminder2?: string;
}

interface treatment extends recordUser {
    title: string;
    txt: string;
    d_deleted?: string;
    reminders?: any[];
    status?: string;
    d_replicated?: string;
}

interface holiday {
    d_start: string;
    d_end: string;
    partner: string;
}

interface phoneNumbrer {
    title: string,
    txt: string
}

interface setting extends record {
    logo: string;
    title: string;
    language: string;
    hoursAllowedCancel: number;
    expire: number;
    bankInfo: string;
    emailStat: string;
    openings: any[];
    phone: string;
    www?: string;
    shopUrl?: string;
    address?: string;
    importerUrl?: string;
    confirmCancelAppointment: number;
    confirmHourAppointment: number;
    holidays?: holiday[];
    langs: any[];
    phoneEmergency?: phoneNumbrer[];
    timeModActive?: boolean;
    yearFrom?: string;
    yearTo?: string;
    defaultDayHours?: number;
    payReminder1?: number;
    payReminder2?: number;
}

interface rating {
    uId: string
    rating: number;
    d_created: string;
}

interface tipsTricks extends record {
    title: string;
    txt: string;
    category: string;
    archive?: boolean;
}

interface payGateway extends record {
    apiUrl: string;
    kundennummer: number;
    terminId: number;
    nutzername: string;
    passwort: string;
}

interface importStatus {
    id: string;
    showImportId: string;
    txt?: string;
    fields: string[];
    conflict?: string[];
}

interface invalid {
    errorMessage: string;
}

interface errInput {
    field: string;
    txt: string;
}

// export { importDriver } from '../importer/importer.class'