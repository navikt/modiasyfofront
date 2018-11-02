import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getLedetekst,
    getHtmlLedetekst,
} from 'digisyfo-npm';
import Side from '../sider/Side';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import * as motebehovActions from '../actions/motebehov_actions';
import { MOETEPLANLEGGER } from '../enums/menypunkter';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';
import { MotebehovKvittering } from '../components/MotebehovKvittering';
import { bindActionCreators } from 'redux';
import * as veilederoppgaverActions from '../actions/veilederoppgaver_actions';

export class MotebehovSide extends Component {
    constructor(props = false) {
        super(props);
        if (!this.props.motebehovForsoktHentet) {
            this.props.actions.hentMotebehov(this.props.fnr);
        }
    }

    render() {
        const {
            fnr,
            henter,
            hentingFeilet,
            motebehovListe,
            tilgang,
            ledetekster,
            motebehovTilgang,
            oppgaver,
            veilederinfo,
            actions,
            motebehovForsoktHentet,
            ledere,
        } = this.props;
        return (<Side fnr={fnr} tittel="Møtebehov" aktivtMenypunkt={MOETEPLANLEGGER}>
            {
                (() => {
                    if (!motebehovForsoktHentet || henter) {
                        return <AppSpinner />;
                    }
                    if (!tilgang.harTilgang) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(tilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (motebehovTilgang.harTilgang === false) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(motebehovTilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    if (motebehovListe.length > 0) {
                        return (<MotebehovKvittering
                            ledetekster={ledetekster}
                            oppgaver={oppgaver}
                            veilederinfo={veilederinfo}
                            fnr={fnr}
                            actions={actions}
                            motebehovListe={motebehovListe}
                            ledere={ledere}
                        />);
                    }
                    return (<Feilmelding
                        tittel={getLedetekst('mote.motebehov.feilmelding.tittel', ledetekster)}
                        melding={getHtmlLedetekst('mote.motebehov.feilmelding.ikkeFunnet', ledetekster)}
                    />);
                })()
            }
        </Side>);
    }
}

MotebehovSide.propTypes = {
    fnr: PropTypes.string,
    motebehovForsoktHentet: PropTypes.bool,
    motebehovListe: PropTypes.array,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    tilgang: PropTypes.object,
    ledetekster: PropTypes.object,
    motebehovTilgang: PropTypes.object,
    oppgaver: PropTypes.arrayOf(PropTypes.object),
    veilederinfo: PropTypes.object,
    actions: PropTypes.object,
    ledere: PropTypes.array,
};

export const sorterMotebehovDataEtterDato = (a, b) => {
    return b.opprettetDato === a.opprettetDato ? 0 : b.opprettetDato > a.opprettetDato ? 1 : -1;
};

export const finnNyesteMotebehovsvarFraHverLeder = (motebehovData) => {
    return motebehovData.filter((motebehov1, index) => {
        return motebehovData.findIndex(motebehov2 => {
            return motebehov1.virksomhetsnummer === motebehov2.virksomhetsnummer;
        }) === index;
    });
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, motebehovActions, veilederoppgaverActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    const motebehovData = state.motebehov.data;
    const sortertMotebehovData = motebehovData && motebehovData.sort(sorterMotebehovDataEtterDato);
    const motebehovListe = sortertMotebehovData && sortertMotebehovData.length > 0 ? finnNyesteMotebehovsvarFraHverLeder(sortertMotebehovData) : [];
    return {
        fnr: ownProps.params.fnr,
        motebehovForsoktHentet: state.motebehov.henter || state.motebehov.hentet || state.motebehov.hentingFeilet,
        motebehovListe,
        henter: state.motebehov.henter || state.ledetekster.henter,
        hentingFeilet: state.motebehov.hentingFeilet || state.ledetekster.hentingFeilet,
        tilgang: state.tilgang.data,
        ledetekster: state.ledetekster.data,
        motebehovTilgang: state.motebehov.tilgang,
        oppgaver: state.veilederoppgaver.data,
        veilederinfo: state.veilederinfo.data,
        ledere: state.ledere.data,
    };
};

const MotebehovContainer = connect(mapStateToProps, mapDispatchToProps)(MotebehovSide);

export default MotebehovContainer;
