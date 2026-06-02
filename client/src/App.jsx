import Map from "./components/Map";
import { getUser } from "./controllers/userController";
import { useLoaderData } from "react-router";
import Navbar from "./components/Navbar";

const MOCK_STATIONS = [
  { id: 1, name: "Centrale" },
  { id: 2, name: "Porta Susa" },
  { id: 3, name: "Bernini" },
  { id: 5, name: "Massaua" },
  { id: 6, name: "Pozzo Strada" },
  { id: 7, name: "Marche" }
];

const MOCK_SEGMENTS = [
  { id: 1, start_station: 1, end_station: 2, line_name: "Red Line" },
  { id: 2, start_station: 2, end_station: 3, line_name: "Red Line" },
  { id: 4, start_station: 1, end_station: 5, line_name: "Blue Line" },
  { id: 5, start_station: 5, end_station: 6, line_name: "Blue Line" },
  { id: 6, start_station: 6, end_station: 7, line_name: "Blue Line" }
];

function App() {
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "6fr 4fr",
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden"
  };

  const mapWrapperStyle = {
    width: "100%",
    height: "100%"
  };

  const panelWrapperStyle = {
    backgroundColor: "#fafafa",
    width: "100%",
    height: "100%"
  };

  return (
    <>
      <Navbar username="Centrale_Admin" onLogout={() => alert("Logged out!")} />
      <div style={gridContainerStyle}>
        <div style={mapWrapperStyle}>
          <Map
            showLines={true}
            startStation={1}
            destinationStation={9}
            onStationClick={(station) => console.log("Clicked:", station.name)}
          />
        </div>


        <div style={panelWrapperStyle}>

        </div>
      </div>
    </>
  );
}

export default App;