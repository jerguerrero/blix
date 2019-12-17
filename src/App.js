import React, {useState, useEffect} from 'react';
import './App.css';
import MaterialTable from "material-table";
import Container from '@material-ui/core/Container';
import LineChart from './LineChart';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const fetchTraffic = async (setData, setLineChartData) =>{
    const header = await fetch('https://data.gov.au/data/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%229e26683b-6b30-424e-ace7-59047d811d1c%22');
    console.log(header);
    const body = await header.json();
    console.log(body);


    const resultsArray = body.result.records;

    var reducedResult = resultsArray.map(function(item) {
        return {dateCaptured: item.date_captured, volumeDay: item.volume_per_day};
    });

    console.log(reducedResult);
    var temporary = {};

    reducedResult.forEach(function(d) {
        if (temporary.hasOwnProperty(d.dateCaptured)) {
            temporary[d.dateCaptured] = temporary[d.dateCaptured] + Number(d.volumeDay);
        } else {
            temporary[d.dateCaptured] = Number(d.volumeDay);
        }
    });

    console.log(temporary);

    var aggregatedData = [];
    var index = 0;
    for (var key in temporary) {

        aggregatedData.push({ x:(new Date(key)), y: temporary[key] });
    }

    console.log(aggregatedData);

    // Sort by Date
    aggregatedData.sort(function(prev, next){
        var prevKey = prev.x;
        var nextKey = next.x;

        if(prevKey < nextKey) return -1;
        if(prevKey > nextKey) return 1;
        return 0;
    });

    console.log(aggregatedData);
    await setLineChartData(aggregatedData);
    var reducedAgg = aggregatedData.map(function(item) {
        return {x: item.x, y: item.y};
    });
    console.log(reducedAgg);

    await setData(reducedAgg);
}

const columns = [
    {title: 'Volume/Day', field: 'y'},
    {title: 'Date Captured', field: 'x', type: 'date'},
    // {title: 'Direction 1', field: 'direction_1'},
    // {title: 'Road Name', field: 'road_name'},
    // {title: 'Direction 2', field: 'direction_2'},
    // {title: 'Suburb', field: 'suburb'},
    // {title: 'Full Text', field: '_full_text'},
    // {title: 'Section Start', field: 'section_start'},
    // {title: 'Section End', field: 'section_end'},
    // {title: 'Vehicles 1', field: 'vehicles_1'},
    // {title: 'Vehicles 2', field: 'vehicles_2'},
    // {title: 'ID', field: '_id'},
    // {title: '85th Percentile Speed', field: '85th_percentile_speed'},
];

function App() {

    const [data, setData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);

    useEffect(() => {
        fetchTraffic(setData, setLineChartData);
    }, []);


  return (
      <div className="App" style={{height: '100vh', width: '100vw'}}>
          <header className="App-header">
              <Container maxWidth="lg">
      <Tabs>
          <TabList>
              <Tab>Chart</Tab>
              <Tab>Table</Tab>
          </TabList>

          <TabPanel>

                  <MaterialTable
                      style={{height: '50vh', width: '100%'}}
                      columns={columns}
                      data={data}
                      title="Yarra Municipality Traffic Count"
                  />
          </TabPanel>
          <TabPanel>
              <LineChart data={lineChartData}/>
          </TabPanel>
      </Tabs>


          </Container>
      </header>
    </div>
  );
}

export default App;
