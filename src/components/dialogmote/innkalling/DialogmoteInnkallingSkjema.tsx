import React, { ReactElement } from "react";
import Panel from "nav-frontend-paneler";
import DialogmoteInnkallingVelgArbeidsgiver from "./DialogmoteInnkallingVelgArbeidsgiver";
import DialogmoteTidOgSted from "../DialogmoteTidOgSted";
import DialogmoteInnkallingTekster from "./DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import {
  validerArbeidsgiver,
  validerInnkallingFritekster,
  validerSted,
  validerTidspunkt,
} from "../../../utils/valideringUtils";
import { opprettInnkalling } from "../../../data/dialogmote/dialogmote_actions";
import { useDispatch } from "react-redux";
import { DialogmoteInnkallingDTO } from "../../../data/dialogmote/types/dialogmoteTypes";
import { genererDato } from "../../mote/utils";
import { Link } from "react-router-dom";
import { useNavEnhet } from "../../../hooks/useNavEnhet";
import { AlertStripeFeil } from "nav-frontend-alertstriper";
import { useAppSelector } from "../../../hooks/hooks";
import { useValgtPersonident } from "../../../hooks/useValgtBruker";
import { FlexRow, PaddingSize } from "../../Layout";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "../../../hooks/useFeilUtbedret";
import { TrackedFlatknapp } from "../../buttons/TrackedFlatknapp";
import { TrackedHovedknapp } from "../../buttons/TrackedHovedknapp";
import {
  ForhandsvisInnkallingGenerator,
  useForhandsvisInnkalling,
} from "../../../hooks/dialogmote/useForhandsvisInnkalling";

export interface DialogmoteInnkallingSkjemaValues {
  arbeidsgiver: string;
  klokkeslett: string;
  dato: string;
  sted: string;
  videoLink?: string;
  fritekstArbeidsgiver?: string;
  fritekstArbeidstaker?: string;
}

interface DialogmoteInnkallingSkjemaProps {
  pageTitle: string;
}

type DialogmoteInnkallingSkjemaFeil = Partial<
  Pick<
    DialogmoteInnkallingSkjemaValues,
    "arbeidsgiver" | "sted" | "klokkeslett" | "dato"
  >
>;

const texts = {
  send: "Send innkallingene",
  cancel: "Avbryt",
};

const toInnkalling = (
  values: DialogmoteInnkallingSkjemaValues,
  fnr: string,
  navEnhet: string,
  innkallingDocumentGenerator: ForhandsvisInnkallingGenerator
): DialogmoteInnkallingDTO => ({
  tildeltEnhet: navEnhet,
  arbeidsgiver: {
    virksomhetsnummer: values.arbeidsgiver,
    fritekstInnkalling: values.fritekstArbeidsgiver,
    innkalling: innkallingDocumentGenerator.generateArbeidsgiverInnkallingDocument(
      values
    ),
  },
  arbeidstaker: {
    personIdent: fnr,
    fritekstInnkalling: values.fritekstArbeidstaker,
    innkalling: innkallingDocumentGenerator.generateArbeidstakerInnkallingDocument(
      values
    ),
  },
  tidSted: {
    sted: values.sted,
    videoLink: values.videoLink,
    tid: genererDato(values.dato, values.klokkeslett),
  },
});

const DialogmoteInnkallingSkjema = ({
  pageTitle,
}: DialogmoteInnkallingSkjemaProps): ReactElement => {
  const initialValues: Partial<DialogmoteInnkallingSkjemaValues> = {};
  const dispatch = useDispatch();
  const fnr = useValgtPersonident();
  const navEnhet = useNavEnhet();
  const { senderInnkalling, sendInnkallingFeil } = useAppSelector(
    (state) => state.dialogmote
  );
  const {
    feilUtbedret,
    resetFeilUtbedret,
    updateFeilUtbedret,
  } = useFeilUtbedret();
  const innkallingDocumentGenerator = useForhandsvisInnkalling();

  const validate = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DialogmoteInnkallingSkjemaFeil => {
    const feilmeldinger: DialogmoteInnkallingSkjemaFeil = {
      arbeidsgiver: validerArbeidsgiver(values.arbeidsgiver),
      ...validerTidspunkt({
        dato: values.dato,
        klokkeslett: values.klokkeslett,
      }),
      sted: validerSted(values.sted),
      ...validerInnkallingFritekster({
        fritekstArbeidstaker: values.fritekstArbeidstaker,
        fritekstArbeidsgiver: values.fritekstArbeidsgiver,
      }),
    };

    updateFeilUtbedret(feilmeldinger);

    return feilmeldinger;
  };

  const submit = (values: DialogmoteInnkallingSkjemaValues) => {
    const dialogmoteInnkalling = toInnkalling(
      values,
      fnr,
      navEnhet,
      innkallingDocumentGenerator
    );
    dispatch(opprettInnkalling(fnr, dialogmoteInnkalling));
  };

  return (
    <Panel>
      <Form initialValues={initialValues} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteInnkallingVelgArbeidsgiver />
            <DialogmoteTidOgSted />
            <DialogmoteInnkallingTekster />
            {sendInnkallingFeil && (
              <FlexRow bottomPadding={PaddingSize.MD}>
                <AlertStripeFeil>
                  {sendInnkallingFeil.defaultErrorMsg}
                </AlertStripeFeil>
              </FlexRow>
            )}
            {submitFailed && !feilUtbedret && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <TrackedHovedknapp
                context={pageTitle}
                onClick={resetFeilUtbedret}
                spinner={senderInnkalling}
                autoDisableVedSpinner
                htmlType="submit"
              >
                {texts.send}
              </TrackedHovedknapp>
              <Link to={`/sykefravaer/moteoversikt`}>
                <TrackedFlatknapp context={pageTitle} htmlType="button">
                  {texts.cancel}
                </TrackedFlatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </Panel>
  );
};

export default DialogmoteInnkallingSkjema;
