const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Configuração do Express para servir a aplicação Angular
app.use(
  express.static(path.join(__dirname, "dist/asset-variation-exam")),
  cors({
    origin: "http://localhost:4200", // Substitua pelo domínio real do seu aplicativo Angular
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Configuração do Express para encaminhar solicitações à API do Yahoo Finance
app.get("/api/asset/:symbol", async (req, res) => {
  try {
    const selectedAssetUrl = req.params.symbol;

    // obtendo os parametros da url enviados como referencia.
    const url = "https://query1.finance.yahoo.com/v7/finance/chart/";
    const urlParams = selectedAssetUrl
      .substr(0, 7)
      .concat(
        "?".concat(selectedAssetUrl.substr(selectedAssetUrl.indexOf("symbol")))
      );
    // Fazendo a chamada à API do Yahoo Finance usando Axios
    const yahooFinanceResponse = await axios.get(`${url}/${urlParams}`);
    const data = yahooFinanceResponse.data;

    const payload = {
      timestampArr: data.chart.result[0].timestamp,
      openArr: data.chart.result[0].indicators.quote[0].open,
      closeArr: data.chart.result[0].indicators.quote[0].close,
      lowArr: data.chart.result[0].indicators.quote[0].low,
      highArr: data.chart.result[0].indicators.quote[0].high,
    };

    res.json(serializeToChartStructure(payload));
  } catch (error) {
    console.error("Erro na chamada à API do Yahoo Finance:", error.message);
    res.status(500).json({ error: "Erro na chamada à API do Yahoo Finance" });
  }
});

function serializeToChartStructure({
  timestampArr,
  openArr,
  closeArr,
  lowArr,
  highArr,
}) {
  // E.G. [timesetamp, opn, max, min, close]
  const serializedObjResponse = [];

  timestampArr.map((t, i) => {
    const timesTamp = Math.floor(t * 1000);
    const arrChartSort = [
      timesTamp,
      openArr[i],
      highArr[i],
      lowArr[i],
      closeArr[i],
    ];
    serializedObjResponse.push(arrChartSort);
  });

  return serializedObjResponse;
}
// Inicializa o servidor HTTP
const server = http.createServer(app);
const port = 3000;

server.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
