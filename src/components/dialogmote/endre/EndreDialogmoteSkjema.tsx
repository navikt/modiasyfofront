import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import Panel from "nav-frontend-paneler";
import { FlexRow, PaddingSize } from "../../Layout";
import { useAppSelector } from "../../../hooks/hooks";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import { endreTidSted } from "../../../data/dialogmote/dialogmote_actions";
import { useValgtPersonident } from "../../../hooks/useValgtBruker";
import { Form } from "react-final-form";
import {
  validerBegrunnelser,
  validerSted,
  validerTidspunkt,
} from "../../../utils/valideringUtils";
import { useFeilUtbedret } from "../../../hooks/useFeilUtbedret";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import EndreDialogmoteTekster from "./EndreDialogmoteTekster";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { genererDato } from "../../mote/utils";
import { useForhandsvisTidSted } from "../../../hooks/dialogmote/useForhandsvisTidSted";
import {
  DialogmoteDTO,
  EndreTidStedDialogmoteDTO,
} from "../../../data/dialogmote/types/dialogmoteTypes";
import { AlertStripeFeil } from "nav-frontend-alertstriper";

const texts = {
  send: "Lagre endringer",
  avbryt: "Avbryt",
};

const EndrePanel = styled(Panel)`
  padding: 1.75rem;
`;

const SendButton = styled(TrackedHovedknapp)`
  margin-right: 0.5rem;
`;

export interface EndreTidStedSkjemaValues {
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
}

type EndreTidStedDialogmoteSkjemaFeil = Partial<
  Pick<
    EndreTidStedSkjemaValues,
    | "sted"
    | "klokkeslett"
    | "dato"
    | "begrunnelseArbeidsgiver"
    | "begrunnelseArbeidstaker"
  >
>;

interface Props {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

const EndreDialogmoteSkjema = ({ dialogmote, pageTitle }: Props) => {
  const dispatch = useDispatch();
  const fnr = useValgtPersonident();

  const dato = dialogmote.tid.split("T")[0];
  const klokkeslett = dialogmote.tid.split("T")[1].substr(0, 5);

  const initialValues: Partial<EndreTidStedSkjemaValues> = {
    dato,
    klokkeslett,
    sted: dialogmote.sted,
    videoLink: dialogmote.videoLink,
  };

  const { endrerTidSted, endreTidStedFeil } = useAppSelector(
    (state) => state.dialogmote
  );

  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();

  const forhandsvisEndreTidStedGenerator = useForhandsvisTidSted();

  const validate = (
    values: Partial<EndreTidStedSkjemaValues>
  ): EndreTidStedDialogmoteSkjemaFeil => {
    const feilmeldinger: EndreTidStedDialogmoteSkjemaFeil = {
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      ...validerBegrunnelser({ ...values }),
      sted: validerSted(values.sted),
    };
    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const toEndreTidSted = (
    values: EndreTidStedSkjemaValues
  ): EndreTidStedDialogmoteDTO => ({
    sted: values.sted,
    tid: genererDato(values.dato, values.klokkeslett),
    videoLink: values.videoLink,
    arbeidstaker: {
      begrunnelse: values.begrunnelseArbeidstaker,
      endringsdokument: forhandsvisEndreTidStedGenerator.generateArbeidstakerTidStedDocument(
        values,
        dialogmote.tid
      ),
    },
    arbeidsgiver: {
      begrunnelse: values.begrunnelseArbeidsgiver,
      endringsdokument: forhandsvisEndreTidStedGenerator.generateArbeidstakerTidStedDocument(
        values,
        dialogmote.tid
      ),
    },
  });

  const submit = (values: EndreTidStedSkjemaValues) => {
    const dialogmoteEndring = toEndreTidSted(values);
    dispatch(endreTidSted(dialogmote.uuid, fnr, dialogmoteEndring));
  };

  return (
    <EndrePanel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteTidOgSted />
            <EndreDialogmoteTekster opprinneligTid={dialogmote.tid} />
            {endreTidStedFeil && (
              <FlexRow bottomPadding={PaddingSize.MD}>
                <AlertStripeFeil>
                  {endreTidStedFeil.defaultErrorMsg}
                </AlertStripeFeil>
              </FlexRow>
            )}
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <SendButton
                context={pageTitle}
                onClick={resetFeilUtbedret}
                htmlType="submit"
                spinner={endrerTidSted}
                autoDisableVedSpinner
              >
                {texts.send}
              </SendButton>
              <Link to={`/sykefravaer/moteoversikt`}>
                <TrackedFlatknapp context={pageTitle} htmlType="button">
                  {texts.avbryt}
                </TrackedFlatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </EndrePanel>
  );
};

export default EndreDialogmoteSkjema;
