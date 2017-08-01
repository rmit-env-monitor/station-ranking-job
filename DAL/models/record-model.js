const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        deviceID: String,
        utcDateTime: String,
        no2: Number,
        so2: Number,
        pm25: Number,
        pm10: Number,
        o3: Number,
        co: Number,
        sound: Number,
        temperature: Number,
        uv: Number,
        humidity: Number,
        aqiValues: {
            no2AQI: Number,
            so2AQI: Number,
            pm25AQI: Number,
            pm10AQI: Number,
            o3AQI: Number,
            coAQI: Number,
            aqi: Number
        }
    },
    {
        collection: 'records'
    }
)

module.exports = mongoose.model('records', schema)