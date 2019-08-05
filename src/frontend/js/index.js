import './utils/globals';
import { render } from 'react-dom';
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { reducer as formReducer } from 'redux-form';
import {
    hasURLParameter,
    tidslinjer,
} from '@navikt/digisyfo-npm';
import AppRouter from './routers/AppRouter';
import history from './history';
import fastleger from './reducers/fastleger';
import ledere from './reducers/ledere';
import navbruker from './reducers/navbruker';
import sykmeldinger from './reducers/sykmeldinger';
import arbeidsgiversSykmeldinger from './reducers/arbeidsgiversSykmeldinger';
import moter from './reducers/moter';
import motebehov from './reducers/motebehov';
import motebehovBehandling from './reducers/motebehovBehandling';
import epostinnhold from './reducers/epostinnhold';
import arbeidsgiverEpostinnhold from './reducers/arbeidsgiverEpostinnhold';
import modiacontext from './reducers/modiacontext';
import historikk from './reducers/historikk';
import ledetekster from './reducers/ledetekster';
import sykeforloep from './reducers/sykeforloep';
import sykepengesoknader from './reducers/sykepengesoknader';
import oppfoelgingsdialoger from './reducers/oppfoelgingsdialoger';
import veilederoppgaver from './reducers/veilederoppgaver';
import dokumentinfo from './reducers/dokumentinfo';
import behandlendeEnhet from './reducers/behandlendeEnhet';
import enhet from './reducers/enhet';
import tilgang from './reducers/tilgang';
import virksomhet from './reducers/virksomhet';
import veilederinfo from './reducers/veilederinfo';
import diskresjonskode from './reducers/diskresjonskode';
import egenansatt from './reducers/egenansatt';
import oppfolgingstilfelleperioder from './reducers/oppfolgingstilfelleperioder';
import rootSaga from './sagas/index';
import { hentLedetekster } from './actions/ledetekster_actions';
import { sjekkTilgang } from './actions/tilgang_actions';
import { hentVeilederinfo } from './actions/veilederinfo_actions';
import { hentBehandlendeEnhet } from './actions/behandlendeEnhet_actions';
import { hentVeilederOppgaver } from './actions/veilederoppgaver_actions';
import { hentNavbruker } from './actions/navbruker_actions';
import { hentLedere } from './actions/ledere_actions';
import { pushModiaContext, hentAktivBruker, hentAktivEnhet } from './actions/modiacontext_actions';
import { valgtEnhet } from './actions/enhet_actions';
import { CONTEXT_EVENT_TYPE } from './konstanter';
import soknader from './reducers/soknader';
import { config, contextHolderEventHandlers } from './global';
import '../styles/styles.less';

const rootReducer = combineReducers({
    history,
    fastleger,
    ledere,
    navbruker,
    modiacontext,
    sykeforloep,
    historikk,
    moter,
    motebehov,
    motebehovBehandling,
    virksomhet,
    epostinnhold,
    arbeidsgiverEpostinnhold,
    oppfoelgingsdialoger,
    sykepengesoknader,
    enhet,
    tidslinjer,
    sykmeldinger,
    arbeidsgiversSykmeldinger,
    behandlendeEnhet,
    diskresjonskode,
    dokumentinfo,
    egenansatt,
    veilederoppgaver,
    veilederinfo,
    ledetekster,
    tilgang,
    form: formReducer,
    soknader,
    oppfolgingstilfelleperioder,
});


const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

const fnr = window.location.pathname.split('/')[2];

const fnrRegex = new RegExp('^[0-9]{11}$');
if (fnrRegex.test(fnr)) {
    store.dispatch(hentVeilederinfo());
    store.dispatch(hentBehandlendeEnhet(fnr));
    store.dispatch(hentVeilederOppgaver(fnr));
    store.dispatch(hentNavbruker(fnr));
    store.dispatch(hentLedere(fnr));
    store.dispatch(sjekkTilgang(fnr));
    store.dispatch(hentAktivBruker({
        callback: (aktivBruker) => {
            if (aktivBruker !== fnr) {
                store.dispatch(pushModiaContext({
                    verdi: fnr,
                    eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_BRUKER,
                }));
            }
        },
    }));
}

store.dispatch(hentAktivEnhet({
    callback: (aktivEnhet) => {
        if (aktivEnhet && config.config.initiellEnhet !== aktivEnhet) {
            store.dispatch(valgtEnhet(aktivEnhet));
            config.config.initiellEnhet = aktivEnhet;
            window.renderDecoratorHead(config);
        }
    },
}));
store.dispatch(hentLedetekster());

if (hasURLParameter('visLedetekster')) {
    window.APP_SETTINGS.VIS_LEDETEKSTNOKLER = true;
} else {
    window.APP_SETTINGS.VIS_LEDETEKSTNOKLER = false;
}

render(<Provider store={store}>
    <AppRouter history={history} />
</Provider>, document.getElementById('maincontent'));

document.addEventListener('DOMContentLoaded', () => {
    contextHolderEventHandlers((nyttFnr) => {
        if (nyttFnr !== config.config.fnr) {
            window.location = `/sykefravaer/${nyttFnr}`;
        }
    }, (data) => {
        if (config.config.initiellEnhet !== data) {
            store.dispatch(valgtEnhet(data));
            store.dispatch(pushModiaContext({
                verdi: data,
                eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET,
            }));
            config.config.initiellEnhet = data;
        }
    });
    // eslint-disable-next-line no-unused-expressions
    window.renderDecoratorHead && window.renderDecoratorHead(config);
});

if (window.location.hostname.indexOf('localhost') !== -1) {
    store.dispatch(valgtEnhet('0219'));
}

export {
    store,
    history,
};
