interface Pasientforhold {
  fom: Date;
  tom: Date;
}

interface Adresse {
  adresse?: string;
  postnummer?: string;
  poststed?: string;
}

interface Fastlegekontor {
  navn?: string;
  besoeksadresse?: Adresse;
  postadresse?: Adresse;
  telefon?: string;
  epost?: string;
  orgnummer?: string;
}

interface Pasient {
  fornavn?: string;
  mellomnavn?: string;
  etternavn?: string;
  fnr?: string;
}

export interface Fastlege {
  fornavn?: string;
  mellomnavn?: string;
  etternavn?: string;
  fnr?: string;
  herId?: number;
  helsepersonellregisterId?: string;
  pasient?: Pasient;
  fastlegekontor?: Fastlegekontor;
  pasientforhold: Pasientforhold;
}
