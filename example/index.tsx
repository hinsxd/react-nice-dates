import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Calendar, DatePicker } from '../';
import { enGB } from 'date-fns/locale';
import { isSameDay, format } from 'date-fns';

const App = () => {
  const [date, setDate] = React.useState();

  return (
    <DatePicker date={date} onDateChange={setDate} locale={enGB}>
      {({ inputProps, focused }) => (
        <input
          className={'input' + (focused ? ' -focused' : '')}
          {...inputProps}
        />
      )}
    </DatePicker>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
