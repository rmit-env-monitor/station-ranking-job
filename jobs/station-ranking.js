const q = require('q')
const Promise = global.Promise

const deviceRepo = require('../DAL/repositories/device-repository')
const recordRepo = require('../DAL/repositories/record-repository')
const constants = require('../utilities/constants')

class StationRanking {
    getCities() {
        return new Promise((resolve, reject) => {
            deviceRepo.getAvailableCities()
                .then(cities => {
                    resolve(cities)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    getAllStationsByCity() {
        const stationsCities = []
        return new Promise((resolve, reject) => {
            this.getCities().then(cities => {
                const devicePromises = []
                for (let city of cities) {
                    stationsCities.push({ city: city, stations: [] })
                    let devicePromise = deviceRepo.getDevicesByCity({ city: city }, '_id name district')
                        .then(devices => {
                            for (let device of devices) {
                                stationsCities[stationsCities.length - 1].stations.push({ id: device._id, name: device.name, district: device.district, aqi: 0 })
                            }
                        })
                    devicePromises.push(devicePromise)
                }

                q.all(devicePromises).then(() => {
                    resolve(stationsCities)
                })
            })
        })
    }

    getStationLatestAqi() {
        let newStationsCities = []
        const promises = []

        return new Promise((resolve, reject) => {
            this.getAllStationsByCity().then(stationsCities => {
                newStationsCities = stationsCities

                for (let i = 0; i < newStationsCities.length; i++) {
                    for (let j = 0; j < newStationsCities[i].stations.length; j++) {
                        let recordPromise = recordRepo.getLatestDeviceRecord(
                            { deviceID: newStationsCities[i].stations[j].id }, '-_id', 1, constants.AQI_ONLY
                        ).then(records => {
                            records.length > 0 ?
                                newStationsCities[i].stations[j].aqi = records[0]._doc.aqiValues.aqi
                                :
                                newStationsCities[i].stations[j].aqi = 0
                        })
                        promises.push(recordPromise)
                    }
                }

                q.all(promises).then(() => {
                    resolve(newStationsCities)
                })
            })
        })
    }

    sortStations() {
        let newStationsCities = []

        return new Promise((resolve, reject) => {
            this.getStationLatestAqi().then(stationsCities => {
                newStationsCities = stationsCities
                for (let i = 0; i < newStationsCities.length; i++) {
                    newStationsCities[i].stations.sort((a, b) => {
                        return b.aqi - a.aqi
                    })
                }

                resolve(newStationsCities)
            })
        })
    }
}

module.exports = new StationRanking()