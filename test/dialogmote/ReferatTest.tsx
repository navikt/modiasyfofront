import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import Referat, {
  texts as referatSkjemaTexts,
} from "../../src/components/dialogmote/referat/Referat";
import { createStore } from "redux";
import { rootReducer } from "../../src/data/rootState";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  DocumentComponentDto,
  DocumentComponentType,
} from "../../src/data/dialogmote/types/dialogmoteTypes";
import { Feilmelding, Innholdstittel } from "nav-frontend-typografi";
import { expect } from "chai";
import { Feiloppsummering } from "nav-frontend-skjema";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "../../src/utils/valideringUtils";
import {
  assertFeilmelding,
  changeFieldValue,
  changeTextAreaValue,
} from "../testUtils";
import {
  commonTexts,
  referatTexts,
} from "../../src/data/dialogmote/dialogmoteTexts";
import { tilDatoMedUkedagOgManedNavn } from "../../src/utils/datoUtils";
import { Forhandsvisning } from "../../src/components/dialogmote/Forhandsvisning";
import { Knapp } from "nav-frontend-knapper";
import Lukknapp from "nav-frontend-lukknapp";
import { AndreDeltakere } from "../../src/components/dialogmote/referat/AndreDeltakere";
import { SlettKnapp } from "../../src/components/SlettKnapp";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const arbeidstakerPersonIdent = "05087321470";
const arbeidstakerNavn = "Arne Arbeidstaker";
const veilederNavn = "Vetle Veileder";
const navEnhet = "0315";
const navEnhetNavn = "NAV Grünerløkka";
const moteUuid = "123abc";
const lederNavn = "Grønn Bamse";
const annenDeltakerFunksjon = "Verneombud";
const annenDeltakerNavn = "Bodil Bolle";
const mote: DialogmoteDTO = {
  arbeidsgiver: {
    virksomhetsnummer: "912345678",
    type: "ARBEIDSGIVER",
    varselList: [],
  },
  arbeidstaker: {
    personIdent: arbeidstakerPersonIdent,
    type: "ARBEIDSTAKER",
    varselList: [],
  },
  createdAt: "",
  opprettetAv: "",
  status: DialogmoteStatus.INNKALT,
  tildeltEnhet: "",
  tildeltVeilederIdent: "",
  updatedAt: "",
  uuid: moteUuid,
  tid: "2021-05-10T09:00:00.000",
  sted: "Videomøte",
};

const mockState = {
  behandlendeEnhet: {
    data: {
      enhetId: navEnhet,
      navn: navEnhetNavn,
    },
  },
  veilederinfo: {
    data: {
      navn: veilederNavn,
    },
  },
  navbruker: {
    data: {
      navn: arbeidstakerNavn,
      kontaktinfo: {
        fnr: arbeidstakerPersonIdent,
      },
    },
  },
  valgtbruker: {
    personident: arbeidstakerPersonIdent,
  },
  ledere: {
    currentLedere: [
      {
        navn: lederNavn,
        aktiv: true,
        orgnummer: "912345678",
      },
      {
        navn: "Annen Leder",
        aktiv: true,
        orgnummer: "89829812",
      },
    ],
  },
};

const situasjonTekst = "Noe tekst om situasjonen";
const konklusjonTekst = "Noe tekst om konklusjon";
const arbeidsgiversOppgave = "Noe tekst om arbeidsgivers oppgave";
const arbeidstakersOppgave = "Noe tekst om arbeidstakers oppgave";
const veiledersOppgave = "Noe tekst om veileders oppgave";

describe("ReferatTest", () => {
  it("viser arbeidstaker, dato og sted i tittel", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[`/sykefravaer/dialogmote/${moteUuid}/referat`]}
      >
        <Route path="/sykefravaer/dialogmote/:dialogmoteUuid/referat">
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat dialogmote={mote} pageTitle="Test" />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    expect(wrapper.find(Innholdstittel).text()).to.equal(
      `${arbeidstakerNavn}, 10. mai 2021, Videomøte`
    );
  });

  it("viser alle deltakere forhåndsutfylt med nærmeste leder redigerbar og påkrevd", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[`/sykefravaer/dialogmote/${moteUuid}/referat`]}
      >
        <Route path="/sykefravaer/dialogmote/:dialogmoteUuid/referat">
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat dialogmote={mote} pageTitle="Test" />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    expect(
      wrapper
        .find("li")
        .findWhere((li) => li.text() === `Fra NAV: ${veilederNavn}`)
    ).to.exist;
    expect(
      wrapper
        .find("li")
        .findWhere((li) => li.text() === `Arbeidstaker: ${arbeidstakerNavn}`)
    ).to.exist;

    const getNaermesteLederInput = () =>
      wrapper
        .find("input")
        .findWhere((input) => input.prop("name") === "naermesteLeder");

    // Sjekk nærmeste leder preutfylt
    let naermesteLederInput = getNaermesteLederInput();
    expect(naermesteLederInput.prop("value")).to.equal(lederNavn);

    // Sjekk at nærmeste leder valideres
    changeFieldValue(naermesteLederInput, "");
    wrapper.find("form").simulate("submit");
    assertFeilmelding(
      wrapper.find(Feilmelding),
      valideringsTexts.naermesteLederMissing
    );

    // Sjekk at nærmeste leder kan endres
    const endretNaermesteLeder = "Ny Leder";
    changeFieldValue(naermesteLederInput, endretNaermesteLeder);
    naermesteLederInput = getNaermesteLederInput();
    expect(naermesteLederInput.prop("value")).to.equal(endretNaermesteLeder);
  });

  it("validerer alle fritekstfelter unntatt veileders oppgave", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[`/sykefravaer/dialogmote/${moteUuid}/referat`]}
      >
        <Route path="/sykefravaer/dialogmote/:dialogmoteUuid/referat">
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat dialogmote={mote} pageTitle="Test" />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feil = wrapper.find(Feilmelding);
    assertFeilmelding(feil, valideringsTexts.situasjonMissing);
    assertFeilmelding(feil, valideringsTexts.konklusjonMissing);
    assertFeilmelding(feil, valideringsTexts.arbeidstakersOppgaveMissing);
    assertFeilmelding(feil, valideringsTexts.arbeidsgiversOppgaveMissing);

    // Feilmelding i oppsummering
    const feiloppsummering = wrapper.find(Feiloppsummering);
    expect(feiloppsummering.text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.situasjonMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.konklusjonMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.arbeidstakersOppgaveMissing
    );
    expect(feiloppsummering.text()).to.contain(
      valideringsTexts.arbeidsgiversOppgaveMissing
    );
  });

  it("validerer navn og funksjon på andre deltakere", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[`/sykefravaer/dialogmote/${moteUuid}/referat`]}
      >
        <Route path="/sykefravaer/dialogmote/:dialogmoteUuid/referat">
          <Provider store={store({ ...realState, ...mockState })}>
            <Referat dialogmote={mote} pageTitle="Test" />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    const addDeltakerButton = wrapper.find(Knapp).at(0);
    addDeltakerButton.simulate("click");

    wrapper.find("form").simulate("submit");

    // Feilmeldinger i skjema
    const feil = () => wrapper.find(Feilmelding);
    assertFeilmelding(feil(), valideringsTexts.andreDeltakereMissingNavn);
    assertFeilmelding(feil(), valideringsTexts.andreDeltakereMissingFunksjon);

    // Feilmelding i oppsummering
    const feiloppsummering = () => wrapper.find(Feiloppsummering);
    expect(feiloppsummering().text()).to.contain(
      skjemaFeilOppsummeringTexts.title
    );
    expect(feiloppsummering().text()).to.contain(
      valideringsTexts.andreDeltakereMissingNavn
    );
    expect(feiloppsummering().text()).to.contain(
      valideringsTexts.andreDeltakereMissingFunksjon
    );

    // Slett deltaker og sjekk at feil forsvinner
    wrapper.find(SlettKnapp).simulate("click");
    expect(feiloppsummering().text()).not.to.contain(
      valideringsTexts.andreDeltakereMissingNavn
    );
    expect(feiloppsummering().text()).not.to.contain(
      valideringsTexts.andreDeltakereMissingFunksjon
    );
  });

  it("ferdigstiller dialogmote ved submit av skjema", () => {
    const mockStore = store({ ...realState, ...mockState });
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[`/sykefravaer/dialogmote/${moteUuid}/referat`]}
      >
        <Route path="/sykefravaer/dialogmote/:dialogmoteUuid/referat">
          <Provider store={mockStore}>
            <Referat dialogmote={mote} pageTitle="Test" />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    changeTextAreaValue(wrapper, "situasjon", situasjonTekst);
    changeTextAreaValue(wrapper, "konklusjon", konklusjonTekst);
    changeTextAreaValue(wrapper, "arbeidstakersOppgave", arbeidstakersOppgave);
    changeTextAreaValue(wrapper, "arbeidsgiversOppgave", arbeidsgiversOppgave);
    changeTextAreaValue(wrapper, "veiledersOppgave", veiledersOppgave);

    const addDeltakerButton = wrapper.find(Knapp).at(0);
    addDeltakerButton.simulate("click");
    const deltakerInput = wrapper.find(AndreDeltakere).find("input");
    changeFieldValue(deltakerInput.at(0), annenDeltakerFunksjon);
    changeFieldValue(deltakerInput.at(1), annenDeltakerNavn);

    wrapper.find("form").simulate("submit");

    expect(mockStore.getActions()[0]).to.deep.equal({
      type: "FERDIGSTILL_MOTE_FORESPURT",
      fnr: arbeidstakerPersonIdent,
      moteUuid: moteUuid,
      data: {
        narmesteLederNavn: lederNavn,
        situasjon: situasjonTekst,
        konklusjon: konklusjonTekst,
        arbeidsgiverOppgave: arbeidsgiversOppgave,
        arbeidstakerOppgave: arbeidstakersOppgave,
        veilederOppgave: veiledersOppgave,
        document: expectedReferat,
        andreDeltakere: [
          { funksjon: annenDeltakerFunksjon, navn: annenDeltakerNavn },
        ],
      },
    });
  });

  it("forhåndsviser referat", () => {
    const mockStore = store({ ...realState, ...mockState });
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[`/sykefravaer/dialogmote/${moteUuid}/referat`]}
      >
        <Route path="/sykefravaer/dialogmote/:dialogmoteUuid/referat">
          <Provider store={mockStore}>
            <Referat dialogmote={mote} pageTitle="Test" />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    changeTextAreaValue(wrapper, "situasjon", situasjonTekst);
    changeTextAreaValue(wrapper, "konklusjon", konklusjonTekst);
    changeTextAreaValue(wrapper, "arbeidstakersOppgave", arbeidstakersOppgave);
    changeTextAreaValue(wrapper, "arbeidsgiversOppgave", arbeidsgiversOppgave);
    changeTextAreaValue(wrapper, "veiledersOppgave", veiledersOppgave);

    const addDeltakerButton = wrapper.find(Knapp).at(0);
    addDeltakerButton.simulate("click");
    const deltakerInput = wrapper.find(AndreDeltakere).find("input");
    changeFieldValue(deltakerInput.at(0), annenDeltakerFunksjon);
    changeFieldValue(deltakerInput.at(1), annenDeltakerNavn);

    const forhandsvisningModal = () => wrapper.find(Forhandsvisning);
    expect(
      forhandsvisningModal().props().getDocumentComponents()
    ).to.deep.equal(expectedReferat);

    const previewButton = wrapper.find(Knapp).at(1);

    previewButton.simulate("click");
    expect(forhandsvisningModal().prop("isOpen")).to.be.true;
    expect(forhandsvisningModal().text()).to.contain(
      referatSkjemaTexts.forhandsvisningTitle
    );
    forhandsvisningModal().find(Lukknapp).simulate("click");
    expect(forhandsvisningModal().prop("isOpen")).to.be.false;
  });
});

const expectedReferat: DocumentComponentDto[] = [
  {
    texts: [arbeidstakerNavn],
    type: DocumentComponentType.HEADER,
  },
  {
    texts: [`F.nr. ${arbeidstakerPersonIdent}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Dato: ${tilDatoMedUkedagOgManedNavn(mote.tid)}`,
      `Sted: ${mote.sted}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Arbeidstaker: ${arbeidstakerNavn}`,
      `Arbeidsgiver: ${lederNavn}`,
      `Fra NAV: ${veilederNavn}`,
      `${annenDeltakerFunksjon}: ${annenDeltakerNavn}`,
    ],
    title: referatTexts.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER,
  },
  {
    texts: [konklusjonTekst],
    title: referatTexts.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidstakersOppgave],
    title: referatTexts.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidsgiversOppgave],
    title: referatTexts.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veiledersOppgave],
    title: referatTexts.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [situasjonTekst],
    title: referatTexts.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhetNavn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veilederNavn],
    type: DocumentComponentType.PARAGRAPH,
  },
];
