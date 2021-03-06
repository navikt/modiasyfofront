import React from "react";
import Panel from "nav-frontend-paneler";
import TilbakeTilSoknader from "./TilbakeTilSoknader";

const IkkeInnsendtSoknad = () => {
  return (
    <div>
      <Panel className="panel--melding blokk">
        <h2 className="hode hode--info hode-dekorert">
          Søknaden er ikke sendt ennå
        </h2>
        <p>
          Når brukeren har fullført søknaden og sendt den inn til arbeidsgiver
          og/eller NAV vil du kunne se statusen på søknaden her.
        </p>
      </Panel>
      <TilbakeTilSoknader />
    </div>
  );
};

export default IkkeInnsendtSoknad;
