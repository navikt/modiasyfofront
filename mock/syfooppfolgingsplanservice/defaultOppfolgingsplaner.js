const getDefaultOppfolgingsplaner = () => {
  return [
    {
      id: 2956,
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
      sistEndretAvAktoerId: "1902690001002",
      sistEndretDato: "2020-01-30T08:49:05.621",
      status: "AKTIV",
      virksomhet: {
        navn: null,
        virksomhetsnummer: "110110110",
      },
      godkjentPlan: {
        opprettetTidspunkt: "2020-01-30T08:49:05.621",
        gyldighetstidspunkt: {
          fom: "2020-01-30",
          tom: "2021-04-30",
          evalueres: "2020-03-31",
        },
        tvungenGodkjenning: false,
        deltMedNAVTidspunkt: "2020-01-30T08:49:05.621",
        deltMedNAV: true,
        deltMedFastlegeTidspunkt: null,
        deltMedFastlege: false,
        dokumentUuid: "664fb21f-48c3-4669-82ca-d61f51d20c84",
      },
      oppgaver: [],
      arbeidsgiver: null,
      arbeidstaker: null,
    },
    {
      id: 2957,
      uuid: "2f1e2629-062b-442d-ae1f-3b08e9574cd1",
      sistEndretAvAktoerId: "1902690001002",
      sistEndretDato: "2020-01-30T08:49:05.621",
      status: "AKTIV",
      virksomhet: {
        navn: "BRANN OG BIL AS",
        virksomhetsnummer: "555666444",
      },
      godkjentPlan: {
        opprettetTidspunkt: "2020-01-20T08:49:05.621",
        gyldighetstidspunkt: {
          fom: "2020-01-20",
          tom: "2020-03-30",
          evalueres: "2020-03-21",
        },
        tvungenGodkjenning: false,
        deltMedNAVTidspunkt: "2020-02-20T08:49:05.621",
        deltMedNAV: true,
        deltMedFastlegeTidspunkt: "2020-01-20T08:49:05.621",
        deltMedFastlege: true,
        dokumentUuid: "264fb21f-48c3-4669-82ca-d61f51d20c84",
      },
      oppgaver: [],
      arbeidsgiver: null,
      arbeidstaker: null,
    },
    {
      id: 2963,
      uuid: "7ad362e9-c5a7-42c0-b2d0-2a053518272b",
      sistEndretAvAktoerId: "1902690001002",
      sistEndretDato: "2019-02-20T11:41:18.336",
      status: "AVBRUTT",
      virksomhet: {
        navn: null,
        virksomhetsnummer: "110110110",
      },
      godkjentPlan: {
        opprettetTidspunkt: "2019-02-20T11:41:09.374",
        gyldighetstidspunkt: {
          fom: "2020-02-20",
          tom: "2020-04-01",
          evalueres: "2019-03-29",
        },
        tvungenGodkjenning: false,
        deltMedNAVTidspunkt: "2020-03-27T11:41:18.165",
        deltMedNAV: true,
        deltMedFastlegeTidspunkt: null,
        deltMedFastlege: false,
        dokumentUuid: "1b4c44fe-6109-4e32-bfd3-f9d46664fbcc",
      },
      oppgaver: [],
      arbeidsgiver: null,
      arbeidstaker: null,
    },
    {
      id: 2989,
      uuid: "bc521a51-b75d-49a1-9f67-def017b872fe",
      sistEndretAvAktoerId: "1",
      sistEndretDato: "2019-02-12T08:36:32.186",
      status: "AKTIV",
      virksomhet: {
        navn: null,
        virksomhetsnummer: "110110110",
      },
      godkjentPlan: {
        opprettetTidspunkt: "2019-02-12T08:36:21.31",
        gyldighetstidspunkt: {
          fom: "2019-02-10",
          tom: "2019-10-26",
          evalueres: "2019-08-25",
        },
        tvungenGodkjenning: false,
        deltMedNAVTidspunkt: "2019-02-12T08:36:32.025",
        deltMedNAV: true,
        deltMedFastlegeTidspunkt: null,
        deltMedFastlege: false,
        dokumentUuid: "49e8256d-ea0b-4828-af2a-079b17ecf367",
      },
      oppgaver: [],
      arbeidsgiver: null,
      arbeidstaker: null,
    },
  ];
};

module.exports = {
  getDefaultOppfolgingsplaner,
};