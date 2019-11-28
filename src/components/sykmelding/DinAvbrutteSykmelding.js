import React from 'react';
import PropTypes from 'prop-types';
import {
    Utvidbar,
    DineSykmeldingOpplysninger,
    getLedetekst,
    keyValue,
} from '@navikt/digisyfo-npm';
import SykmeldingStatuspanel from '../sykmeldingstatuspanel/SykmeldingStatuspanel';

const DinAvbrutteSykmelding = ({ sykmelding, ledetekster }) => {
    return (<div>
        <SykmeldingStatuspanel sykmelding={sykmelding} />
        <Utvidbar
            className="blokk"
            erApen
            tittel={getLedetekst('din-sykmelding.dine-opplysninger.tittel', ledetekster)}
            ikon="svg/person.svg"
            ikonHover="svg/person_hover.svg"
            ikonAltTekst="Du"
            variant="lysebla"
            Overskrift="H2">
            <DineSykmeldingOpplysninger
                sykmelding={sykmelding}
                ledetekster={ledetekster} />
        </Utvidbar>
    </div>);
};

DinAvbrutteSykmelding.propTypes = {
    ledetekster: keyValue,
    sykmelding: PropTypes.object,
};

export default DinAvbrutteSykmelding;