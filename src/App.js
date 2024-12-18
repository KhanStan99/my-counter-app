import { memo, React, useState, useCallback } from 'react';
import './App.css';
import dayjs from 'dayjs';
import moment from 'moment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import {
  Box,
  Typography,
  AppBar,
  IconButton,
  Card,
  CardActionArea,
  CardContent,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';

const App = memo(() => {
  const [duration, setDuration] = useState('days');
  const [data, setData] = useState(() => {
    const localData = localStorage.getItem('my_data');
    return localData ? JSON.parse(localData) : [];
  });

  const addData = useCallback(
    (value) => {
      const newData = [...data, value];
      localStorage.setItem('my_data', JSON.stringify(newData));
      setData(JSON.parse(localStorage.getItem('my_data')));
    },
    [data]
  );

  const removeData = useCallback(
    (index) => {
      const newData = data.filter((_, i) => i !== index);
      setData(newData);
      localStorage.setItem('my_data', JSON.stringify(newData));
    },
    [data]
  );

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <InputSection
          duration={duration}
          setDuration={setDuration}
          addData={addData}
        />
        {data.length > 0 && (
          <Stats data={data} duration={duration} removeData={removeData} />
        )}
      </Box>
    </>
  );
});

const Header = memo(() => (
  <AppBar position="sticky">
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      textAlign="center"
    >
      <Typography variant="h4">Count Your Bad Habits</Typography>
      <Typography variant="h6">
        Track your behavior and improve over time
      </Typography>
    </Box>
  </AppBar>
));

const InputSection = memo(({ duration, setDuration, addData }) => {
  const [value, setValue] = useState(dayjs());

  return (
    <Box
      padding={2}
      display="flex"
      flexDirection="column"
      gap={2}
      backgroundColor="#afd683"
      alignItems="center"
      textAlign={'center'}
    >
      <FormControl>
        <FormLabel>Duration in:</FormLabel>
        <RadioGroup
          row
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <FormControlLabel value="days" control={<Radio />} label="Days" />
          <FormControlLabel value="hours" control={<Radio />} label="Hours" />
        </RadioGroup>
      </FormControl>

      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        alignItems="center"
        textAlign={'center'}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select date and time"
            defaultValue={dayjs(moment())}
            value={value}
            format="DD-MM-YYYY hh:mm:ss a"
            onChange={setValue}
          />
        </LocalizationProvider>
        <Button
          variant="outlined"
          onClick={() => {
            setValue(dayjs());
            addData(value);
          }}
        >
          Add Now 😔
        </Button>
      </Box>
    </Box>
  );
});

const Stats = memo(({ data, duration, removeData }) => {
  const sortedData = [...data].sort(
    (a, b) => moment(a).valueOf() - moment(b).valueOf()
  );
  const timeDifferences = [];

  for (let i = 1; i < sortedData.length; i++) {
    const prevDate = moment(sortedData[i - 1]);
    const currentDate = moment(sortedData[i]);
    const diff = moment.duration(currentDate.diff(prevDate));
    timeDifferences.push(diff.as(duration));
  }

  const averageTimeBetweenHabits =
    timeDifferences.reduce((sum, diff) => sum + diff, 0) /
    (timeDifferences.length || 1);

  const lastLogged = sortedData[sortedData.length - 1];
  const firstLogged = sortedData[0];
  const timeSinceLastLogged = moment().diff(moment(lastLogged), duration);
  const totalTimePassed = moment(lastLogged).diff(
    moment(firstLogged),
    duration
  );

  const totalLogs = sortedData.length;
  const uniqueDates = new Set(
    sortedData.map((date) => moment(date).format('YYYY-MM-DD'))
  );
  const daysWithEntries = uniqueDates.size;

  const result = [
    {
      title: `Average ${duration} between habits`,
      value: averageTimeBetweenHabits.toFixed(2),
    },
    {
      title: `${duration} since last Logged`,
      value: timeSinceLastLogged.toFixed(2),
    },
    {
      title: `${duration} since first Logged`,
      value: `${moment().diff(moment(firstLogged), duration)}`,
    },
    {
      title: `total ${duration} passed `,
      value: totalTimePassed.toFixed(2),
    },
    { title: 'Total Logs', value: totalLogs },
    { title: 'days with entries', value: daysWithEntries },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={1}
      gap={2}
      textAlign="center"
    >
      <Typography variant="h4">Stats</Typography>

      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        gap={2}
        justifyContent={'center'}
      >
        {result.map((item) => (
          <Card display="flex" sx={{ textAlign: 'center' }} key={item.title}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Typography variant="h4">History</Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {data.map((time, index) => {
          let afterTime = '';
          if (index >= 1) {
            afterTime = moment(data[index]).diff(
              moment(data[index - 1]),
              duration
            );
          }
          return (
            <Box
              key={index}
              display="flex"
              flexDirection="row"
              justifyContent={'space-between'}
              textAlign="center"
              alignItems="center"
              gap={2}
              sx={{
                borderRadius: '12px',
                border: '1px solid #000',
                padding: '12px',
              }}
            >
              <Box>
                {index > 0 && (
                  <Typography variant="body2">
                    After {`${afterTime} ${duration}`}
                  </Typography>
                )}

                <Typography variant="body2">
                  {moment(time).format('DD-MM-YYYY | hh:mm:ss a')}
                </Typography>
              </Box>

              <IconButton variant="contained" onClick={() => removeData(index)}>
                <DeleteForeverIcon />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
});

export default App;
