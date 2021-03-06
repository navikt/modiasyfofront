import { call, fork, put, select, takeEvery } from "redux-saga/effects";
import { get } from "../../api";
import * as actions from "./diskresjonskode_actions";

export function* hentDiskresjonskodeSaga(action: any) {
  yield put(actions.henterDiskresjonskode());
  try {
    const path = `${process.env.REACT_APP_SYFOPERSON_ROOT}/person/diskresjonskode`;
    const data = yield call(get, path, action.fnr);
    yield put(actions.diskresjonskodeHentet(data));
  } catch (e) {
    yield put(actions.hentDiskresjonskodeFeilet());
  }
}

export const skalHenteDiskresjonskode = (state: any) => {
  const reducer = state.diskresjonskode;
  return !(reducer.henter || reducer.hentet || reducer.hentingFeilet);
};

export function* hentDiskresjonskodeHvisIkkeHentet(action: any) {
  const skalHente = yield select(skalHenteDiskresjonskode);
  if (skalHente) {
    yield hentDiskresjonskodeSaga(action);
  }
}

function* watchHentDiskresjonskode() {
  yield takeEvery(
    actions.HENT_DISKRESJONSKODE_FORESPURT,
    hentDiskresjonskodeHvisIkkeHentet
  );
}

export default function* diskresjonskodeSagas() {
  yield fork(watchHentDiskresjonskode);
}
