import { React, useState } from "react";
import './App.css';
import moment from 'moment';

function App() {

  const localData = localStorage.getItem("my_data");
  const [duration, setDuration] = useState("hours")
  let test = [];

  if (localData) {
    test = JSON.parse(localData);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '12px', }}>
      <div>
        <label>
          <input type="radio" value="hours" checked={duration === 'hours'} onChange={() => setDuration("hours")} />
          Hours
        </label>
        <label>
          <input type="radio" value="minutes" checked={duration === 'minutes'} onChange={() => setDuration("minutes")} />
          Minutes
        </label>
        <label>
          <input type="radio" value="seconds" checked={duration === 'seconds'} onChange={() => setDuration("seconds")} />
          Seconds
        </label>
      </div>

      <button style={{ width: '100%', fontSize: '22px', borderRadius: '12px', padding: '8px' }} onClick={() => {
        test.push(moment());
        localStorage.setItem("my_data", JSON.stringify(test));
        window.location.reload();
      }}>Add Now 😔</button>

      {test.length > 0 && test.map((time, index) => {
        return <div key={time} style={{
          width: '100%',
          textAlign: 'center',
          backgroundColor: "#276655",
          borderRadius: '12px',
          margin: '12px',
          padding: '12px'
        }}>
          {index >= 1 &&
            <>
              {String(`${moment(test[index]).diff(moment(test[index - 1]), duration)} ${duration} ago`)}
              <br />
              <br />
            </>}

          {moment(time).format("DD-MM-YYYY # hh:mm:ss a")}
        </div>
      })}
    </div >
  );
}

export default App;
