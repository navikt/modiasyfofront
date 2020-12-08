import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Leder } from "../../data/leder/ledere";
import { VeilederinfoDTO } from "../../data/veilederinfo/types/VeilederinfoDTO";
import { erLokal } from "../../utils/miljoUtil";
import { hentVirksomhet } from "../../data/virksomhet/virksomhet_actions";
import { OppfolgingsplanDTO } from "../../data/oppfolgingsplan/oppfoelgingsdialoger";
import BehandleMotebehovKnapp from "./BehandleMotebehovKnapp";
import MotebehovKvittering from "./MotebehovKvittering";
import PrediksjonVisning from "../Prediksjon/PrediksjonVisning";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "./UtdragFraSykefravaeret";

interface MotebehovProps {
  aktiveDialoger: OppfolgingsplanDTO[];
  fnr: string;
  ledereData: Leder[];
  ledereUtenInnsendtMotebehov: any[];
  motebehovListe: any[];
  sykmeldt: any;
  motebehovListeMedJaSvarTilOppgavebehandling: any[];
  veilederinfo: VeilederinfoDTO;
  oppfolgingstilfelleperioder: any[];
  sykmeldinger: any[];
}

const Motebehov = (motebehovProps: MotebehovProps) => {
  const {
    aktiveDialoger,
    fnr,
    ledereData,
    ledereUtenInnsendtMotebehov,
    motebehovListe,
    sykmeldt,
    motebehovListeMedJaSvarTilOppgavebehandling,
    veilederinfo,
    oppfolgingstilfelleperioder,
    sykmeldinger,
  } = motebehovProps;

  const dispatch = useDispatch();

  useEffect(() => {
    aktiveDialoger.forEach((plan) => {
      if (!plan.virksomhet.navn) {
        dispatch(hentVirksomhet(plan.virksomhet.virksomhetsnummer));
      }
    });
  }, []);

  return (
    <div className="motebehovSide">
      <Sidetopp tittel={"Behov for dialogmøte"} />
      {motebehovListeMedJaSvarTilOppgavebehandling.length > 0 && (
        <BehandleMotebehovKnapp
          fnr={fnr}
          motebehovListe={motebehovListeMedJaSvarTilOppgavebehandling}
          veilederinfo={veilederinfo}
        />
      )}
      <MotebehovKvittering
        ledereData={ledereData}
        ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
        motebehovListe={motebehovListe}
        sykmeldt={sykmeldt}
      />

      {erLokal() && <PrediksjonVisning fnr={fnr} />}

      <UtdragFraSykefravaeret
        aktiveDialoger={aktiveDialoger}
        fnr={fnr}
        oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
        sykmeldinger={sykmeldinger}
      />
      {motebehovListeMedJaSvarTilOppgavebehandling.length > 0 && (
        <BehandleMotebehovKnapp
          fnr={fnr}
          motebehovListe={motebehovListeMedJaSvarTilOppgavebehandling}
          veilederinfo={veilederinfo}
        />
      )}
    </div>
  );
};

export default Motebehov;
