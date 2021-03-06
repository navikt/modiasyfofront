import React from "react";
import { MoteDTO } from "../../../data/mote/types/moteTypes";
import { ARBEIDSGIVER, BRUKER } from "../../../konstanter";
import DatoOgTid from "./DatoOgTid";
import SvarMedIkon from "./SvarMedIkon";

interface BekreftetMotetidspunktProps {
  mote: MoteDTO;
}

const BekreftetMotetidspunkt = (
  bekreftetMotetidspunktProps: BekreftetMotetidspunktProps
) => {
  const { mote } = bekreftetMotetidspunktProps;
  const arbeidsgiver = mote.deltakere.filter((d) => {
    return d.type === ARBEIDSGIVER;
  })[0];
  const arbeidstaker = mote.deltakere.filter((d) => {
    return d.type === BRUKER;
  })[0];
  const arbeidstakerSvar =
    arbeidstaker &&
    arbeidstaker.svar.filter((s) => {
      return s.id === mote.bekreftetAlternativ?.id;
    })[0];
  const arbeidsgiversSvar =
    arbeidsgiver &&
    arbeidsgiver.svar.filter((s) => {
      return s.id === mote.bekreftetAlternativ?.id;
    })[0];
  return (
    <div className="gronnRammeTidspunkt">
      {mote.bekreftetAlternativ && (
        <DatoOgTid tid={mote.bekreftetAlternativ?.tid} />
      )}
      <SvarMedIkon bruker={arbeidsgiver} svar={arbeidsgiversSvar} />
      {arbeidstaker && arbeidstakerSvar && (
        <SvarMedIkon bruker={arbeidstaker} svar={arbeidstakerSvar} />
      )}
    </div>
  );
};

export default BekreftetMotetidspunkt;
