import React, {useState, useEffect} from 'react';
import './App.css';
import MaterialTable from "material-table";
import Container from '@material-ui/core/Container';
import LineChart from './LineChart';


const fetchTraffic = async (setData) =>{
    const header = await fetch('https://data.gov.au/data/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%229e26683b-6b30-424e-ace7-59047d811d1c%22');
    console.log(header);
    const body = await header.json();
    console.log(body);
    await setData(body.result.records);

    const resultsArray = body.result.records;

    var reducedResult = resultsArray.map(function(item) {
        return {dateCaptured: item.date_captured, volumeDay: item.volume_per_day};
    });

    var temporary = {};

    reducedResult.forEach(function(d) {
        if (temporary.hasOwnProperty(d.dateCaptured)) {
            temporary[d.dateCaptured] = temporary[d.dateCaptured] + Number(d.volumeDay);
        } else {
            temporary[d.dateCaptured] = Number(d.volumeDay);
        }
    });

    var aggregatedData = [];

    for (var key in temporary) {
        aggregatedData.push({ dateCaptured: key, volumeDay: temporary[key] });
    }
}

const columns = [
    {title: 'Volume/Day', field: 'volume_per_day'},
    {title: 'Date Captured', field: 'date_captured'},
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

    useEffect(() => {
        fetchTraffic(setData);
    }, []);


  return (
    <div className="App" style={{height: '100vh', width: '100vw'}}>
      <header className="App-header">
          <Container maxWidth="lg">
        <MaterialTable
            columns={columns}
            data={data}
            title="Yarra Municipality Traffic Count"
        />
        <LineChart/>
          </Container>
      </header>
    </div>
  );
}

export default App;
