import './App.scss';
import React, { useState, useEffect } from 'react';

const data = JSON.parse(
  '{"topic":"orderBookApi","data":{"buyQuote":[{"price":"21426.5","size":"35"},{"price":"21424.0","size":"83"},{"price":"21421.0","size":"583"},{"price":"21414.5","size":"1602"},{"price":"21413.0","size":"1327"},{"price":"21412.5","size":"2813"},{"price":"21412.0","size":"20"},{"price":"21410.0","size":"4845"},{"price":"21408.5","size":"2313"},{"price":"21408.0","size":"1760"},{"price":"21406.0","size":"2633"},{"price":"21405.5","size":"2238"},{"price":"21405.0","size":"4710"},{"price":"21403.5","size":"7396"},{"price":"21402.5","size":"4640"},{"price":"21401.0","size":"8132"},{"price":"21400.5","size":"3883"},{"price":"21400.0","size":"16"},{"price":"21398.5","size":"589"},{"price":"21397.5","size":"1823"},{"price":"21397.0","size":"4623"},{"price":"21394.0","size":"3403"},{"price":"21393.5","size":"6394"},{"price":"21390.0","size":"4705"},{"price":"21389.5","size":"231"},{"price":"21387.5","size":"400"},{"price":"21386.5","size":"585"},{"price":"21385.5","size":"7407"},{"price":"21384.0","size":"1462"},{"price":"21382.0","size":"667"},{"price":"21381.5","size":"1499"},{"price":"21380.0","size":"356"},{"price":"21378.5","size":"1823"},{"price":"21377.0","size":"2135"},{"price":"21376.0","size":"2271"}],"sellQuote":[{"price":"21482.0","size":"2341"},{"price":"21481.5","size":"700"},{"price":"21480.5","size":"1507"},{"price":"21479.0","size":"2416"},{"price":"21477.5","size":"1363"},{"price":"21477.0","size":"465"},{"price":"21476.5","size":"2008"},{"price":"21473.5","size":"1454"},{"price":"21472.0","size":"5689"},{"price":"21471.0","size":"810"},{"price":"21468.5","size":"758"},{"price":"21468.0","size":"5715"},{"price":"21463.5","size":"10613"},{"price":"21460.0","size":"5471"},{"price":"21459.0","size":"2023"},{"price":"21456.5","size":"10412"},{"price":"21454.0","size":"5003"},{"price":"21453.0","size":"1451"},{"price":"21451.0","size":"4906"},{"price":"21450.0","size":"21192"},{"price":"21449.0","size":"863"},{"price":"21448.5","size":"2649"},{"price":"21447.5","size":"5411"},{"price":"21446.5","size":"946"},{"price":"21446.0","size":"2826"},{"price":"21445.5","size":"1882"},{"price":"21444.5","size":"3734"},{"price":"21443.0","size":"397"},{"price":"21441.5","size":"1440"},{"price":"21439.5","size":"467"},{"price":"21439.0","size":"560"},{"price":"21436.5","size":"667"},{"price":"21435.0","size":"20"},{"price":"21433.5","size":"53"},{"price":"21427.0","size":"755"}],"lastPrice":"21420.5","timestamp":1656252537765,"gain":1,"symbol":"BTCPFC"}}'
);

console.log(data);

function App() {
  const [first, setfirst] = useState(0);
  const ws = new WebSocket('wss://ws.btse.com/ws/futures');

  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          op: 'subscribe',
          args: ['orderBookApi:BTCPFC_0'],
        })
      );

      console.log('sent');
    };
    ws.onmessage = (event) => {
      console.log('receive from server');
      console.log(event);

      let streamingData = JSON.parse(event.data);
    };
    ws.onclose = () => {
      console.log('close connection');
    };
  }, []);

  const closeConnect = () => {
    ws.close();

    ws.send(
      JSON.stringify({
        op: 'unsubscribe',
        args: ['orderBookApi:BTCPFC_0'],
      })
    );

    console.log('close connection');
  };

  return (
    <div className='App'>
      <button onClick={closeConnect}>CLOSE BUTTON</button>

      <div className='OrderbookContainer'>
        <div className='OrderbookContainer__title'>Order Book</div>
        <div className='OrderbookContainer__item'>
          <div class='OrderbookContainer__item__header'>
            <div class='OrderbookContainer__item__price'>Prize(USD)</div>
            <div class='OrderbookContainer__item__size'>Size</div>
            <div class='OrderbookContainer__item__total'>Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
