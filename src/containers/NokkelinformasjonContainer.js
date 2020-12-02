import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { keyValue, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import * as oppfoelgingsdialogerActions from "../actions/oppfoelgingsdialoger_actions";
import * as oppfolgingstilfelleperioderActions from "../actions/oppfolgingstilfelleperioder_actions";
import * as sykmeldingerActions from "../actions/sykmeldinger_actions";
import * as ledereActions from "../actions/ledere_actions";
import * as virksomhetActions from "../actions/virksomhet_actions";
import { NOKKELINFORMASJON } from "../enums/menypunkter";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import {
  harForsoktHentetLedere,
  harForsoktHentetLedetekster,
  harForsoktHentetOppfoelgingsdialoger,
} from "../utils/reducerUtils";
import Side from "../sider/Side";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import Nokkelinformasjon from "../components/nokkelinformasjon/Nokkelinformasjon";

const texts = {
  feilmelding: "Du har ikke tilgang til denne tjenesten",
};

export class NokkelinformasjonSide extends Component {
  componentDidMount() {
    const { actions, fnr } = this.props;
    actions.hentLedere(fnr);
    actions.hentSykmeldinger(fnr);
  }

  componentWillReceiveProps(nextProps) {
    const { actions, fnr } = nextProps;
    actions.hentOppfolgingstilfelleperioder(fnr);
    if (fnr) {
      actions.hentOppfoelgingsdialoger(fnr);
    }
  }

  render() {
    const {
      actions,
      aktiveDialoger,
      fnr,
      henter,
      hentingFeilet,
      ledetekster,
      tilgang,
      oppfolgingstilfelleperioder,
      sykmeldinger,
    } = this.props;
    return (
      <Side fnr={fnr} tittel="Møtebehov" aktivtMenypunkt={NOKKELINFORMASJON}>
        {(() => {
          if (henter) {
            return <AppSpinner />;
          } else if (!tilgang.harTilgang) {
            return (
              <Feilmelding
                tittel={texts.feilmelding}
                melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
              />
            );
          } else if (hentingFeilet) {
            return <Feilmelding />;
          }
          return (
            <Nokkelinformasjon
              actions={actions}
              fnr={fnr}
              ledetekster={ledetekster}
              aktiveDialoger={aktiveDialoger}
              oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
              sykmeldinger={sykmeldinger}
            />
          );
        })()}
      </Side>
    );
  }
}

NokkelinformasjonSide.propTypes = {
  actions: PropTypes.object,
  aktiveDialoger: PropTypes.array,
  fnr: PropTypes.string,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  ledetekster: keyValue,
  tilgang: PropTypes.object,
  oppfolgingstilfelleperioder: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign(
    {},
    oppfoelgingsdialogerActions,
    oppfolgingstilfelleperioderActions,
    sykmeldingerActions,
    ledereActions,
    virksomhetActions
  );
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export const mapStateToProps = (state, ownProps) => {
  const oppfolgingstilfelleperioder = state.oppfolgingstilfelleperioder;

  const aktiveDialoger = state.oppfoelgingsdialoger.data.filter((dialog) => {
    return (
      dialog.status !== "AVBRUTT" &&
      new Date(dialog.godkjentPlan.gyldighetstidspunkt.tom) > new Date()
    );
  });

  const harForsoktHentetAlt =
    harForsoktHentetLedetekster(state.ledetekster) &&
    harForsoktHentetOppfoelgingsdialoger(state.oppfoelgingsdialoger) &&
    harForsoktHentetLedere(state.ledere);
  return {
    fnr: ownProps.params.fnr,
    henter: !harForsoktHentetAlt,
    hentingFeilet: state.ledetekster.hentingFeilet,
    ledetekster: state.ledetekster.data,
    tilgang: state.tilgang.data,
    aktiveDialoger,
    oppfolgingstilfelleperioder,
    sykmeldinger: state.sykmeldinger.data,
  };
};

const NokkelinformasjonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NokkelinformasjonSide);

export default NokkelinformasjonContainer;