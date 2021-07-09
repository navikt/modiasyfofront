import { call, put, takeEvery } from "redux-saga/effects";
import {
  avlyserMote,
  AvlysMoteAction,
  avlysMoteFeilet,
  avlysMoteFullfort,
  DialogmoteActionTypes,
  endrerTidSted,
  EndreTidStedAction,
  endreTidStedFeilet,
  endreTidStedFullfort,
  ferdigstillerMote,
  FerdigstillMoteAction,
  ferdigstillMoteFeilet,
  ferdigstillMoteFullfort,
  FetchDialogmoteAction,
  fetchDialogmoteFailed,
  fetchDialogmoteSuccess,
  oppretterInnkalling,
  OpprettInnkallingAction,
  opprettInnkallingFeilet,
  opprettInnkallingFullfort,
} from "./dialogmote_actions";
import { get, post, Result, Success } from "../../api/api";
import {
  AvlysDialogmoteDTO,
  DialogmoteDTO,
  DialogmoteInnkallingDTO,
  EndreTidStedDialogmoteDTO,
} from "./types/dialogmoteTypes";
import { NewDialogmoteReferatDTO } from "./types/dialogmoteReferatTypes";

function* opprettInnkalling(action: OpprettInnkallingAction) {
  yield put(oppretterInnkalling());
  const path = `${process.env.REACT_APP_ISDIALOGMOTE_ROOT}/post/v1/dialogmote/personident`;
  const result: Result<DialogmoteInnkallingDTO> = yield call(
    post,
    path,
    action.data,
    action.fnr
  );

  if (result instanceof Success) {
    yield put(opprettInnkallingFullfort());
    window.location.href = `/sykefravaer/moteoversikt`;
  } else {
    yield put(opprettInnkallingFeilet(result.error));
  }
}

function* fetchDialogmoteSaga(action: FetchDialogmoteAction) {
  const path = `${process.env.REACT_APP_ISDIALOGMOTE_ROOT}/get/v1/dialogmote/personident`;
  const result: Result<DialogmoteDTO[]> = yield call(get, path, action.fnr);
  if (result instanceof Success) {
    yield put(fetchDialogmoteSuccess(result.data));
  } else {
    yield put(fetchDialogmoteFailed(result.error));
  }
}

function* avlysDialogmote(action: AvlysMoteAction) {
  yield put(avlyserMote());
  const path = `${process.env.REACT_APP_ISDIALOGMOTE_ROOT}/post/v1/dialogmote/${action.moteUuid}/avlys`;
  const result: Result<AvlysDialogmoteDTO> = yield call(
    post,
    path,
    action.data
  );

  if (result instanceof Success) {
    yield put(avlysMoteFullfort());
    window.location.href = `/sykefravaer/moteoversikt`;
  } else {
    yield put(avlysMoteFeilet(result.error));
  }
}

function* endreTidStedDialogmote(action: EndreTidStedAction) {
  yield put(endrerTidSted());
  const path = `${process.env.REACT_APP_ISDIALOGMOTE_ROOT}/post/v1/dialogmote/${action.moteUuid}/tidsted`;
  const result: Result<EndreTidStedDialogmoteDTO> = yield call(
    post,
    path,
    action.data
  );

  if (result instanceof Success) {
    yield put(endreTidStedFullfort());
    window.location.href = `/sykefravaer/moteoversikt`;
  } else {
    yield put(endreTidStedFeilet(result.error));
  }
}

function* ferdigstillDialogmote(action: FerdigstillMoteAction) {
  yield put(ferdigstillerMote());
  const path = `${process.env.REACT_APP_ISDIALOGMOTE_ROOT}/post/v1/dialogmote/${action.moteUuid}/ferdigstill`;
  const result: Result<NewDialogmoteReferatDTO> = yield call(
    post,
    path,
    action.data
  );

  if (result instanceof Success) {
    yield put(ferdigstillMoteFullfort());
    window.location.href = `/sykefravaer/moteoversikt`;
  } else {
    yield put(ferdigstillMoteFeilet(result.error));
  }
}

export default function* dialogmoteSagas() {
  yield takeEvery(
    DialogmoteActionTypes.OPPRETT_INNKALLING_FORESPURT,
    opprettInnkalling
  );
  yield takeEvery(DialogmoteActionTypes.FETCH_DIALOGMOTE, fetchDialogmoteSaga);
  yield takeEvery(DialogmoteActionTypes.AVLYS_MOTE_FORESPURT, avlysDialogmote);
  yield takeEvery(
    DialogmoteActionTypes.ENDRE_TID_STED_FORESPURT,
    endreTidStedDialogmote
  );
  yield takeEvery(
    DialogmoteActionTypes.FERDIGSTILL_MOTE_FORESPURT,
    ferdigstillDialogmote
  );
}
