import { Reducer } from "redux";
import { DialogmoteActions, DialogmoteActionTypes } from "./dialogmote_actions";
import { DialogmoteDTO } from "./types/dialogmoteTypes";
import { ApiError } from "../../api/api";

export interface DialogmoteState {
  senderInnkalling: boolean;
  sendInnkallingFeil: ApiError | null;
  sendInnkallingFullfort: boolean;
  henterMote: boolean;
  henterMoteFeil: ApiError | null;
  henterMoteForsokt: boolean;
  moterHentet: boolean;
  dialogmoter: DialogmoteDTO[];
  avlyserMote: boolean;
  avlysMoteFeil: ApiError | null;
  avlysMoteFullfort: boolean;
  endrerTidSted: boolean;
  endreTidStedFeil: ApiError | null;
  endreTidStedFullfort: boolean;
  ferdigstillerMote: boolean;
  ferdigstillMoteFeil: ApiError | null;
  ferdigstillMoteFullfort: boolean;
}

export const initialState: DialogmoteState = {
  senderInnkalling: false,
  sendInnkallingFeil: null,
  sendInnkallingFullfort: false,
  avlysMoteFeil: null,
  avlyserMote: false,
  avlysMoteFullfort: false,
  endrerTidSted: false,
  endreTidStedFeil: null,
  endreTidStedFullfort: false,
  ferdigstillerMote: false,
  ferdigstillMoteFeil: null,
  ferdigstillMoteFullfort: false,
  henterMote: false,
  henterMoteFeil: null,
  henterMoteForsokt: false,
  moterHentet: false,
  dialogmoter: [],
};

const dialogmote: Reducer<DialogmoteState, DialogmoteActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case DialogmoteActionTypes.OPPRETTER_INNKALLING: {
      return {
        ...state,
        senderInnkalling: true,
      };
    }
    case DialogmoteActionTypes.OPPRETT_INNKALLING_FULLFORT: {
      return {
        ...state,
        senderInnkalling: false,
        sendInnkallingFullfort: true,
      };
    }
    case DialogmoteActionTypes.OPPRETT_INNKALLING_FEILET: {
      return {
        ...state,
        senderInnkalling: false,
        sendInnkallingFullfort: false,
        sendInnkallingFeil: action.error,
      };
    }
    case DialogmoteActionTypes.AVLYSER_MOTE: {
      return {
        ...state,
        avlyserMote: true,
      };
    }
    case DialogmoteActionTypes.AVLYS_MOTE_FULLFORT: {
      return {
        ...state,
        avlyserMote: false,
        avlysMoteFullfort: true,
      };
    }
    case DialogmoteActionTypes.AVLYS_MOTE_FEILET: {
      return {
        ...state,
        avlyserMote: false,
        avlysMoteFullfort: false,
        avlysMoteFeil: action.error,
      };
    }
    case DialogmoteActionTypes.FERDIGSTILLER_MOTE: {
      return {
        ...state,
        ferdigstillerMote: true,
      };
    }
    case DialogmoteActionTypes.FERDIGSTILL_MOTE_FULLFORT: {
      return {
        ...state,
        ferdigstillerMote: false,
        ferdigstillMoteFullfort: true,
      };
    }
    case DialogmoteActionTypes.FERDIGSTILL_MOTE_FEILET: {
      return {
        ...state,
        ferdigstillerMote: false,
        ferdigstillMoteFullfort: false,
        ferdigstillMoteFeil: action.error,
      };
    }
    case DialogmoteActionTypes.FETCH_DIALOGMOTE: {
      return {
        ...state,
        henterMote: true,
        henterMoteFeil: null,
        henterMoteForsokt: false,
      };
    }
    case DialogmoteActionTypes.FETCH_DIALOGMOTE_SUCCESS: {
      return {
        ...state,
        henterMote: false,
        henterMoteFeil: null,
        henterMoteForsokt: true,
        dialogmoter: action.dialogmoteDtoList,
        moterHentet: true,
      };
    }
    case DialogmoteActionTypes.FETCH_DIALOGMOTE_FAILED: {
      return {
        ...state,
        henterMote: false,
        henterMoteForsokt: true,
        henterMoteFeil: action.error,
        dialogmoter: initialState.dialogmoter,
      };
    }
    case DialogmoteActionTypes.ENDRER_TID_STED: {
      return {
        ...state,
        endrerTidSted: true,
      };
    }
    case DialogmoteActionTypes.ENDRE_TID_STED_FEILET: {
      return {
        ...state,
        endrerTidSted: false,
        endreTidStedFullfort: false,
        endreTidStedFeilet: true,
        endreTidStedFeil: action.error,
      };
    }
    case DialogmoteActionTypes.ENDRE_TID_STED_FULLFORT: {
      return {
        ...state,
        endrerTidSted: false,
        endreTidStedFullfort: true,
      };
    }
    default: {
      return state;
    }
  }
};

export default dialogmote;
