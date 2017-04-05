import { expect } from 'chai';
import DropdownInnholdsviser from '../../../js/mote/components/DropdownInnholdsviser';
import AppSpinner from '../../../js/components/AppSpinner';
import { mount, shallow } from 'enzyme';
import React from 'react'
import sinon from 'sinon';

const getMote = (mote) => {
    return Object.assign({}, {
        "status": "OPPRETTET",
        "opprettetTidspunkt": new Date("2017-02-22T15:18:24.323"),
        "bekreftetTidspunkt": new Date("2017-02-22T15:18:24.323"),
        "bekreftetAlternativ": {
            "id": 1,
            "tid": new Date("2017-03-07T15:18:24.323"),
            "created": new Date("2017-02-22T15:18:24.323"),
            "sted": "Sannergata 2",
            "valgt": false
        },
        "deltakere": [{
            "hendelser": [],
            "deltakerUuid": "uuid1",
            "navn": "Are Arbeidsgiver",
            "orgnummer": "***REMOVED***",
            "epost": "are.arbeidsgiver@nav.no",
            "type": "arbeidsgiver",
            "svartidspunkt": null,
            "svar": [{
                "id": 1,
                "tid": new Date("2017-03-07T15:18:24.323"),
                "created": new Date("2017-02-22T15:18:24.323"),
                "sted": "Sannergata 2",
                "valgt": false
            }, {
                "id": 2,
                "tid": new Date("2017-03-09T15:18:24.323"),
                "created": new Date("2017-02-22T15:18:24.323"),
                "sted": "Sannergata 2",
                "valgt": false
            }]
        }, {
            "hendelser": [],
            "deltakerUuid": "uuid2",
            "navn": "Sygve Sykmeldt",
            "orgnummer": null,
            "epost": null,
            "type": "Bruker",
            "svartidspunkt": null,
            "svar": [{
                "id": 1,
                "tid": new Date("2017-03-07T15:18:24.323"),
                "created": new Date("2017-02-22T15:18:24.323"),
                "sted": "Sannergata 2",
                "valgt": false
            }, {
                "id": 2,
                "tid": new Date("2017-03-09T15:18:24.323"),
                "created": new Date("2017-02-22T15:18:24.323"),
                "sted": "Sannergata 2",
                "valgt": false
            }]
        }],
        "alternativer": [{
            "id": 1,
            "tid": new Date("2017-03-07T15:18:24.323"),
            "created": new Date("2017-02-22T15:18:24.323"),
            "sted": "Sannergata 2",
            "valgt": false
        }, {
            "id": 2,
            "tid": new Date("2017-02-25T15:18:24.323"),
            "created": new Date("2017-02-22T15:18:24.323"),
            "sted": "Sannergata 2",
            "valgt": false
        }]
    }, mote);
};

describe("Innholdsviser", () => {

    let mote;
    let hentEpostinnhold;
    let epostinnhold;

    beforeEach(() => {
        mote = getMote();
        hentEpostinnhold = sinon.spy();
        epostinnhold = {
            emne: "Mitt emne",
            innhold: "<p>Mitt innhold</p>",
        }
    });

    it("Skal hente epostinnhold", () => {
        let component = shallow(<DropdownInnholdsviser hentEpostinnhold={hentEpostinnhold} mote={mote} type="Bruker" />);
        component.instance().componentDidMount();
        expect(hentEpostinnhold.calledWith("uuid2", 1)).to.be.true;
    });

    it("Viser AppSpinner når epostinnhold hentes", () => {
        let component = shallow(<DropdownInnholdsviser hentEpostinnhold={hentEpostinnhold} mote={mote} henter={true} type="Bruker" />)
        expect(component.find(AppSpinner)).to.have.length(1);
    });

    it("Viser epostinnhold dersom epostinnhold er hentet", () => {
        let component = shallow(<DropdownInnholdsviser hentEpostinnhold={hentEpostinnhold} mote={mote} epostinnhold={epostinnhold} type="Bruker" />);
        expect(component.html()).to.contain("Mitt emne");
        expect(component.html()).to.contain("Mitt innhold");
    });
});