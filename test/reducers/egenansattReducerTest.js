import { expect } from "chai";
import deepFreeze from "deep-freeze";
import * as actions from "../../src/data/egenansatt/egenansatt_actions";
import egenansatt from "../../src/data/egenansatt/egenansatt";
import {
  HENTER_EGENANSATT,
  EGENANSATT_HENTET,
  HENT_EGENANSATT_FEILET,
} from "../../src/data/egenansatt/egenansatt_actions";

describe("egenansatt", () => {
  describe("henter", () => {
    const initialState = deepFreeze({
      henter: false,
      hentet: false,
      hentingFeilet: false,
      data: {
        erEgenAnsatt: false,
      },
    });

    it(`håndterer ${HENTER_EGENANSATT}`, () => {
      const action = actions.henterEgenansatt();
      const nextState = egenansatt(initialState, action);
      expect(nextState).to.deep.equal({
        henter: true,
        hentet: false,
        hentingFeilet: false,
        data: {
          erEgenAnsatt: false,
        },
      });
    });

    it(`håndterer ${EGENANSATT_HENTET}`, () => {
      const data = true;
      const action = actions.egenansattHentet(data);
      const nextState = egenansatt(initialState, action);
      expect(nextState).to.deep.equal({
        henter: false,
        hentet: true,
        hentingFeilet: false,
        data: {
          erEgenAnsatt: data,
        },
      });
    });

    it(`håndterer ${HENT_EGENANSATT_FEILET}`, () => {
      const action = actions.hentEgenansattFeilet();
      const nextState = egenansatt(initialState, action);
      expect(nextState).to.deep.equal({
        henter: false,
        hentet: false,
        hentingFeilet: true,
        data: {
          erEgenAnsatt: false,
        },
      });
    });
  });
});
