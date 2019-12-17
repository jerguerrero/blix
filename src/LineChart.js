import React from 'react'
import { Chart } from 'react-charts'

const LineChart = ({data}) => {
    const dataToRender =
        [
            {
                label: 'Yarra Municipality Traffic Count',
                data: data
            },
        ]

    const axes = [
            { primary: true, type: 'utc', position: 'bottom', showTicks: true, showGrid: true},
            { type: 'linear', position: 'left' }
        ]

    return(
        <div
            style={{
                width: '100%',
                height: '50vh'
            }}
        >
            <Chart data={dataToRender} axes={axes} />
        </div>
    );
}

export default LineChart;