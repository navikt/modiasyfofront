import React, { ReactElement } from "react";
import { Leder } from "../../data/leder/ledere";
import {
  finnArbeidstakerMotebehovSvar,
  motebehovFromLatestActiveTilfelle,
  sorterMotebehovDataEtterDato,
} from "../../utils/motebehovUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "../../utils/datoUtils";
import { MotebehovDTO } from "../../data/motebehov/types/motebehovTypes";
import { Brukerinfo } from "../../data/navbruker/types/Brukerinfo";
import {
  MotebehovIkkeSvartImage,
  MotebehovKanIkkeImage,
  MotebehovKanImage,
} from "../../../img/ImageComponents";
import { OppfolgingstilfelleperioderMapState } from "../../data/oppfolgingstilfelle/oppfolgingstilfelleperioder";
import { InfoRow } from "../InfoRow";
import { PaddingSize } from "../Layout";
import { ledereUtenMotebehovsvar } from "../../utils/ledereUtils";

export const lederMedGittAktorId = (aktorId: string, ledere: Leder[]) => {
  return ledere.find((leder) => {
    return leder.aktoerId === aktorId;
  });
};

export const arbeidsgiverNavnEllerTomStreng = (leder?: Leder) => {
  return leder && leder.navn ? `${leder.navn}` : "";
};

export const setSvarIkon = (deltakerOnskerMote?: boolean): string => {
  switch (deltakerOnskerMote) {
    case true: {
      return MotebehovKanImage;
    }
    case false: {
      return MotebehovKanIkkeImage;
    }
    default: {
      return MotebehovIkkeSvartImage;
    }
  }
};

export const setSvarTekst = (deltakerOnskerMote?: boolean) => {
  switch (deltakerOnskerMote) {
    case true: {
      return " har svart JA";
    }
    case false: {
      return " har svart NEI";
    }
    default: {
      return " har ikke svart";
    }
  }
};

const ikonAlternativTekst = (deltakerOnskerMote?: boolean) => {
  switch (deltakerOnskerMote) {
    case true: {
      return "Svart ja.";
    }
    case false: {
      return "Svart nei.";
    }
    default: {
      return "Ikke svart.";
    }
  }
};

export const bareArbeidsgiversMotebehov = (motebehov: MotebehovDTO) => {
  return motebehov.opprettetAv !== motebehov.aktorId;
};

const composePersonSvarText = (
  personIngress: string,
  personNavn?: string,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  const svarResultat = setSvarTekst(harMotebehov);
  const opprettetDato = svarOpprettetDato
    ? " - " + tilLesbarDatoMedArUtenManedNavn(svarOpprettetDato)
    : undefined;

  return (
    <span>
      <b>{personIngress}</b> {personNavn}, {svarResultat} {opprettetDato}
    </span>
  );
};

interface MotebehovKvitteringInnholdProps {
  deltakerOnskerMote?: boolean;
  ikonAltTekst: string;
  motebehov?: MotebehovDTO;
  tekst: ReactElement;
  topPadding?: PaddingSize;
}

export const MotebehovKvitteringInnhold = ({
  deltakerOnskerMote,
  ikonAltTekst,
  motebehov,
  tekst,
  topPadding,
}: MotebehovKvitteringInnholdProps) => {
  return (
    <InfoRow
      icon={setSvarIkon(deltakerOnskerMote)}
      iconAltText={ikonAltTekst}
      title={tekst}
      subtitle={motebehov?.motebehovSvar?.forklaring}
      topPadding={topPadding}
    />
  );
};

interface MotebehovKvitteringInnholdArbeidstakerProps {
  arbeidstakersMotebehov?: MotebehovDTO;
  sykmeldt?: Brukerinfo;
}

export const MotebehovKvitteringInnholdArbeidstaker = ({
  arbeidstakersMotebehov,
  sykmeldt,
}: MotebehovKvitteringInnholdArbeidstakerProps) => {
  const arbeidstakerOnskerMote =
    arbeidstakersMotebehov?.motebehovSvar?.harMotebehov;

  const arbeidstakerTekst = composePersonSvarText(
    "Den sykmeldte: ",
    sykmeldt?.navn,
    arbeidstakerOnskerMote,
    arbeidstakersMotebehov?.opprettetDato
  );

  const ikonAltTekst = `Sykmeldt ${ikonAlternativTekst(
    arbeidstakerOnskerMote
  )}`;

  return (
    <MotebehovKvitteringInnhold
      deltakerOnskerMote={arbeidstakerOnskerMote}
      ikonAltTekst={ikonAltTekst}
      motebehov={arbeidstakersMotebehov}
      tekst={arbeidstakerTekst}
    />
  );
};

interface MotebehovKvitteringInnholdArbeidsgiverProps {
  motebehovListeMedBareArbeidsgiversMotebehov: MotebehovDTO[];
  ledereData: Leder[];
}

export const composeArbeidsgiverSvarText = (
  leder?: Leder,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  return composePersonSvarText(
    "Nærmeste leder: ",
    arbeidsgiverNavnEllerTomStreng(leder),
    harMotebehov,
    svarOpprettetDato
  );
};

export const MotebehovKvitteringInnholdArbeidsgiver = ({
  motebehovListeMedBareArbeidsgiversMotebehov,
  ledereData,
}: MotebehovKvitteringInnholdArbeidsgiverProps) => (
  <>
    {motebehovListeMedBareArbeidsgiversMotebehov.map((motebehov, index) => {
      const arbeidsgiverOnskerMote = motebehov.motebehovSvar?.harMotebehov;
      const riktigLeder = lederMedGittAktorId(
        motebehov.opprettetAv,
        ledereData
      );
      const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
        riktigLeder
      )} ${ikonAlternativTekst(arbeidsgiverOnskerMote)}`;

      return (
        <MotebehovKvitteringInnhold
          key={index}
          deltakerOnskerMote={arbeidsgiverOnskerMote}
          ikonAltTekst={ikonAltTekst}
          motebehov={motebehov}
          tekst={composeArbeidsgiverSvarText(
            riktigLeder,
            arbeidsgiverOnskerMote,
            motebehov.opprettetDato
          )}
          topPadding={PaddingSize.SM}
        />
      );
    })}
  </>
);

interface MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps {
  ledereUtenInnsendtMotebehov: Leder[];
}

export const MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov = ({
  ledereUtenInnsendtMotebehov,
}: MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps) => (
  <>
    {ledereUtenInnsendtMotebehov.map((leder: Leder, index: number) => {
      const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
        leder
      )} ${ikonAlternativTekst(undefined)}`;
      return (
        <MotebehovKvitteringInnhold
          key={index}
          ikonAltTekst={ikonAltTekst}
          tekst={composeArbeidsgiverSvarText(leder)}
          topPadding={PaddingSize.SM}
        />
      );
    })}
  </>
);

interface MotebehovKvitteringProps {
  motebehovData: MotebehovDTO[];
  ledereData: Leder[];
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState;
  sykmeldt?: Brukerinfo;
}

const MotebehovKvittering = ({
  motebehovData,
  ledereData,
  oppfolgingstilfelleperioder,
  sykmeldt,
}: MotebehovKvitteringProps) => {
  const aktiveMotebehovSvar = motebehovFromLatestActiveTilfelle(
    motebehovData?.sort(sorterMotebehovDataEtterDato),
    oppfolgingstilfelleperioder
  );

  const ledereUtenInnsendtMotebehov = ledereUtenMotebehovsvar(
    ledereData,
    motebehovData,
    oppfolgingstilfelleperioder
  );

  return (
    <div>
      <MotebehovKvitteringInnholdArbeidstaker
        arbeidstakersMotebehov={finnArbeidstakerMotebehovSvar(
          aktiveMotebehovSvar
        )}
        sykmeldt={sykmeldt}
      />
      <MotebehovKvitteringInnholdArbeidsgiver
        motebehovListeMedBareArbeidsgiversMotebehov={aktiveMotebehovSvar.filter(
          bareArbeidsgiversMotebehov
        )}
        ledereData={ledereData}
      />
      <MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov
        ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
      />
    </div>
  );
};

export default MotebehovKvittering;
