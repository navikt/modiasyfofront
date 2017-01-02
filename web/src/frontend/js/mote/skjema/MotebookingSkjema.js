import React, { PropTypes } from 'react';
import { Field, Fields, reduxForm } from 'redux-form';
import TextField from '../../components/TextField';
import LederFields, { ManuellUtfyltLeder } from './LederFields';
import Tidspunkter from './Tidspunkter';
import Sidetopp from '../../components/Sidetopp';
import { Varselstripe } from 'digisyfo-npm';

export function genererDato(dato, klokkeslett) {
    const s = new Date();
    const datoArr = dato.split('.');
    const klokkeslettArr = klokkeslett.split('.');
    const aar = datoArr[2];
    const aarPadded = aar.length === 2 ? `20${aar}` : aar;
    s.setDate(datoArr[0]);
    s.setMonth(parseInt(datoArr[1], 10) - 1);
    s.setYear(aarPadded);
    s.setHours(klokkeslettArr[0]);
    s.setMinutes(klokkeslettArr[1]);
    s.setSeconds('00');
    s.setMilliseconds('000');
    return s.toJSON();
}

export function getData(values) {
    const deltaker = Object.assign({}, values.deltakere[0], {
        type: 'arbeidsgiver',
    });

    const alternativer = values.tidspunkter.map((tidspunkt) => {
        return {
            tid: genererDato(tidspunkt.dato, tidspunkt.klokkeslett),
            sted: values.sted,
            valgt: false,
        };
    });

    return {
        alternativer,
        deltakere: [Object.assign(deltaker, { svar: alternativer, avvik: [] })],
    };
}

export const KontaktinfoFeilmelding = ({ feilAarsak }) => {
    return (<div className="panel">
        <div className="hode hode-informasjon">
        {
            (() => {
                switch (feilAarsak.toUpperCase()) {
                    case 'RESERVERT': {
                        return <p>Den sykmeldte har reservert seg mot elektronisk kommunikasjon med det offentlige. Du kan fortsatt sende møteforespørsel til arbeidsgiveren digitalt, men den sykmeldte må kontaktes på annen måte.</p>;
                    }
                    case 'INGEN_KONTAKTINFORMASJON': {
                        return (<div>
                            <p>Den sykmeldte er ikke registrert i Kontakt- og reservasjonsregisteret (KRR). Du kan fortsatt sende møteforespørsel til arbeidsgiveren digitalt, men den sykmeldte må kontaktes på annen måte.</p>
                            <p>Den sykmeldte kan registrere kontaktinformasjonen sin her: <a target="_blank"href="http://eid.difi.no/nb/oppdater-kontaktinformasjonen-din">http://eid.difi.no/nb/oppdater-kontaktinformasjonen-din</a></p>
                        </div>);
                    }
                    case 'KODE6': {
                        return <p>Den sykmeldte er registrert med skjermingskode 6.</p>;
                    }
                    case 'KODE7': {
                        return <p>Den sykmeldte er registrert med skjermingskode 7.</p>;
                    }
                    default: {
                        return <p />;
                    }
                }
            })
        }
        </div>
    </div>);
};

KontaktinfoFeilmelding.propTypes = {
    feilAarsak: PropTypes.string,
};

export const Arbeidstaker = ({ navn, kontaktinfo }) => {
    return (<div className="arbeidstakersOpplysninger skjema-fieldset blokk--xl">
        <legend>2. Arbeidstakers opplysninger</legend>
        <div className="nokkelopplysning">
            <h4>Navn</h4>
            <p>{navn}</p>
        </div>
        <div className="nokkelopplysning">
            <h4>E-post</h4>
            <p>{kontaktinfo.epost}</p>
        </div>
        <div className="nokkelopplysning">
            <h4>Telefon</h4>
            <p className="sist">{kontaktinfo.tlf}</p>
        </div>
    </div>);
};

Arbeidstaker.propTypes = {
    navn: PropTypes.string,
    kontaktinfo: PropTypes.object,
};

export const MotebookingSkjema = ({ handleSubmit, arbeidstaker, opprettMote, fnr, sender, sendingFeilet, ledere,
    autofill, untouch, hentLedereFeiletBool }) => {
    const submit = (values) => {
        const data = getData(values);
        data.fnr = fnr;
        opprettMote(data);
    };

    const visArbeidstaker = arbeidstaker && arbeidstaker.kontaktinfo && arbeidstaker.kontaktinfo.reservasjon.skalHaVarsel;
    const feilAarsak = arbeidstaker && arbeidstaker.kontaktinfo ? arbeidstaker.kontaktinfo.reservasjon.feilAarsak : '';

    return (<div>
        { !visArbeidstaker && <KontaktinfoFeilmelding feilAarsak={feilAarsak} /> }
        <form className="panel" onSubmit={handleSubmit(submit)}>
            <Sidetopp tittel="Møteforespørsel" />

            {
                hentLedereFeiletBool && <div className="blokk">
                    <Varselstripe>
                        <p>Beklager, det oppstod en feil ved uthenting av nærmeste leder. Du kan likevel sende møteforespøsel.</p>
                    </Varselstripe>
                </div>
            }

            <fieldset className="skjema-fieldset js-arbeidsgiver blokk--l">
                <legend>1. Fyll inn arbeidsgiverens opplysninger</legend>
                {
                    ledere.length > 0 && <Fields
                        autofill={autofill}
                        untouch={untouch}
                        names={['arbeidsgiverType', 'deltakere[0].navn', 'deltakere[0].epost', 'deltakere[0].orgnummer']}
                        ledere={ledere}
                        component={LederFields} />
                }
                {
                    ledere.length === 0 && <ManuellUtfyltLeder />
                }
            </fieldset>
            {
                visArbeidstaker && <Arbeidstaker {...arbeidstaker} />
            }
            <fieldset className="skjema-fieldset blokk">
                <legend>{visArbeidstaker ? '3.' : '2.'} Velg dato, tid og sted</legend>
                <Tidspunkter />
                <label htmlFor="sted">Sted</label>
                <Field id="sted" component={TextField} name="sted" className="input--xxl js-sted" placeholder="Skriv møtested eller om det er et videomøte" />
            </fieldset>

            <div aria-live="polite" role="alert">
                { sendingFeilet && <div className="panel panel--ramme">
                    <div className="varselstripe varselstripe--feil">
                        <div className="varselstripe__ikon">
                            <img src="/sykefravaer/img/svg/utropstegn.svg" />
                        </div>
                        <p className="sist">Beklager, det oppstod en feil. Prøv igjen litt senere.</p>
                    </div>
                </div>}
            </div>

            <div className="knapperad blokk">
                <input type="submit" className="knapp" value="Send" disabled={sender} />
            </div>
        </form>
    </div>);
};

MotebookingSkjema.propTypes = {
    fnr: PropTypes.string,
    handleSubmit: PropTypes.func,
    opprettMote: PropTypes.func,
    sender: PropTypes.bool,
    sendingFeilet: PropTypes.bool,
    ledere: PropTypes.array,
    autofill: PropTypes.func,
    untouch: PropTypes.func,
    hentLedereFeiletBool: PropTypes.bool,
    arbeidstaker: PropTypes.object,
};

function erGyldigEpost(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function erGyldigKlokkeslett(klokkeslett) {
    const re = /^([0-9]|0[0-9]|1[0-9]|2[0-3])\.[0-5][0-9]$/;
    return re.test(klokkeslett);
}

function erGyldigDato(dato) {
    const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    return re.test(dato);
}

export function validate(values, props) {
    const feilmeldinger = {};
    const lederFeilmelding = {};
    let tidspunkterFeilmeldinger = [{}, {}];

    if (!values.deltakere || !values.deltakere[0] || !values.deltakere[0].navn) {
        lederFeilmelding.navn = 'Vennligst fyll ut nærmeste leders navn';
    }

    if (!values.deltakere || !values.deltakere[0] || !values.deltakere[0].epost) {
        lederFeilmelding.epost = 'Vennligst fyll ut nærmeste leders e-post-adresse';
    } else if (!erGyldigEpost(values.deltakere[0].epost)) {
        lederFeilmelding.epost = 'Vennligst fyll ut en gyldig e-post-adresse';
    }

    if ((!values.arbeidsgiverType || values.arbeidsgiverType === 'manuell') && values.deltakere && values.deltakere[0].orgnummer &&
        (values.deltakere[0].orgnummer.length !== 9 || isNaN(values.deltakere[0].orgnummer))) {
        lederFeilmelding.orgnummer = 'Et orgnummer består av 9 siffer';
    }

    if (lederFeilmelding.navn || lederFeilmelding.epost || lederFeilmelding.orgnummer) {
        feilmeldinger.deltakere = [lederFeilmelding];
    }

    if (!values.tidspunkter || !values.tidspunkter.length) {
        tidspunkterFeilmeldinger = [{
            dato: 'Vennligst angi dato',
            klokkeslett: 'Vennligst angi klokkeslett',
        }, {
            dato: 'Vennligst angi dato',
            klokkeslett: 'Vennligst angi klokkeslett',
        }];
    } else {
        tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map((tidspunkt, index) => {
            const tidspunktValue = values.tidspunkter[index];
            const feil = {};
            if (!tidspunktValue || !tidspunktValue.klokkeslett) {
                feil.klokkeslett = 'Vennligst angi klokkeslett';
            } else if (!erGyldigKlokkeslett(tidspunktValue.klokkeslett)) {
                feil.klokkeslett = 'Vennligst angi riktig format; f.eks. 13.00';
            }
            if (!tidspunktValue || !tidspunktValue.dato) {
                feil.dato = 'Vennligst angi dato';
            } else if (!erGyldigDato(tidspunktValue.dato)) {
                feil.dato = 'Vennligst angi riktig datoformat; dd.mm.åååå';
            }
            return feil;
        });
    }

    if (JSON.stringify(tidspunkterFeilmeldinger) !== JSON.stringify([{}, {}])) {
        feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
    }

    if (!values.sted || values.sted.trim() === '') {
        feilmeldinger.sted = 'Vennligst angi møtested';
    }

    if (values.arbeidsgiverType === 'VELG' || (props.ledere.length > 0 && !values.arbeidsgiverType)) {
        feilmeldinger.arbeidsgiverType = 'Vennligst velg arbeidsgiver';
    }

    return feilmeldinger;
}

const ReduxSkjema = reduxForm({
    form: 'opprettMote',
    validate,
})(MotebookingSkjema);

export default ReduxSkjema;
