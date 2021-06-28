const express = require("express");
let router = express.Router();
const { initialize, Strategy } = require("unleash-client");

class ByEnhetAndEnvironment extends Strategy {
  constructor() {
    super("byEnhetAndEnvironment");
  }

  isEnabled(parameters, context) {
    const valgtEnhetMatches =
      parameters.valgtEnhet.indexOf(context.valgtEnhet) !== -1;
    const environmentEnabled =
      parameters.tilgjengeligIProd === "true"
        ? true
        : process.env.NAIS_CONTEXT === "dev";

    return valgtEnhetMatches && environmentEnabled;
  }
}

class ByUserId extends Strategy {
  constructor() {
    super("byUserId");
  }

  isEnabled(parameters, context) {
    return parameters.user.indexOf(context.user) !== -1;
  }
}

const unleash = initialize({
  url: "https://unleash.nais.io/api/",
  appName: "syfomodiaperson",
  environment: process.env.NAIS_CONTEXT,
  strategies: [new ByEnhetAndEnvironment(), new ByUserId()],
});

router.get("/dm2/", function (req, res) {
  const isEnabled = unleash.isEnabled("syfo.syfomodiaperson.dm2", {
    valgtEnhet: req.query.valgtEnhet,
    user: req.query.userId,
  });

  res.status(200).send(isEnabled);
});

module.exports = router;
