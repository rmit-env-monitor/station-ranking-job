require("./DAL/mongodb-connection");
const stationJob = require("./jobs/station-ranking");

stationJob.sortStations().then(value => {
  console.log(JSON.stringify(value));
});
return;
