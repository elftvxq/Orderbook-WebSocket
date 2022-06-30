import React, { useState, useEffect } from 'react';
import usePrevious from './Helper/usePrevious';
import QuotesComponent from './Components/QuotesComponent';
import { ReactComponent as ArrowIcon } from './Styles/assets/IconArrowDown.svg';
import './App.scss';

function App() {
  const [sellQuotes, setSellQuotes] = useState([]);
  const [buyQuotes, setBuyQuotes] = useState([]);
  const [lastPrice, setLastPrice] = useState(0);

  const [totalSellQuotes, setTotalSellQuotes] = useState(0);
  const [totalBuyQuotes, setTotalBuyQuotes] = useState(0);
  const [gain, setGain] = useState(0);

  const prevSellQuote = usePrevious(sellQuotes);
  const prevBuyQuote = usePrevious(buyQuotes);

  useEffect(() => {
    const webSocket = new WebSocket(`wss://ws.btse.com/ws/futures`);
    webSocket.onopen = () => {
      webSocket.send(
        JSON.stringify({
          op: 'subscribe',
          args: ['orderBookApi:BTCPFC_0'],
        })
      );
    };

    webSocket.onmessage = (event) => {
      let streamingData = JSON.parse(event.data);

      if (streamingData.data) {
        const {
          data: { buyQuote, sellQuote, gain, lastPrice },
        } = streamingData;

        let newBuyData = calculateAccumulativeTotal(buyQuote, 'buy');
        setBuyQuotes(newBuyData);

        let newSellData = calculateAccumulativeTotal(sellQuote, 'sell');
        setSellQuotes(newSellData);

        setLastPrice(lastPrice);
        setGain(gain);
      }
    };
    webSocket.onclose = () => {
      console.log('close connection');
    };
  }, []);

  const calculateAccumulativeTotal = (quoteDetail, quoteType) => {
    let quotesResult = quoteDetail.slice(0, 8).map((item, index) => {
      let accumulativeTotal = 0;
      let totalValue = 0;

      if (quoteType === 'buy') {
        for (let i = index; i >= 0; i--) {
          accumulativeTotal += parseInt(quoteDetail[i].size);
          totalValue += quoteDetail[i].price * quoteDetail[i].size;
        }
        if (index === 7) {
          // To get the current maximum
          const newTotalBuyQuote =
            totalBuyQuotes > accumulativeTotal
              ? totalBuyQuotes
              : accumulativeTotal;
          setTotalBuyQuotes(newTotalBuyQuote);
        }
      } else if (quoteType === 'sell') {
        for (let i = index; i < 8; i++) {
          accumulativeTotal += parseInt(quoteDetail[i].size);
          totalValue += quoteDetail[i].price * quoteDetail[i].size;
        }
        if (index === 0) {
          const newTotalSellQuote =
            totalSellQuotes > accumulativeTotal
              ? totalSellQuotes
              : accumulativeTotal;

          setTotalSellQuotes(newTotalSellQuote);
        }
      }

      const accumulativeTotalData = { ...item };

      accumulativeTotalData.accumulativeTotal = accumulativeTotal;
      accumulativeTotalData.totalValue = totalValue;

      // return each quote by updated accumulativeTotal and totalValue
      return accumulativeTotalData;
    });

    if (!quotesResult.length) return [];
    return quotesResult;
  };

  const lastPriceColor = () => {
    switch (gain) {
      case 1:
        return 'go-up';
      case -1:
        return 'go-down';
      default:
        return null;
    }
  };

  useEffect(() => {
    lastPriceColor();
  }, [gain]);

  const formatNumberWithThousandsSeparators = (num) => {
    if (!num) return;
    if (isNaN(num)) {
      return num;
    }
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    const newQuoteUpdate = (currQuotes, oldQuotes, quoteType) => {
      // compare current quotes with old quotes
      currQuotes.forEach((quote, index) => {
        const exist = oldQuotes.some((item) => {
          if (item.price === quote.price) {
            return true;
          }
          return false;
        });

        if (!exist) {
          let newValue = [...currQuotes];
          newValue[index].status = true;
          if (quoteType === 'sellQuotes') {
            setSellQuotes(newValue);
          } else if (quoteType === 'buyQuotes') {
            setBuyQuotes(newValue);
          }
        } else {
          // to find the current quote index and update the size
          const oldQuotesIndex = oldQuotes.findIndex(
            (item) => item.price === quote.price
          );
          let newValue = [...currQuotes];

          if (quote.size > oldQuotes[oldQuotesIndex].size) {
            newValue[index].sizeChange = 'size-increase';
            if (quoteType === 'sellQuotes') {
              setSellQuotes(newValue);
            } else if (quoteType === 'buyQuotes') {
              setBuyQuotes(newValue);
            }
          } else if (quote.size < oldQuotes[oldQuotesIndex].size) {
            newValue[index].sizeChange = 'size-decrease';
            if (quoteType === 'sellQuotes') {
              setSellQuotes(newValue);
            } else if (quoteType === 'buyQuotes') {
              setBuyQuotes(newValue);
            }
          }
        }
      });
    };

    if (prevSellQuote && prevSellQuote.length) {
      newQuoteUpdate(sellQuotes, prevSellQuote, 'sellQuotes');
    }

    if (prevBuyQuote && prevBuyQuote.length) {
      newQuoteUpdate(buyQuotes, prevBuyQuote, 'buyQuotes');
    }
  }, [prevSellQuote, prevBuyQuote, buyQuotes, sellQuotes]);

  return (
    <div className='App'>
      {/* <button onClick={closeConnect}>CLOSE BUTTON</button> */}

      <div className='OrderbookContainer'>
        <div className='OrderbookContainer__title'>Order Book</div>

        <div className='OrderbookContainer__box'>
          <div className='OrderbookContainer__box__header'>
            <div className='OrderbookContainer__item price'>Prize(USD)</div>
            <div className='OrderbookContainer__item size'>Size</div>
            <div className='OrderbookContainer__item total'>Total</div>
          </div>
          {/* sell quotes */}
          <QuotesComponent
            type={'sell'}
            quotesInfo={sellQuotes}
            totalQuotes={totalSellQuotes}
            formatNumberWithThousandsSeparators={
              formatNumberWithThousandsSeparators
            }
          />
          <div className={`LastPriceContainer ${lastPriceColor()}`}>
            <div className={`LastPriceContainer__price `}>
              {lastPrice && formatNumberWithThousandsSeparators(lastPrice)}
              {gain !== 0 && (
                <div className='arrow-icon'>
                  <ArrowIcon />
                </div>
              )}
            </div>
          </div>
          {/* buy quotes */}
          <QuotesComponent
            type={'buy'}
            quotesInfo={buyQuotes}
            totalQuotes={totalBuyQuotes}
            formatNumberWithThousandsSeparators={
              formatNumberWithThousandsSeparators
            }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
