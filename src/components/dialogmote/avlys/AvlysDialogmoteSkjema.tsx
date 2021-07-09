import Panel from "nav-frontend-paneler";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useValgtPersonident } from "../../../hooks/useValgtBruker";
import { FlexRow, PaddingSize } from "../../Layout";
import { useDispatch } from "react-redux";
import { avlysMote } from "../../../data/dialogmote/dialogmote_actions";
import { useAppSelector } from "../../../hooks/hooks";
import { AlertStripeFeil } from "nav-frontend-alertstriper";
import { Form } from "react-final-form";
import DialogmoteInfo from "./DialogmoteInfo";
import { DialogmoteDTO } from "../../../data/dialogmote/types/dialogmoteTypes";
import AvlysDialogmoteBegrunnelse from "./AvlysDialogmoteBegrunnelse";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "../../../hooks/useFeilUtbedret";
import { validerBegrunnelser } from "../../../utils/valideringUtils";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { useForhandsvisAvlysning } from "../../../hooks/dialogmote/useForhandsvisAvlysning";
import { Forhandsvisning } from "../Forhandsvisning";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";

export const texts = {
  begrunnelseArbeidstakerLabel: "Begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverLabel: "Begrunnelse til nærmeste leder",
  send: "Send avlysning",
  avbryt: "Avbryt",
  alert:
    "Hvis årsaken til avlysning er at arbeidstakeren ikke møtte opp, bør du vurdere om sykepengene skal stanses.",
  forhandsvisningTitle: "Avlysning av dialogmøte",
  forhandsvisningArbeidstakerSubtitle: "(brev til arbeidstakeren)",
  forhandsvisningArbeidsgiverSubtitle: "(brev til nærmeste leder)",
  forhandsvisningArbeidstakerContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidsgiver",
};

interface AvlysDialogmoteSkjemaProps {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

export interface AvlysDialogmoteSkjemaValues {
  begrunnelseArbeidstaker: string;
  begrunnelseArbeidsgiver: string;
}

const AvlysPanel = styled(Panel)`
  padding: 1.75rem;
`;

const SendButton = styled(TrackedHovedknapp)`
  margin-right: 0.5rem;
`;

const AvlysningAlertStripe = styled(AlertstripeFullbredde)`
  margin-bottom: 4em;
`;

const AvlysDialogmoteSkjema = ({
  dialogmote,
  pageTitle,
}: AvlysDialogmoteSkjemaProps): ReactElement => {
  const dispatch = useDispatch();
  const fnr = useValgtPersonident();
  const { avlyserMote, avlysMoteFeil } = useAppSelector(
    (state) => state.dialogmote
  );
  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();
  const [
    displayAvlysningArbeidstakerPreview,
    setDisplayAvlysningArbeidstakerPreview,
  ] = useState(false);
  const [
    displayAvlysningArbeidsgiverPreview,
    setDisplayAvlysningArbeidsgiverPreview,
  ] = useState(false);
  const {
    generateAvlysningArbeidstakerDocument,
    generateAvlysningArbeidsgiverDocument,
  } = useForhandsvisAvlysning(dialogmote);

  const validate = (
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): Partial<AvlysDialogmoteSkjemaValues> => {
    const feil = validerBegrunnelser({
      ...values,
    });
    updateFeilUtbedret(feil);

    return feil;
  };

  const submit = (values: AvlysDialogmoteSkjemaValues) => {
    dispatch(
      avlysMote(dialogmote.uuid, fnr, {
        arbeidstaker: {
          begrunnelse: values.begrunnelseArbeidstaker,
          avlysning: generateAvlysningArbeidstakerDocument(values),
        },
        arbeidsgiver: {
          begrunnelse: values.begrunnelseArbeidsgiver,
          avlysning: generateAvlysningArbeidsgiverDocument(values),
        },
      })
    );
  };

  return (
    <AvlysPanel>
      <Form initialValues={{}} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors, values }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteInfo dialogmote={dialogmote} />
            <AvlysDialogmoteBegrunnelse
              fieldName="begrunnelseArbeidstaker"
              label={texts.begrunnelseArbeidstakerLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidstakerPreview(true)
              }
            />
            <Forhandsvisning
              title={texts.forhandsvisningTitle}
              subtitle={texts.forhandsvisningArbeidstakerSubtitle}
              contentLabel={texts.forhandsvisningArbeidstakerContentlabel}
              isOpen={displayAvlysningArbeidstakerPreview}
              handleClose={() => setDisplayAvlysningArbeidstakerPreview(false)}
              getDocumentComponents={() =>
                generateAvlysningArbeidstakerDocument(values)
              }
            />
            <AvlysDialogmoteBegrunnelse
              fieldName="begrunnelseArbeidsgiver"
              label={texts.begrunnelseArbeidsgiverLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidsgiverPreview(true)
              }
            />
            <Forhandsvisning
              title={texts.forhandsvisningTitle}
              subtitle={texts.forhandsvisningArbeidsgiverSubtitle}
              contentLabel={texts.forhandsvisningArbeidsgiverContentlabel}
              isOpen={displayAvlysningArbeidsgiverPreview}
              handleClose={() => setDisplayAvlysningArbeidsgiverPreview(false)}
              getDocumentComponents={() =>
                generateAvlysningArbeidsgiverDocument(values)
              }
            />
            {avlysMoteFeil && (
              <FlexRow bottomPadding={PaddingSize.MD}>
                <AlertStripeFeil>
                  {avlysMoteFeil.defaultErrorMsg}
                </AlertStripeFeil>
              </FlexRow>
            )}
            <AvlysningAlertStripe type="advarsel">
              {texts.alert}
            </AvlysningAlertStripe>
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <SendButton
                data-cy="sendAvlysningKnapp"
                context={pageTitle}
                onClick={resetFeilUtbedret}
                htmlType="submit"
                spinner={avlyserMote}
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
    </AvlysPanel>
  );
};

export default AvlysDialogmoteSkjema;
