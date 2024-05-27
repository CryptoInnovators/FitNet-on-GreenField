import React from 'react'
import { Card } from '../ui/card'

const StravaCardElapsedTime = () => {
    const callstrava =  async (req, res) => {
        var key = process.env.STRAVA_KEY
        const response = await fetch('https://www.strava.com/api/v3/athletes/8696836/stats?access_token=' + key)
        const json = await response.json()
        const { count, distance } = json.all_run_totals
        const movingTime = json.all_run_totals.moving_time
        return res.status(200).json({
            count,
            distance,
            movingTime
        })
    }
    const time = (data?.movingTime ?? 33456000 * 0.000277778).toFixed(2) // convert from seconds to hours
    return (
        <div>
            <Card style={{ padding: '5px' }} className="shadow-border">
                <Card.Title>Total Time</Card.Title>
                <Card.Text style={{ fontSize: '30px' }}>{time}</Card.Text>
            </Card>
        </div>
    )
}

export default StravaCardElapsedTime
