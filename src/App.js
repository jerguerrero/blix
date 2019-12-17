import React, {useState, useEffect} from 'react';
import './App.css';
import MaterialTable from "material-table";


const fetchTraffic = async (setData) =>{
    const header = await fetch('https://data.gov.au/data/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%229e26683b-6b30-424e-ace7-59047d811d1c%22');
    console.log(header);
    const body = await header.json();
    console.log(body);
    setData(body.result.records);
}

function App() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchTraffic(setData);
    }, []);


  return (
    <div className="App">
      <header className="App-header">
        <MaterialTable
            columns={[
              { title: "Adı", field: "name" },
              { title: "Soyadı", field: "surname" },
              { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
              {
                title: "Doğum Yeri",
                field: "birthCity",
                lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
              }
            ]}
            data={data}
            title="Demo Title"
        />
      </header>
    </div>
  );
}

export default App;
