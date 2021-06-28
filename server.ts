import path from "path";

const express = require("express");
const prometheus = require("prom-client");
const proxy = require("express-http-proxy");
const cookieParser = require("cookie-parser");
const axios = require("axios");

// Prometheus metrics
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["route"],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
});
const server = express();

server.use(express.json());

const modiacontextholderUrl =
  process.env.NAIS_CONTEXT === "dev"
    ? "modiacontextholder.q0"
    : "modiacontextholder.default";

const flexInternGatewayUrl =
  process.env.NAIS_CONTEXT === "dev"
    ? "flex-intern-gateway.dev.intern.nav.no"
    : "flex-intern-gateway.intern.nav.no";

const syfopersonHost =
  process.env.NAIS_CONTEXT === "dev"
    ? "https://syfoperson.dev.intern.nav.no"
    : "https://syfoperson.intern.nav.no";

const isdialogmoteHost =
  process.env.NAIS_CONTEXT === "dev"
    ? "isdialogmote.dev.intern.nav.no"
    : "isdialogmote.intern.nav.no";

const syfoveilederHost =
  process.env.NAIS_CONTEXT === "dev"
    ? "https://syfoveileder.dev.intern.nav.no"
    : "https://syfoveileder.intern.nav.no";

const syfooppfolgingsplanserviceHost =
  process.env.NAIS_CONTEXT === "dev"
    ? "https://syfooppfolgingsplanservice.dev.intern.nav.no"
    : "https://syfooppfolgingsplanservice.intern.nav.no";

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

const DIST_DIR = path.join(__dirname, "dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

server.use("/static", express.static(DIST_DIR));

const unleashRoutes = require("./server/routes/unleashRoutes");
server.use("/isenabled", unleashRoutes);

server.get(
  ["/", "/sykefravaer", "/sykefravaer/*", /^\/sykefravaer\/(?!(resources)).*$/],
  nocache,
  (req, res) => {
    res.sendFile(HTML_FILE);
    httpRequestDurationMicroseconds.labels(req.route.path).observe(10);
  }
);

server.get("/actuator/metrics", (req, res) => {
  res.set("Content-Type", prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});

server.get("/health/isAlive", (req, res) => {
  res.sendStatus(200);
});

server.get("/health/isReady", (req, res) => {
  res.sendStatus(200);
});

server.use(
  "/fastlegerest/api",
  proxy("fastlegerest.teamsykefravr", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/fastlegerest/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for fastlegerest", err.message);
      next(err);
    },
  })
);

server.use(
  "/ispersonoppgave/api",
  proxy("ispersonoppgave.teamsykefravr", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/api${req.path}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for ispersonoppgave", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfo-tilgangskontroll/api",
  proxy("syfo-tilgangskontroll.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfo-tilgangskontroll/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for tilgang", err.message);
      next(err);
    },
  })
);

server.use(
  "/modiacontextholder/api",
  proxy(modiacontextholderUrl, {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/modiacontextholder/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for modiacontextholder", err.message);
      next(err);
    },
  })
);

server.use(
  "/isdialogmote/api/get",
  cookieParser(),
  proxy(isdialogmoteHost, {
    https: true,
    parseReqBody: false,
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      const token = srcReq.cookies["isso-idtoken"];
      proxyReqOpts.headers["Authorization"] = `Bearer ${token}`;
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    proxyReqPathResolver: function (req) {
      return `/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.log("Error in proxy for isdialogmote", err.message);
      next(err);
    },
  })
);

server.use(
  "/isdialogmote/api/post",
  cookieParser(),
  proxy(isdialogmoteHost, {
    https: true,
    parseReqBody: true,
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
      const token = srcReq.cookies["isso-idtoken"];
      proxyReqOpts.headers["Authorization"] = `Bearer ${token}`;
      return proxyReqOpts;
    },
    proxyReqPathResolver: function (req) {
      return `/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.log("Error in proxy for isdialogmote", err.message);
      next(err);
    },
  })
);

server.use(
  "/modiasyforest/api",
  proxy("modiasyforest.teamsykefravr", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/modiasyforest/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for modiasyforest", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfooppfolgingsplanservice/api",
  proxy(syfooppfolgingsplanserviceHost, {
    proxyReqPathResolver: function (req) {
      return `/syfooppfolgingsplanservice/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error(
        "Error in proxy for syfooppfolgingsplanservice",
        err.message
      );
      next(err);
    },
  })
);

server.use(
  "/syfomoteadmin/api",
  proxy("syfomoteadmin.teamsykefravr", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfomoteadmin/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfomoteadmin", err.message);
      next(err);
    },
  })
);

server.use("/veileder/vedtak", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  const url = `https://${flexInternGatewayUrl}/spinnsyn-backend/api/v1/veileder/vedtak?fnr=${fnr}`;
  axios
    .get(url, options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error("Error in proxy for spinnsyn-backend", err.message);
      res.sendStatus(err.response.status);
    });
});

server.use(
  "/syfomotebehov/api",
  proxy("syfomotebehov.default", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfomotebehov/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfomotebehov", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfosoknad/api",
  proxy("syfosoknad.flex", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/syfosoknad/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfosoknad", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfobehandlendeenhet/api",
  proxy("syfobehandlendeenhet.teamsykefravr", {
    https: false,
    proxyReqPathResolver: function (req) {
      return `/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfobehandlendeenhet", err.message);
      next(err);
    },
  })
);

server.use(
  "/syfoperson/api",
  proxy(syfopersonHost, {
    proxyReqPathResolver: function (req) {
      return `/syfoperson/api${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfoperson", err.message);
      next(err);
    },
  })
);

server.use("/syfosmregister/api", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  const url =
    "http://syfosmregister.teamsykmelding/api/v1/internal/sykmeldinger";
  axios
    .get(url, options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.error("Error in proxy for syfosmregister", err.message);
      res.sendStatus(err.response.status);
    });
});

server.use("/ispengestopp/api/v1/person/status", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const fnr = req.query.fnr;
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      fnr,
    },
  };

  axios
    .get(`http://ispengestopp.teamsykefravr/api/v1/person/status`, options)
    .then((response) => {
      if (response.status === 204) {
        res.sendStatus(204);
      } else {
        res.send(response.data);
      }
    })
    .catch((err) => {
      console.error("Error in proxy for ispengestopp", err.message);
      res.sendStatus(err.response.status);
    });
});

server.use("/ispengestopp/api/v1/person/flagg", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const data = req.body;

  axios
    .post(`http://ispengestopp.teamsykefravr/api/v1/person/flagg`, data, {
      headers,
    })
    .then((response) => {
      res.sendStatus(response.status);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(err.response.status);
    });
});

server.use("/isprediksjon/api/v1/prediksjon", cookieParser(), (req, res) => {
  const token = req.cookies["isso-idtoken"];
  const options = {
    headers: {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .get(`http://isprediksjon/api/v1/prediksjon`, options)
    .then((response) => {
      if (response.status === 204) {
        res.sendStatus(204);
      } else {
        res.send(response.data);
      }
    })
    .catch((err) => {
      console.error("Error in proxy for isprediksjon", err.message);
      res.sendStatus(err.response.status);
    });
});

server.use(
  "/syfoveileder/api",
  proxy(syfoveilederHost, {
    proxyReqPathResolver: function (req) {
      return `/syfoveileder/api/v1/${req.url}`;
    },
    proxyErrorHandler: function (err, res, next) {
      console.error("Error in proxy for syfoveileder", err);
      next(err);
    },
  })
);

const port = 8080;

server.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
