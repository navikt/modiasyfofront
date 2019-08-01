import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import { CONTEXT_EVENT_TYPE } from '../konstanter';
import {
    hentAktivBruker,
    hentAktivEnhet,
} from '../actions/modiacontext_actions';
import { valgtEnhet } from '../actions/enhet_actions';
import { hentVeilederinfo } from '../actions/veilederinfo_actions';
import { opprettWebsocketConnection } from './contextHolder';
import ModalWrapper, { } from 'nav-frontend-modal';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';

const oppdaterAktivBruker = (nyttFnr) => {
    window.location.href = `/sykefravaer/${fnr}`;
};

const oppdaterAktivEnhet = (actions, nyEnhet) => {
    const config = require('../index').config;
    actions.valgtEnhet(nyEnhet);
    config.config.initiellEnhet = nyEnhet;
    window.renderDecoratorHead(config);
};

const opprettWSConnection = (veilederinfo, wsCallback) => {
    const ident = veilederinfo.data.ident;
    opprettWebsocketConnection(ident, wsCallback);
};

const tekster = {
    endretBrukerModal: {
        header: 'Du har endret bruker',
        beskrivelse: 'Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig.\nVelger du å endre bruker mister du arbeidet du ikke har lagret.',
        beholdKnapp: 'Behold gammel',
        byttKnapp: 'Bytt til ny bruker',
    },
    endretEnhetModal: {
        header: 'Du har endret enhet',
        beskrivelse: 'Du har endret enhet i et annet vindu. Du kan ikke jobbe med 2 enheter samtidig.\nVelger du å endre enhet mister du arbeidet du ikke har lagret.',
        beholdKnapp: 'Behold gammel',
        byttKnapp: 'Bytt til ny enhet',
    },
};

const endretSideModal = (visModal, endretType, nyttFnrEllerEnhet, byttTilNyClickHandler, beholdGammelClickHandler) => {
    const modalTekster = endretType === 'bruker' ? tekster.endretBrukerModal : tekster.endretEnhetModal;
    return (
        <ModalWrapper
            className="contextContainer__modal"
            closeButton={false}
            isOpen={visModal}>
            <div style={{ maxWidth: '640px' }}>
                <h2>{modalTekster.header}</h2>
                <p>{modalTekster.beskrivelse}</p>
                <p>Ønsker du å bytte til <strong>{nyttFnrEllerEnhet}</strong></p>
                <div className="contextContainer__modal--knapper">
                    <Hovedknapp
                        onClick={() => {
                            byttTilNyClickHandler();
                        }}>
                        {modalTekster.byttKnapp}
                        </Hovedknapp>
                    <Flatknapp
                        onClick={() => {
                            beholdGammelClickHandler();
                        }}>
                        {modalTekster.beholdKnapp}
                    </Flatknapp>
                </div>
            </div>
        </ModalWrapper>
    );
};

export class Context extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visEndretBrukerModal: true,
            visEndretEnhetModal: false,
            nyttFnr: null,
            nyEnhet: null,
        };
        this.onByttBrukerClicked = this.onByttBrukerClicked.bind(this);
        this.onByttEnhetClicked = this.onByttEnhetClicked.bind(this);
        this.beholdGammelBrukerClicked = this.beholdGammelBrukerClicked.bind(this);
        this.beholdGammelEnhetClicked = this.beholdGammelEnhetClicked.bind(this);
        this.skjulEndreModal = this.skjulEndreModal.bind(this);
    }

    componentDidMount() {
        const {
            actions,
            skalHenteVeilederinfo,
        } = this.props;
        if (skalHenteVeilederinfo) {
            actions.hentVeilederinfo();
        }
    }
    componentWillReceiveProps(nextProps) {
        const {
            actions,
            veilederinfo,
        } = this.props;

        if (!veilederinfo.hentet && nextProps.veilederinfo.hentet) {
            // todo refaktorer dennne?
            opprettWSConnection(nextProps.veilederinfo, (wsCallback) => {
                if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_BRUKER) {
                    actions.hentAktivBruker({
                        callback: (aktivBruker) => {
                            this.visEndretBrukerModal(aktivBruker);
                        },
                    });
                } else if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET) {
                    actions.hentAktivEnhet({
                        callback: (aktivEnhet) => {
                            this.visEndretEnhetModal(aktivEnhet);
                        },
                    });
                }
            });
        }
    }

    onByttBrukerClicked() {
        oppdaterAktivBruker(this.state.nyttFnr);
    }

    onByttEnhetClicked() {
        oppdaterAktivEnhet(this.props.actions, this.state.nyEnhet);
        this.skjulEndreModal();
    }

    skjulEndreModal() {
        this.setState({
            visEndretBrukerModal: false,
            visEndretEnhetModal: false,
            nyEnhet: null,
            nyttFnr: null,
        });
    }

    visEndretBrukerModal(nyttFnr) {
        const config = require('../index').config;
        const gammeltFnr = config.config.fnr;
        if (nyttFnr && gammeltFnr !== nyttFnr) {
            this.setState({
                visEndretBrukerModal: true,
                nyttFnr,
                gammeltFnr,
            });
        }
    }

    visEndretEnhetModal(nyEnhet) {
        const config = require('../index').config;
        const gammelEnhet = config.config.initiellEnhet;
        if (nyEnhet && gammelEnhet !== nyEnhet) {
            this.setState({
                visEndretBrukerModal: false,
                visEndretEnhetModal: true,
                nyEnhet,
                gammelEnhet,
            });
        }
    }

    beholdGammelEnhetClicked() {
        this.skjulEndreModal();
        // todo
        // oppdater context holder med gammel enhet slik at det trigges i andre faner også.
    }

    beholdGammelBrukerClicked() {
        this.skjulEndreModal();
        // todo
        // oppdater context holder med gammelt fnr slik at det trigges i andre faner også.
    }

    render() {
        const {
            veilederinfo,
        } = this.props;

        const {
            visEndretBrukerModal,
            visEndretEnhetModal,
            nyttFnr,
            nyEnhet,
        } = this.state;
        return (<div className="contextContainer">
            {endretSideModal(visEndretBrukerModal, 'bruker', nyttFnr, this.onByttBrukerClicked, this.beholdGammelBrukerClicked)}
            {endretSideModal(visEndretEnhetModal, 'enhet', nyEnhet, this.onByttEnhetClicked, this.beholdGammelEnhetClicked)}
            {veilederinfo.hentingFeilet &&
                <AlertStripe
                    className="contextContainer__alertstripe"
                    type="advarsel">
                    <div dangerouslySetInnerHTML={{ __html: '<p>Det skjedde en feil: Vi fant ikke din ident</p>' }} />
                </AlertStripe>
            }
        </div>);
    }
}

Context.propTypes = {
    actions: PropTypes.object,
    veilederinfo: PropTypes.object,
    skalHenteVeilederinfo: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, {
        hentAktivBruker,
        hentAktivEnhet,
        hentVeilederinfo,
        valgtEnhet,
    });
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export function mapStateToProps(state) {
    const veilederinfo = state.veilederinfo;
    const skalHenteVeilederinfo = !(veilederinfo.henter || veilederinfo.hentet || veilederinfo.hentingFeilet);
    return {
        veilederinfo,
        skalHenteVeilederinfo,
    };
}

const ContextContainer = connect(mapStateToProps, mapDispatchToProps)(Context);

export default ContextContainer;
