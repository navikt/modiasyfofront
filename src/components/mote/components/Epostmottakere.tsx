import React from "react";
import { Brukerinfo } from "../../../data/navbruker/types/Brukerinfo";
import { MoteDTO } from "../../../data/mote/types/moteTypes";
import { BRUKER, ARBEIDSGIVER } from "../../../konstanter";

const texts = {
  arbeidsgiver: "Sendes til arbeidsgiver",
  arbeidstaker: "Sendes til arbeidstaker",
};

interface EpostmottakereProps {
  arbeidstaker: Brukerinfo;
  mote: MoteDTO;
}

const Epostmottakere = (epostmottakereProps: EpostmottakereProps) => {
  const { arbeidstaker, mote } = epostmottakereProps;
  const sykmeldt = mote.deltakere.filter((d) => {
    return d.type === BRUKER;
  })[0];
  const arbeidsgiver = mote.deltakere.filter((d) => {
    return d.type === ARBEIDSGIVER;
  })[0];

  return (
    <div className="mottakere">
      <div className="epostinnhold__mottaker js-mottaker blokk">
        <h3>{texts.arbeidsgiver}</h3>
        <p>{arbeidsgiver.navn}</p>
      </div>
      {arbeidstaker.kontaktinfo.skalHaVarsel && (
        <div className="epostinnhold__mottaker js-mottaker blokk">
          <h3>{texts.arbeidstaker}</h3>
          <p>{sykmeldt.navn}</p>
        </div>
      )}
    </div>
  );
};

export default Epostmottakere;
