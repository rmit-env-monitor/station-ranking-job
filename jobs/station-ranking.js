const deviceRepo = require("../DAL/repositories/device-repository");
const recordRepo = require("../DAL/repositories/record-repository");
const constants = require("../utilities/constants");

class StationRanking {
  async getCities() {
    return await deviceRepo.getAvailableCities();
  }

  async getAllStationsByCity() {
    const stationsCities = [];
    const cities = await this.getCities();

    for (let city of cities) {
      stationsCities.push({ city: city, stations: [] });

      const devices = await deviceRepo.getDevicesByCity(
        { city: city },
        "_id name district"
      );
      for (let device of devices) {
        stationsCities[stationsCities.length - 1].stations.push({
          id: device._id,
          name: device.name,
          district: device.district,
          aqi: 0
        });
      }
    }

    return stationsCities;
  }

  async getStationLatestAqi() {
    let newStationsCities = [];

    newStationsCities = await this.getAllStationsByCity();

    for (let i = 0; i < newStationsCities.length; i++) {
      for (let j = 0; j < newStationsCities[i].stations.length; j++) {
        const records = await recordRepo.getLatestDeviceRecord(
          { deviceID: newStationsCities[i].stations[j].id },
          "-_id",
          1,
          constants.AQI_ONLY
        );
        records.length > 0
          ? (newStationsCities[i].stations[j].aqi =
              records[0]._doc.aqiValues.aqi)
          : (newStationsCities[i].stations[j].aqi = 0);
      }
    }

    return newStationsCities;
  }

  async sortStations() {
    let newStationsCities = [];

    newStationsCities = await this.getStationLatestAqi();
    for (let i = 0; i < newStationsCities.length; i++) {
      newStationsCities[i].stations.sort((a, b) => {
        return b.aqi - a.aqi;
      });

      for (let j = 1; j <= newStationsCities[i].stations.length; j++) {
        newStationsCities[i].stations[j - 1].idx = j;
      }
    }

    return newStationsCities;
  }
}

module.exports = new StationRanking();
