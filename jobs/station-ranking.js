const q = require('q')

const deviceRepo = require('../DAL/repositories/device-repository')
const recordRepo = require('../DAL/repositories/record-repository')
const Promise = global.Promise

class StationRanking {
    constructor() {
        this.stationReport = []
    }

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
                    let devicePromise = deviceRepo.getDevicesByCity({ city: city }, '_id district')
                        .then(devices => {
                            for (let device of devices) {
                                stationsCities[stationsCities.length - 1].stations.push({ id: device._id, district: device.district, aqi: 0 })
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
                            { deviceID: newStationsCities[i].stations[j].id }, '-_id', 1, '-_id -deviceID -no2 -so2 -pm25 -pm10 -o3 -co'
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