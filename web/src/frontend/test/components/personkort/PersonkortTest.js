import React from 'react'
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { Utvidbar } from 'digisyfo-npm';
import Personkort, { PersonkortTittel } from '../../../js/components/personkort/Personkort';
import PersonkortVisning  from '../../../js/components/personkort/PersonkortVisning';
import Etikett  from '../../../js/components/Etikett';
import { hentBrukersAlderFraFnr } from '../../../js/utils/fnrUtils';

describe('Personkort', () => {
    let hentDiskresjonskode;
    let hentEgenansatt;
    let hentFastleger;
    let actions;
    let egenansatt;
    let diskresjonskode;
    let navbruker;
    let fastleger;
    let komponent;

    beforeEach(() => {
        diskresjonskode = { data: {} };
        egenansatt = { data: {} };
        fastleger = {
            henter: false,
            hentingFeilet: false,
            hentet: false,
        };
        navbruker = {
            navn: 'Knut',
            kontaktinfo: {
                fnr: '1234',
            },
        };
        hentDiskresjonskode = sinon.spy();
        hentEgenansatt = sinon.spy();
        hentFastleger = sinon.spy();
        actions = {
            hentDiskresjonskode,
            hentEgenansatt,
            hentFastleger,
        };
        komponent = shallow(<Personkort
            actions={actions}
            diskresjonskode={diskresjonskode}
            egenansatt={egenansatt}
            fastleger={fastleger}
            navbruker={navbruker}
        />);
    });

    it('Skal vise PersonkortTittel', () => {
        const komponent = mount(<Personkort
            actions={actions}
            diskresjonskode={diskresjonskode}
            egenansatt={egenansatt}
            fastleger={fastleger}
            navbruker={navbruker}
        />);
        expect(komponent.find(PersonkortTittel)).to.have.length(1);
    });

    it('Skal vise Utvidbar', () => {
        expect(komponent.find(Utvidbar)).to.have.length(1);
    });

    it('Skal vise PersonkortVisning', () => {
        expect(komponent.find(PersonkortVisning)).to.have.length(1);
    });

    describe('PersonkortTittel', () => {
        let diskresjonskode;
        let egenansatt;
        let navbruker;
        let komponent;

        beforeEach(() => {
            diskresjonskode = { data: {} };
            egenansatt = { data: {} };
            navbruker = {
                navn: 'Knut',
                kontaktinfo: {
                    fnr: '1234',
                }
            };
            komponent = shallow(<PersonkortTittel
                diskresjonskode={diskresjonskode}
                egenansatt={egenansatt}
                navbruker={navbruker}
            />);
        });

        it('Skal vise navbrukers fnr, navn og alder', () => {
            expect(komponent.text()).to.contain(navbruker.navn);
            expect(komponent.text()).to.contain(navbruker.kontaktinfo.fnr);
            expect(komponent.text()).to.contain(hentBrukersAlderFraFnr(navbruker.kontaktinfo.fnr));
        });

        it('Skal vise ikke vise noen Etikett, om visEtikett gir false', () => {
            komponent = shallow(<PersonkortTittel
                diskresjonskode={diskresjonskode}
                egenansatt={egenansatt}
                navbruker={navbruker}
            />);
            expect(komponent.find(Etikett)).to.have.length(0);
        });

        it('Skal vise en Etikett, om bruker har diskresjonskode er 6', () => {
            diskresjonskode = {
                data: {
                    diskresjonskode: '6',
                },
            };
            komponent = shallow(<PersonkortTittel
                diskresjonskode={diskresjonskode}
                egenansatt={egenansatt}
                navbruker={navbruker}
            />);
           expect(komponent.find(Etikett)).to.have.length(1);
        });

        it('Skal vise en Etikett, om bruker har diskresjonskode 7', () => {
            diskresjonskode = {
                data: {
                    diskresjonskode: '7',
                },
            };
            komponent = shallow(<PersonkortTittel
                diskresjonskode={diskresjonskode}
                egenansatt={egenansatt}
                navbruker={navbruker}
            />);
            expect(komponent.find(Etikett)).to.have.length(1);
        });

        it('Skal vise en Etikett, om bruker er egen ansatt', () => {
            egenansatt = {
                data: {
                    erEgenAnsatt: true,
                },
            };
            komponent = shallow(<PersonkortTittel
                diskresjonskode={diskresjonskode}
                egenansatt={egenansatt}
                navbruker={navbruker}
            />);
            expect(komponent.find(Etikett)).to.have.length(1);
        });
    });
});