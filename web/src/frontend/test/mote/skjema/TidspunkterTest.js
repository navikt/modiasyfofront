import {expect} from "chai";
import Tidspunkter from "../../../js/mote/skjema/Tidspunkter";
import Tidspunkt from "../../../js/mote/skjema/Tidspunkt";
import Datovelger from '../../../js/components/datovelger/Datovelger';
import {mount, shallow, render} from "enzyme";
import React from "react";
import {Field} from "redux-form";

describe("Tidspunkter", () => {

    it("Skal vise to tidspunkter som default", () => {
        const compo = shallow(<Tidspunkter />);
        expect(compo.find(Tidspunkt)).to.have.length(2);
    });

    it("Skal vise tre tidspunkter dersom man dytter det inn eksplisitt", () => {
        const compo = shallow(<Tidspunkter tidspunker={[0,1,2]}/>);
        expect(compo.find(Tidspunkt)).to.have.length(3);
    });

    it("Skal sende skjemanavn videre til Tidspunkt", () => {
        const compo = shallow(<Tidspunkter skjemanavn="mitt-skjemanavn" tidspunker={[0,1,2]}/>);
        expect(compo.find(Tidspunkt).at(0).prop("skjemanavn")).to.equal("mitt-skjemanavn")
    })
});

describe("Tidspunkt", () => {

    let component; 

    beforeEach(() => {
        component = shallow(<Tidspunkt tidspunkt={3} skjemanavn="Bananer" />);
    });

    it("Skal inneholde en Datovelger", () => {
        expect(component.find(Datovelger)).to.have.length(1);
    });

    it("Skal sende skjemanavn videre til Datovelger", () => {
        expect(component.find(Datovelger)).to.have.length(1);
        expect(component.find(Datovelger).prop("skjemanavn")).to.equal("Bananer")
    });

});

