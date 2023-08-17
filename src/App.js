import { React, useState } from 'react';
import './App.css';
import dayjs from 'dayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';

function App() {
  const localData = localStorage.getItem('my_data');
  const [duration, setDuration] = useState('hours');
  const [value, setValue] = useState(dayjs(moment()));

  let data = [];

  if (localData) {
    data = JSON.parse(localData);
  }

  const formattedData = [];
  let average = 0;
  data.forEach((item, index) => {
    let lastTime = 0;

    if (index >= 1) {
      lastTime = moment(data[index]).diff(moment(data[index - 1]), duration);
    }

    formattedData.push({
      dateTime: item,
      lastTime,
    });
    average = average + lastTime;
  });

  average = (average / (formattedData.length - 1)).toFixed(1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '12px',
      }}
    >
      <div>
        <label>
          <input
            type="radio"
            value="days"
            checked={duration === 'days'}
            onChange={() => setDuration('days')}
          />
          Days
        </label>
        <label>
          <input
            type="radio"
            value="hours"
            checked={duration === 'hours'}
            onChange={() => setDuration('hours')}
          />
          Hours
        </label>
        <label>
          <input
            type="radio"
            value="minutes"
            checked={duration === 'minutes'}
            onChange={() => setDuration('minutes')}
          />
          Minutes
        </label>
        <label>
          <input
            type="radio"
            value="seconds"
            checked={duration === 'seconds'}
            onChange={() => setDuration('seconds')}
          />
          Seconds
        </label>
      </div>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#919191',
          borderRadius: '20px',
          margin: '12px',
          padding: '22px',
          boxShadow: 'rgb(128, 128, 128) 0px 0px 10px 3px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select date and time"
            defaultValue={dayjs(moment())}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
        <button
          style={{ borderRadius: '12px', padding: '8px' }}
          onClick={() => {
            data.push(value);
            localStorage.setItem('my_data', JSON.stringify(data));
            window.location.reload();
          }}
        >
          Add Now 😔
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {Number(average) ? (
          <>
            {formattedData.length} events in last{' '}
            {moment().diff(moment(formattedData[0].dateTime), duration)} {duration} with
            an average of {average} {duration}
          </>
        ) : null}
        <p>
          {data.length > 0 && (
            <>
              Since last record:{' '}
              {String(
                `${moment().diff(
                  moment(data[data.length - 1]),
                  duration
                )} ${duration}`
              )}
            </>
          )}
        </p>
      </div>

      {formattedData.length > 0 &&
        formattedData.map((time, index) => {
          return (
            <div
              key={index}
              style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: '#000',
                borderRadius: '180px',
                margin: '12px',
                padding: '12px',
                boxShadow: 'rgb(128, 128, 128) 0px 0px 10px 3px',
              }}
            >
              {index > 0 ? (
                <>
                  After {String(`${time.lastTime} ${duration}`)}
                  <br />
                </>
              ) : null}

              {moment(time.dateTime).format('DD-MM-YYYY # hh:mm:ss a')}

              <Button
                variant="contained"
                onClick={() => {
                  data.splice(index, 1);
                  localStorage.setItem('my_data', JSON.stringify(data));
                  window.location.reload();
                }}
                style={{ marginLeft: '12px', padding: '12px' }}
              >
                <DeleteForeverIcon />
              </Button>
            </div>
          );
        })}
    </div>
  );
}

export default App;
