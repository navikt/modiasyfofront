import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AlertStripe from "nav-frontend-alertstriper";
import { tilLesbarDatoMedArstall } from "../../../../utils/datoUtils";
import { soknadEllerSykepengesoknad } from "../../../../propTypes";
import { getTidligsteSendtDato } from "../../../../utils/sykepengesoknadUtils";

const texts = {
  korrigert: "Du sendte inn en endring av denne søknaden den ",
  lenketekst: "Se siste versjon av søknaden",
};

const textKorrigert = (dato) => {
  return `${texts.korrigert} ${dato}.`;
};

export const KorrigertAv = ({ korrigertAvSoknad }) => {
  return (
    <AlertStripe type="info" className="blokk">
      <p className="sist">
        {textKorrigert(
          tilLesbarDatoMedArstall(getTidligsteSendtDato(korrigertAvSoknad))
        )}
      </p>
      <p className="sist">
        <Link
          className="lenke"
          to={`/sykefravaer/sykepengesoknader/${korrigertAvSoknad.id}`}
        >
          {texts.lenketekst}
        </Link>
      </p>
    </AlertStripe>
  );
};

KorrigertAv.propTypes = {
  korrigertAvSoknad: soknadEllerSykepengesoknad,
};

export const mapStateToProps = (state, ownProps) => {
  const id = ownProps.sykepengesoknad.id;
  const sykepengesoknader = [...state.soknader.data];
  let korrigertAvSoknad = { id };

  sykepengesoknader.forEach(() => {
    sykepengesoknader.forEach((s) => {
      if (s.korrigerer === korrigertAvSoknad.id) {
        korrigertAvSoknad = s;
      }
    });
  });

  return {
    korrigertAvSoknad,
  };
};

const KorrigertAvContainer = connect(mapStateToProps)(KorrigertAv);

export default KorrigertAvContainer;
