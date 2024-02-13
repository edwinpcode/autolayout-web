import React, { useState } from "react"
import ReactSpeedometer from "react-d3-speedometer"

const Speedometer = () => {
  const [data, setData] = useState([
    {
      value: 50,
      maxValue: 100,
      label: "Normal",
      description: "Description",
      segment: [
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
        },
      ],
    },
    {
      value: 50,
      maxValue: 100,
      label: "Normal",
      description: "Description",
      segment: [
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
        },
      ],
    },
    {
      value: 50,
      maxValue: 100,
      label: "Normal",
      description: "Description",
      segment: [
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
        },
      ],
    },
    {
      value: 50,
      maxValue: 100,
      label: "Normal",
      description: "Description",
      segment: [
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
        },
      ],
    },
    {
      value: 50,
      maxValue: 100,
      label: "Normal",
      description: "Description",
      segment: [
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
        },
      ],
    },
    {
      value: 50,
      maxValue: 100,
      label: "Normal",
      description: "Description",
      segment: [
        {
          text: "Very Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Bad",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Ok",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Good",
          position: "INSIDE",
          color: "#555",
        },
        {
          text: "Very Good",
          position: "INSIDE",
          color: "#555",
        },
      ],
    },
  ])

  return (
    <div>
      <div className="row">
        {data.map((item, index) => (
          <div key={index}>
            <ReactSpeedometer
              maxValue={100}
              value={77}
              currentValueText="Happiness Level"
              needleHeightRatio={0.5}
              maxSegmentLabels={5}
              needleTransitionDuration={4000}
              needleTransition="easeElastic"
              customSegmentLabels={item.segment}
              height={200}
            />
            <div>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Speedometer
