import React from 'react'
import { Card } from '../ui/card';

const StravaCardMiles = () => {

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

    const distance = (data?.distance ?? 55000000 * 0.000621371).toFixed(2) //given in meters so we need to convert to miles
    return (
        <div>
            <Card style={{ padding: '5px' }} className="shadow-border">
                <Card.Title>Total Miles Run</Card.Title>
                <Card.Text style={{ fontSize: '30px' }}>{distance}</Card.Text>
            </Card>
        </div>
    )
}

export default StravaCardMiles