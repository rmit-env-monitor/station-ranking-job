class BaseRepository {
    /**
     * Get all documents in a collection
     * @param  {Model<Document>} model
     * @param  {string} select
     */
    findAll(model, select) {
        return model.find().select(select).exec()
    }

    /**
     * Get many documents with conditions
     * @param  {Model<Document>} model
     * @param  {object} condition
     * @param  {string} select
     */
    findMany(model, condition, select) {
        return model.where(condition).find().select(select).exec()
    }

    /**
     * Limit searching documents
     * @param {Model<Document>} model
     * @param {object} condition
     * @param {string} sort
     * @param {number} limit
     * @param {string} select
     */
    findManyLimit(model, condition, sort, limit, select) {
        return model.where(condition).find().select(select).sort(sort).limit(limit).exec()
    }

    /**
     * Get a document with condition
     * @param  {Model<Document>} model
     * @param  {object} condition
     * @param  {string} select
     */
    findOne(model, condition, select) {
        return model.where(condition).findOne().select(select).exec()
    }

    /**
     * Get distinct list of a field
     * @param {Model<Document>} model
     * @param {string} field
     */
    findDistinct(model, field) {
        return model.find().distinct(field).exec()
    }

    /**
     * Get distinct list with condition
     * @param {Model<Document>} model
     * @param {object} condition
     * @param {string} field
     */
    findDistinctCondition(model, condition, field) {
        return model.where().find().distinct(field).exec()
    }

    /**
     * Edit a document
     * @param  {Model<Document>} model
     * @param  {number} id
     * @param  {object} value
     */
    edit(model, id, value) {
        return model.where({ _id: id }).update(value).exec()
    }

    /**
     * Create new document
     * @param  {Model<Document>} model
     */
    create(model) {
        return model.save()
    }
}

module.exports = new BaseRepository()