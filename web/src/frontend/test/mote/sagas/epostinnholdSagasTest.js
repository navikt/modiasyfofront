import { expect } from 'chai';
import * as actions from '../../../js/mote/actions/epostinnhold_actions';
import { hentBekreftMoteEpostinnhold } from '../../../js/mote/sagas/epostinnholdSagas.js';
import { post, get } from '../../../js/api/index';
import { put, call } from 'redux-saga/effects';

describe("epostinnholdSagas", () => {

    beforeEach(() => {
        window.APP_SETTINGS = {
            REST_ROOT: "http://tjenester.nav.no/sykefravaer",
            MOTEADMIN_REST_ROOT: "http://tjenester.nav.no/moteadmin"
        }
    });

    describe("Epost for bekreftelse av møtetidspunkt", () => {
        const action = actions.hentBekreftMoteEpostInnhold("deltakerUuid", "alternativId");
        const generator = hentBekreftMoteEpostinnhold(action);

        it("Skal dispatche HENTER_EPOSTINNHOLD", () => {
            const nextPut = put({type: 'HENTER_EPOSTINNHOLD'});
            expect(generator.next().value).to.deep.equal(nextPut);
        });

        it("Skal deretter prøve å hente epostinnhold", () => {
            const nextCall = call(get, "http://tjenester.nav.no/moteadmin/epostinnhold/BEKREFTET?motedeltakeruuid=deltakerUuid&valgtAlternativId=alternativId");
            expect(generator.next().value).to.deep.equal(nextCall);
        });

        it("Skal deretter si i fra om at epostinnhold er hentet", () => {
            const data = {
                emne: "Mitt fine emne",
                innhold: "Mitt flotte innhold"
            }
            const nextPut = put({type: 'EPOSTINNHOLD_HENTET', eposttype: "BEKREFT_TIDSPUNKT", data });
            expect(generator.next(data).value).to.deep.equal(nextPut);
        });


    });

});