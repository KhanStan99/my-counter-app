import { React, useState } from "react";
import './App.css';
import dayjs from 'dayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';


function App() {

  const localData = localStorage.getItem("my_data");
  const [duration, setDuration] = useState("hours")
  const [value, setValue] = useState(dayjs(moment()));

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
      <div style={{
        width: '100%',
        textAlign: 'center',
        backgroundColor: "#919191",
        borderRadius: '20px',
        margin: '12px',
        padding: '22px',
        boxShadow: 'rgb(128, 128, 128) 0px 0px 10px 3px',
        display: 'flex', flexDirection: 'row', justifyContent: "space-between",
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker label="Select date and time"
            defaultValue={dayjs(moment())}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
        <button style={{ borderRadius: '12px', padding: '8px' }} onClick={() => {
          test.push(value);
          localStorage.setItem("my_data", JSON.stringify(test));
          window.location.reload();
        }}>Add Now 😔</button>
      </div>


      {test.length > 0 && test.map((time, index) => {
        return <div key={time} style={{
          width: '100%',
          textAlign: 'center',
          backgroundColor: "#000",
          borderRadius: '180px',
          margin: '12px',
          padding: '12px',
          boxShadow: 'rgb(128, 128, 128) 0px 0px 10px 3px'
        }}>
          {index >= 1 &&
            <>
              After {String(`${moment(test[index]).diff(moment(test[index - 1]), duration)} ${duration}`)}
              <br />
            </>}

          {moment(time).format("DD-MM-YYYY # hh:mm:ss a")}

          <Button variant="contained"
            onClick={() => {
              test.splice(index, 1);
              localStorage.setItem("my_data", JSON.stringify(test));
              window.location.reload();
            }}
            style={{ marginLeft: '12px', padding: '12px' }} ><DeleteForeverIcon /></Button>
        </div>
      })}
      {test.length > 0 && <>Since last record:  {String(`${moment().diff(moment(test[test.length - 1]), duration)} ${duration}`)}</>}
    </div >
  );
}

export default App;
