import {
  AvlysDialogmoteDTO,
  DialogmoteDTO,
  DialogmoteInnkallingDTO,
  EndreTidStedDialogmoteDTO,
} from "./types/dialogmoteTypes";
import { NewDialogmoteReferatDTO } from "./types/dialogmoteReferatTypes";
import { ApiError } from "../../api/api";

export enum DialogmoteActionTypes {
  OPPRETT_INNKALLING_FORESPURT = "OPPRETT_INNKALLING_FORESPURT",
  OPPRETTER_INNKALLING = "OPPRETTER_INNKALLING",
  OPPRETT_INNKALLING_FEILET = "OPPRETT_INNKALLING_FEILET",
  OPPRETT_INNKALLING_FULLFORT = "OPPRETT_INNKALLING_FULLFORT",
  FETCH_DIALOGMOTE = "FETCH_DIALOGMOTE",
  FETCH_DIALOGMOTE_FAILED = "FETCH_DIALOGMOTE_FAILED",
  FETCH_DIALOGMOTE_SUCCESS = "FETCH_DIALOGMOTE_SUCCESS",
  AVLYS_MOTE_FORESPURT = "AVLYS_MOTE_FORESPURT",
  AVLYSER_MOTE = "AVLYSER_MOTE",
  AVLYS_MOTE_FEILET = "AVLYS_MOTE_FEILET",
  AVLYS_MOTE_FULLFORT = "AVLYS_MOTE_FULLFORT",
  ENDRE_TID_STED_FORESPURT = "ENDRE_TID_STED_FORESPURT",
  ENDRER_TID_STED = "ENDRE_TID_STED",
  ENDRE_TID_STED_FEILET = "ENDRE_TID_STED_FEILET",
  ENDRE_TID_STED_FULLFORT = "ENDRE_TID_STED_FULLFORT",
  FERDIGSTILL_MOTE_FORESPURT = "FERDIGSTILL_MOTE_FORESPURT",
  FERDIGSTILLER_MOTE = "FERDIGSTILLER_MOTE",
  FERDIGSTILL_MOTE_FEILET = "FERDIGSTILL_MOTE_FEILET",
  FERDIGSTILL_MOTE_FULLFORT = "FERDIGSTILL_MOTE_FULLFORT",
}

export interface OpprettInnkallingAction {
  type: DialogmoteActionTypes.OPPRETT_INNKALLING_FORESPURT;
  fnr: string;
  data: DialogmoteInnkallingDTO;
}

export interface OppretterInnkallingAction {
  type: DialogmoteActionTypes.OPPRETTER_INNKALLING;
}

export interface OpprettInnkallingFeiletAction {
  type: DialogmoteActionTypes.OPPRETT_INNKALLING_FEILET;
  error: ApiError;
}

export interface OpprettInnkallingFullfortAction {
  type: DialogmoteActionTypes.OPPRETT_INNKALLING_FULLFORT;
}

export interface FetchDialogmoteAction {
  type: DialogmoteActionTypes.FETCH_DIALOGMOTE;
  fnr: string;
}

export interface FetchDialogmoteFailedAction {
  type: DialogmoteActionTypes.FETCH_DIALOGMOTE_FAILED;
  error: ApiError;
}

export interface FetchDialogmoteSuccessAction {
  type: DialogmoteActionTypes.FETCH_DIALOGMOTE_SUCCESS;
  dialogmoteDtoList: DialogmoteDTO[];
}

export interface AvlysMoteAction {
  type: DialogmoteActionTypes.AVLYS_MOTE_FORESPURT;
  fnr: string;
  moteUuid: string;
  data: AvlysDialogmoteDTO;
}

export interface AvlyserMoteAction {
  type: DialogmoteActionTypes.AVLYSER_MOTE;
}

export interface AvlysMoteFeiletAction {
  type: DialogmoteActionTypes.AVLYS_MOTE_FEILET;
  error: ApiError;
}

export interface AvlysMoteFullfortAction {
  type: DialogmoteActionTypes.AVLYS_MOTE_FULLFORT;
}

export interface EndreTidStedAction {
  type: DialogmoteActionTypes.ENDRE_TID_STED_FORESPURT;
  fnr: string;
  moteUuid: string;
  data: EndreTidStedDialogmoteDTO;
}

export interface EndrerTidStedAction {
  type: DialogmoteActionTypes.ENDRER_TID_STED;
}

export interface EndreTidStedFeiletAction {
  type: DialogmoteActionTypes.ENDRE_TID_STED_FEILET;
  error: ApiError;
}

export interface EndreTidStedFullfortAction {
  type: DialogmoteActionTypes.ENDRE_TID_STED_FULLFORT;
}

export interface FerdigstillMoteAction {
  type: DialogmoteActionTypes.FERDIGSTILL_MOTE_FORESPURT;
  fnr: string;
  moteUuid: string;
  data: NewDialogmoteReferatDTO;
}

export interface FerdigstillerMoteAction {
  type: DialogmoteActionTypes.FERDIGSTILLER_MOTE;
}

export interface FerdigstillMoteFeiletAction {
  type: DialogmoteActionTypes.FERDIGSTILL_MOTE_FEILET;
  error: ApiError;
}

export interface FerdigstillMoteFullfortAction {
  type: DialogmoteActionTypes.FERDIGSTILL_MOTE_FULLFORT;
}

export type DialogmoteActions =
  | OpprettInnkallingAction
  | OppretterInnkallingAction
  | OpprettInnkallingFeiletAction
  | OpprettInnkallingFullfortAction
  | FetchDialogmoteAction
  | FetchDialogmoteFailedAction
  | FetchDialogmoteSuccessAction
  | AvlysMoteAction
  | AvlyserMoteAction
  | AvlysMoteFeiletAction
  | AvlysMoteFullfortAction
  | EndreTidStedAction
  | EndrerTidStedAction
  | EndreTidStedFeiletAction
  | EndreTidStedFullfortAction
  | FerdigstillMoteAction
  | FerdigstillerMoteAction
  | FerdigstillMoteFeiletAction
  | FerdigstillMoteFullfortAction;

export const opprettInnkalling = (
  fnr: string,
  data: DialogmoteInnkallingDTO
): OpprettInnkallingAction => ({
  type: DialogmoteActionTypes.OPPRETT_INNKALLING_FORESPURT,
  fnr,
  data,
});

export const oppretterInnkalling = (): OppretterInnkallingAction => ({
  type: DialogmoteActionTypes.OPPRETTER_INNKALLING,
});

export const opprettInnkallingFeilet = (
  error: ApiError
): OpprettInnkallingFeiletAction => ({
  type: DialogmoteActionTypes.OPPRETT_INNKALLING_FEILET,
  error,
});

export const opprettInnkallingFullfort = (): OpprettInnkallingFullfortAction => ({
  type: DialogmoteActionTypes.OPPRETT_INNKALLING_FULLFORT,
});

export const fetchDialogmote = (fnr: string): FetchDialogmoteAction => ({
  type: DialogmoteActionTypes.FETCH_DIALOGMOTE,
  fnr,
});
export const fetchDialogmoteFailed = (
  error: ApiError
): FetchDialogmoteFailedAction => ({
  type: DialogmoteActionTypes.FETCH_DIALOGMOTE_FAILED,
  error,
});
export const fetchDialogmoteSuccess = (
  dialogmoteDtoList: DialogmoteDTO[]
): FetchDialogmoteSuccessAction => ({
  type: DialogmoteActionTypes.FETCH_DIALOGMOTE_SUCCESS,
  dialogmoteDtoList,
});

export const avlysMote = (
  moteUuid: string,
  fnr: string,
  data: AvlysDialogmoteDTO
): AvlysMoteAction => ({
  type: DialogmoteActionTypes.AVLYS_MOTE_FORESPURT,
  fnr,
  moteUuid,
  data,
});

export const avlyserMote = (): AvlyserMoteAction => ({
  type: DialogmoteActionTypes.AVLYSER_MOTE,
});

export const avlysMoteFeilet = (error: ApiError): AvlysMoteFeiletAction => ({
  type: DialogmoteActionTypes.AVLYS_MOTE_FEILET,
  error,
});

export const avlysMoteFullfort = (): AvlysMoteFullfortAction => ({
  type: DialogmoteActionTypes.AVLYS_MOTE_FULLFORT,
});

export const endreTidSted = (
  moteUuid: string,
  fnr: string,
  data: EndreTidStedDialogmoteDTO
): EndreTidStedAction => ({
  type: DialogmoteActionTypes.ENDRE_TID_STED_FORESPURT,
  fnr,
  moteUuid,
  data,
});

export const endrerTidSted = (): EndrerTidStedAction => ({
  type: DialogmoteActionTypes.ENDRER_TID_STED,
});

export const endreTidStedFeilet = (
  error: ApiError
): EndreTidStedFeiletAction => ({
  type: DialogmoteActionTypes.ENDRE_TID_STED_FEILET,
  error,
});

export const endreTidStedFullfort = (): EndreTidStedFullfortAction => ({
  type: DialogmoteActionTypes.ENDRE_TID_STED_FULLFORT,
});

export const ferdigstillMote = (
  moteUuid: string,
  fnr: string,
  data: NewDialogmoteReferatDTO
): FerdigstillMoteAction => ({
  type: DialogmoteActionTypes.FERDIGSTILL_MOTE_FORESPURT,
  fnr,
  moteUuid,
  data,
});

export const ferdigstillerMote = (): FerdigstillerMoteAction => ({
  type: DialogmoteActionTypes.FERDIGSTILLER_MOTE,
});

export const ferdigstillMoteFeilet = (
  error: ApiError
): FerdigstillMoteFeiletAction => ({
  type: DialogmoteActionTypes.FERDIGSTILL_MOTE_FEILET,
  error,
});

export const ferdigstillMoteFullfort = (): FerdigstillMoteFullfortAction => ({
  type: DialogmoteActionTypes.FERDIGSTILL_MOTE_FULLFORT,
});
