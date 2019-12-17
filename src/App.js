import React, { useState, useEffect } from "react";
import "./App.css";
import Container from "@material-ui/core/Container";
import LineChart from "./Components/LineChart";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Table from "./Components/Table";

const fetchTraffic = async (setData, setLineChartData) => {
  const header = await fetch(
    "https://data.gov.au/data/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%229e26683b-6b30-424e-ace7-59047d811d1c%22"
  );
  const body = await header.json();

  const resultsArray = body.result.records;

  var reducedResult = resultsArray.map(function(item) {
    return { dateCaptured: item.date_captured, volumeDay: item.volume_per_day };
  });

  var temporary = {};

  reducedResult.forEach(function(d) {
    if (temporary.hasOwnProperty(d.dateCaptured)) {
      temporary[d.dateCaptured] =
        temporary[d.dateCaptured] + Number(d.volumeDay);
    } else {
      temporary[d.dateCaptured] = Number(d.volumeDay);
    }
  });

  var aggregatedData = [];
  for (var key in temporary) {
    aggregatedData.push({ x: new Date(key), y: temporary[key] });
  }

  // Sort by Date
  aggregatedData.sort(function(prev, next) {
    var prevKey = prev.x;
    var nextKey = next.x;

    if (prevKey < nextKey) return -1;
    if (prevKey > nextKey) return 1;
    return 0;
  });

  await setLineChartData(aggregatedData);
  var reducedAgg = aggregatedData.map(function(item) {
    return { x: item.x, y: item.y };
  });

  await setData(reducedAgg);
};

function App() {
  const [data, setData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    fetchTraffic(setData, setLineChartData);
  }, []);

  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>
      <header className="App-header">
        <Container maxWidth="lg">
          <Tabs>
            <TabList>
              <Tab>Chart</Tab>
              <Tab>Table</Tab>
            </TabList>
            <TabPanel>
              <Table data={data} />
            </TabPanel>
            <TabPanel>
              <LineChart data={lineChartData} />
            </TabPanel>
          </Tabs>
        </Container>
      </header>
    </div>
  );
}

export default App;
