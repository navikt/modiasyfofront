import { expect } from "chai";
import sinon from "sinon";
import {
  ledereIVirksomheterMedMotebehovsvarFraArbeidstaker,
  ledereMedOppfolgingstilfelleInnenforMotebehovperioden,
  ledereUtenMotebehovsvar,
  ledereIVirksomheterDerIngenLederHarSvartPaMotebehov,
  lederHasActiveSykmelding,
  ledereWithActiveLedereFirst,
  virksomheterWithoutLeder,
  ledereSortertPaaNavnOgOrganisasjonsnavn,
  newestLederForEachVirksomhet,
} from "../../src/utils/ledereUtils";
import { ANTALL_MS_DAG } from "../../src/utils/datoUtils";
import {
  mockActiveSykmeldingForLeder,
  mockInactiveSykmeldingForLeder,
  mockLederWithActiveSykmelding,
  mockLederWithoutActiveSykmelding,
  mockSykmeldingWithStatusNyForLeder,
} from "../mockdata/mockLedere";

describe("ledereUtils", () => {
  describe("ledereIVirksomheterMedMotebehovsvarFraArbeidstaker", () => {
    it("skal finne alle ledere som hører til en bedrift den sykmeldte har sendt inn møtebehovsvar for", () => {
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
        },
        {
          orgnummer: "321",
          aktoerId: "2",
        },
        {
          orgnummer: "999",
          aktoerId: "3",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "999",
        },
      ];

      const filtrertLederListe = ledereIVirksomheterMedMotebehovsvarFraArbeidstaker(
        ledere,
        motebehovData
      );

      expect(filtrertLederListe.length).to.equal(2);
      expect(filtrertLederListe[0].orgnummer).to.equal("123");
      expect(filtrertLederListe[1].orgnummer).to.equal("999");
    });
  });
  describe("ledereIVirksomheterDerIngenLederHarSvartPaMotebehov", () => {
    it("skal fjerne ledere med innsendt møtebehov fra lederlisten", () => {
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
        },
        {
          orgnummer: "321",
          aktoerId: "2",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "1",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
        ledere,
        motebehovData
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].orgnummer).to.equal("321");
    });
    it("skal fjerne ledere for virksomheter hvor minst én leder har innsendt møtebehov, fra lederlisten", () => {
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "123",
          aktoerId: "2",
          fomDato: "2020-09-01",
        },
        {
          orgnummer: "321",
          aktoerId: "3",
          fomDato: "2020-01-01",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "1",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
        ledere,
        motebehovData
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].orgnummer).to.equal("321");
    });
    it("skal returnere en liste med alle ledere for en virksomhet hvis kun sykmeldt har svart på møtebehov", () => {
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "123",
          aktoerId: "2",
          fomDato: "2020-09-01",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
        ledere,
        motebehovData
      );

      expect(filtrertLederListe.length).to.equal(2);
      expect(filtrertLederListe[0].orgnummer).to.equal("123");
      expect(filtrertLederListe[1].orgnummer).to.equal("123");
    });
  });
  describe("ledereMedOppfolgingstilfelleInnenforMotebehovperioden", () => {
    it("skal fjerne ledere uten oppfølgingstilfelle innenfor møtebehovperioden", () => {
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
        },
        {
          orgnummer: "321",
          aktoerId: "2",
        },
      ];
      let oppfolgingstilfeller = [];
      oppfolgingstilfeller["123"] = {
        data: [
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 5),
            tom: new Date(Date.now() + ANTALL_MS_DAG * 15),
          },
        ],
      };

      oppfolgingstilfeller["321"] = {
        data: [
          {
            orgnummer: "321",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "321",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
        ],
      };

      const filtrertLederListe = ledereMedOppfolgingstilfelleInnenforMotebehovperioden(
        ledere,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].orgnummer).to.equal("123");
    });
  });
  describe("ledereUtenMotebehovsvar", () => {
    it("skal finne ledere som ikke har sendt inn møtebehov, men som er i møtebehovperioden", () => {
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "321",
          aktoerId: "2",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "999",
          aktoerId: "3",
          fomDato: "2020-01-01",
        },
      ];
      let oppfolgingstilfeller = [];
      oppfolgingstilfeller["123"] = {
        data: [
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
          {
            orgnummer: "123",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 5),
            tom: new Date(Date.now() + ANTALL_MS_DAG * 15),
          },
        ],
      };

      oppfolgingstilfeller["999"] = {
        data: [
          {
            orgnummer: "999",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 120),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 90),
          },
          {
            orgnummer: "999",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "999",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
          {
            orgnummer: "999",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 5),
            tom: new Date(Date.now() + ANTALL_MS_DAG * 15),
          },
        ],
      };

      oppfolgingstilfeller["321"] = {
        data: [
          {
            orgnummer: "321",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 80),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 50),
          },
          {
            orgnummer: "321",
            fom: new Date(Date.now() - ANTALL_MS_DAG * 40),
            tom: new Date(Date.now() - ANTALL_MS_DAG * 10),
          },
        ],
      };

      const motebehovData = [
        {
          opprettetAv: "1",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereUtenMotebehovsvar(
        ledere,
        motebehovData,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].orgnummer).to.equal("999");
    });
    it("skal finne ledere som ikke har sendt inn møtebehov men hadde muligheten, og SM svarte", () => {
      const oppfolgingstilfeller = [];
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "321",
          aktoerId: "2",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "999",
          aktoerId: "3",
          fomDato: "2020-01-01",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "999",
        },
        {
          opprettetAv: "3",
          aktorId: "0",
          virksomhetsnummer: "999",
        },
      ];

      const filtrertLederListe = ledereUtenMotebehovsvar(
        ledere,
        motebehovData,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].orgnummer).to.equal("123");
    });
    it("skal finne nyeste leder hvis flere tilhører en virksomhet hvor kun sykmeldt har svart", () => {
      const oppfolgingstilfeller = [];
      const ledere = [
        {
          orgnummer: "123",
          aktoerId: "1",
          fomDato: "2020-01-01",
        },
        {
          orgnummer: "123",
          aktoerId: "2",
          fomDato: "2020-09-30",
        },
        {
          orgnummer: "999",
          aktoerId: "3",
          fomDato: "2020-01-01",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereUtenMotebehovsvar(
        ledere,
        motebehovData,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].orgnummer).to.equal("123");
      expect(filtrertLederListe[0].aktoerId).to.equal("2");
      expect(filtrertLederListe[0].fomDato).to.equal("2020-09-30");
    });
  });

  describe("lederHasActiveSykmelding", () => {
    let clock;
    const today = new Date(Date.now());

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Returns true if there is an active sykmelding for leders virksomhet", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(leder, sykmeldinger);

      expect(hasActiveSykmelding).to.be.equal(true);
    });

    it("Returns false if sykmelding for leders virksomhet is not active", () => {
      const leder = mockLederWithoutActiveSykmelding;
      const sykmeldinger = [mockInactiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(leder, sykmeldinger);

      expect(hasActiveSykmelding).to.be.equal(false);
    });

    it("Returns false if there are no sykmeldinger for leders virksomhet", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockInactiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(leder, sykmeldinger);

      expect(hasActiveSykmelding).to.be.equal(false);
    });

    it("Returns false if sykmelding for leders virksomhet does not have status SENDT, regardless of acive dates", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockSykmeldingWithStatusNyForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(leder, sykmeldinger);

      expect(hasActiveSykmelding).to.be.equal(false);
    });
  });

  describe("ledereWithActiveLedereFirst", () => {
    let clock;
    const today = new Date(Date.now());

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Returns a list where leder for virksomhet that has active sykmelding comes first", () => {
      const lederList = [
        mockLederWithoutActiveSykmelding,
        mockLederWithActiveSykmelding,
      ];
      const sykmeldinger = [
        mockActiveSykmeldingForLeder,
        mockInactiveSykmeldingForLeder,
      ];

      const sortedList = ledereWithActiveLedereFirst(lederList, sykmeldinger);

      expect(sortedList[0]).to.deep.equal(mockLederWithActiveSykmelding);
      expect(sortedList[1]).to.deep.equal(mockLederWithoutActiveSykmelding);
    });
  });

  describe("virksomheterWithoutLeder", () => {
    let clock;
    const today = new Date(Date.now());

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Returns a list with one leder if virksomhet in sykmelding does not have leder ", () => {
      const lederList = [mockLederWithoutActiveSykmelding];
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      const expectedLeder = {
        erOppgitt: false,
        orgnummer:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.virksomhetsnummer,
        organisasjonsnavn:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.navn,
      };

      expect(ledereFromSykmeldinger.length).to.equal(1);
      expect(ledereFromSykmeldinger[0]).to.deep.equal(expectedLeder);
    });

    it("Returns empty list if there are no sykmeldinger", () => {
      const lederList = [];
      const sykmeldinger = [];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      expect(ledereFromSykmeldinger.length).to.be.equal(0);
    });

    it("Returns empty list if virksomhet in sykmeldinger has leder", () => {
      const lederList = [mockLederWithActiveSykmelding];
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      expect(ledereFromSykmeldinger.length).to.be.equal(0);
    });

    it("Returns only one leder even if there are more than one active sykmelding for virksomhet without leder", () => {
      const lederList = [mockLederWithoutActiveSykmelding];
      const sykmeldinger = [
        mockActiveSykmeldingForLeder,
        mockActiveSykmeldingForLeder,
      ];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      const expectedLeder = {
        erOppgitt: false,
        orgnummer:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.virksomhetsnummer,
        organisasjonsnavn:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.navn,
      };

      expect(ledereFromSykmeldinger.length).to.equal(1);
      expect(ledereFromSykmeldinger[0]).to.deep.equal(expectedLeder);
    });
  });

  describe("ledereSortertPaaNavnOgOrganisasjonsnavn", () => {
    it("sorterer ledere etter organisasjonsnavn og deretter navn", () => {
      const leder1 = {
        navn: "Per",
        organisasjonsnavn: "The Syndicate",
      };
      const leder2 = {
        navn: "Carl",
        organisasjonsnavn: "The Syndicate",
      };
      const leder3 = {
        navn: "John",
        organisasjonsnavn: "FBI",
      };
      const ledere = [leder1, leder2, leder3];
      const ledereSortert = ledereSortertPaaNavnOgOrganisasjonsnavn(ledere);
      expect(ledereSortert.length).to.equal(3);
      expect(ledereSortert[0]).to.deep.equal(leder3);
      expect(ledereSortert[1]).to.deep.equal(leder2);
      expect(ledereSortert[2]).to.deep.equal(leder1);
    });
  });

  describe("newestLederForEachVirksomhet", () => {
    it("returns newest leder for each virksomhet (orgnummer)", () => {
      const lederFor123Old = {
        orgnummer: "123",
        aktoerId: "1",
        fomDato: "2020-01-01",
      };
      const lederFor123New = {
        orgnummer: "123",
        aktoerId: "2",
        fomDato: "2020-09-30",
      };
      const lederFor999 = {
        orgnummer: "999",
        aktoerId: "3",
        fomDato: "2020-01-01",
      };
      const ledere = [lederFor123Old, lederFor123New, lederFor999];

      const newestLedere = newestLederForEachVirksomhet(ledere);
      expect(newestLedere.length).to.equal(2);
      expect(newestLedere[0]).to.deep.equal(lederFor123New);
      expect(newestLedere[1]).to.deep.equal(lederFor999);
    });
  });
});
