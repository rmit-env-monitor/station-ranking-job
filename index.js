const Queue = require("bull");
const config = require("config");
const express = require("express");
const Arena = require("bull-arena");

require("./DAL/mongodb-connection");
const stationJob = require("./jobs/station-ranking");
const constants = require("./utilities/constants");
const rankingRepo = require("./DAL/repositories/ranking-repository");
const rankingModel = require("./DAL/models/ranking-model");
const router = express.Router();

const stationRankingJob = new Queue(constants.STATION_RANKING_JOB, {
  redis: {
    port: config.get("redis.port"),
    host: config.get("redis.ip")
  }
});

// Setup Arena for webview.
const arena = Arena({
  queues: [
    {
      name: constants.STATION_RANKING_JOB,
      port: config.get("redis.port"),
      host: config.get("redis.ip"),
      hostId: "jobs"
    }
  ]
});
router.use("/", arena);

stationRankingJob.process((job, done) => {
  runStationRanking(job, done);
});

stationRankingJob.add(null, { repeat: { cron: "0 * * * *" } });

function runStationRanking(job, done) {
  job.progress(0);

  stationJob.sortStations().then(value => {
    rankingRepo.saveRecord(new rankingModel({ result: value }));
    job.progress(100);
    done(null, value);
  });
}
