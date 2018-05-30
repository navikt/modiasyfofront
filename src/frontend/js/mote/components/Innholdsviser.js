import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'nav-frontend-skjema';
import { Varselstripe, getLedetekst } from 'digisyfo-npm';
import { konstanter, proptypes as moterPropTypes } from 'moter-npm';
import AppSpinner from '../../components/AppSpinner';

const { BRUKER, ARBEIDSGIVER } = konstanter;

const Innhold = ({ emne, innhold }) => {
    return (<div className="blokk">
        <div className="epostinnhold__forhandsvis">
            <p>{emne}</p>
        </div>
        <div className="epostinnhold__forhandsvis">
            <div dangerouslySetInnerHTML={{ __html: innhold }} />
        </div>
    </div>);
};

Innhold.propTypes = {
    emne: PropTypes.string,
    innhold: PropTypes.string,
};

export const Innholdsvelger = ({ onChange, valgtDeltakertype, ledetekster }) => {
    return (<ul className="radiofaner radiofaner--innholdsvelger">
        <li className="radiofaner__valg">
            <Radio
                label={getLedetekst('mote.epostinnhold.informasjon-som-sendes.til-arbeidsgiver', ledetekster)}
                checked={valgtDeltakertype === ARBEIDSGIVER}
                onChange={() => {
                    onChange(ARBEIDSGIVER);
                }}
                name="innholdstype"
                value="arbeidsgiver"
                id="epostinnhold-til-arbeidsgiver" />
        </li>
        <li className="radiofaner__valg">
            <Radio
                label={getLedetekst('mote.epostinnhold.informasjon-som-sendes.til-arbeidstaker', ledetekster)}
                checked={valgtDeltakertype === BRUKER}
                onChange={() => {
                    onChange(BRUKER);
                }}
                name="innholdstype"
                value="arbeidstaker"
                id="epostinnhold-til-arbeidstaker" />
        </li>
    </ul>);
};

Innholdsvelger.propTypes = {
    onChange: PropTypes.func,
    valgtDeltakertype: moterPropTypes.deltakertype,
    ledetekster: PropTypes.object,
};

const Feil = ({ melding = 'Beklager, det oppstod en feil' }) => {
    return (<div className="blokk">
        <Varselstripe type="feil" fylt>
            <p>{melding}</p>
        </Varselstripe>
    </div>);
};

Feil.propTypes = {
    melding: PropTypes.string,
};

class Innholdsviser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valgtDeltakertype: ARBEIDSGIVER,
        };
    }

    componentDidMount() {
        this.props.hentEpostinnhold(this.getArbeidsgiver().deltakerUuid);
    }

    getSykmeldt() {
        return this.props.mote.deltakere.filter((d) => {
            return d.type === BRUKER;
        })[0];
    }

    getArbeidsgiver() {
        return this.props.mote.deltakere.filter((d) => {
            return d.type === ARBEIDSGIVER;
        })[0];
    }

    render() {
        const { henter, hentingFeilet, epostinnhold, hentEpostinnhold, ledetekster, arbeidstaker } = this.props;
        if (henter) {
            return <AppSpinner />;
        }
        if (hentingFeilet) {
            return (<Feil melding="Beklager, det oppstod en feil ved uthenting av innhold i e-posten" />);
        }
        if (epostinnhold) {
            return (<div>
                <h3 className="typo-undertittel">{getLedetekst('mote.epostinnhold.informasjon-som-sendes', ledetekster)}</h3>
                {
                    arbeidstaker.kontaktinfo.skalHaVarsel && <Innholdsvelger
                        ledetekster={ledetekster}
                        valgtDeltakertype={this.state.valgtDeltakertype}
                        onChange={(valgtDeltakertype) => {
                            this.setState({
                                valgtDeltakertype,
                            });
                            if (valgtDeltakertype === ARBEIDSGIVER) {
                                const arbeidsgiver = this.getArbeidsgiver();
                                hentEpostinnhold(arbeidsgiver.deltakerUuid);
                            } else {
                                const sykmeldt = this.getSykmeldt();
                                hentEpostinnhold(sykmeldt.deltakerUuid);
                            }
                        }} />
                }
                <Innhold {...epostinnhold} />
            </div>);
        }
        return (<Feil />);
    }
}

Innholdsviser.propTypes = {
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    epostinnhold: PropTypes.object,
    arbeidstaker: PropTypes.object,
    hentEpostinnhold: PropTypes.func,
    ledetekster: PropTypes.object,
    mote: moterPropTypes.mote,
};

export default Innholdsviser;