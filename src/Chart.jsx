import React, { useState } from "react";
import moment from "moment";
import { FlexibleXYPlot, LineSeries, XAxis, YAxis, Hint } from "react-vis";

const tickFormat = value => moment(value * 1000).format("D MMM");

function Chart({ data }) {
  const [marker, setMarker] = useState(null);

  console.log(data);

  return (
    <FlexibleXYPlot height={200} getX={pt => pt.week} getY={pt => pt.total}>
      <LineSeries
        data={data}
        onNearestX={point => {
          setMarker(point);
        }}
        onMouseLeave={() => {
          setMarker(null);
        }}
      />
      <XAxis tickTotal={5} tickFormat={tickFormat} />
      <YAxis tickTotal={5} />
      {!!marker && (
        <Hint value={marker}>
          <div className="hint-root">
            <p>Commits: {marker.total}</p>
            <p>
              {`${moment(marker.week * 1000).format("D-MMM")} to ${moment(
                marker.week * 1000
              )
                .add(7, "d")
                .format("D-MMM")}`}
            </p>
          </div>
        </Hint>
      )}
    </FlexibleXYPlot>
  );
}

export default Chart;
