const initiellState = {
    henter: false,
    hentingFeilet: false,
    ikkeTilgang: false,
    data: [],
};

export default function sykmeldinger(state = initiellState, action) {
    switch (action.type) {
        case 'HENT_SYKMELDINGER_FEILET': {
            return Object.assign({}, state, {
                data: [],
                henter: false,
                hentingFeilet: true,
            });
        }
        case 'HENTER_SYKMELDINGER': {
            return {
                data: [],
                henter: true,
                hentingFeilet: false,
            };
        }
        case 'SYKMELDINGER_HENTET': {
            return {
                henter: false,
                hentingFeilet: false,
                data: action.data,
            };
        }
        case 'HENT_SYKMELDINGER_IKKE_TILGANG': {
            return Object.assign({}, state, {
                data: [],
                henter: false,
                hentingFeilet: false,
                ikkeTilgang: true,
            });
        }
        default: {
            return state;
        }
    }
}
