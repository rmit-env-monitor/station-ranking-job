const baseRepo = require('./base-repository')

class RankingRepository {
    saveRecord(model) {
        return baseRepo.create(model)
    }
}

module.exports = new RankingRepository()