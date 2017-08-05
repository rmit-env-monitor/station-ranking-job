const baseRepo = require('./base-repository')
const recordModel = require('../models/record-model')

class RecordRepository {
    getLatestDeviceRecord(condition, sort, limit, select) {
        return baseRepo.findManyLimit(recordModel, condition, sort, limit, select)
    }
}

module.exports = new RecordRepository()