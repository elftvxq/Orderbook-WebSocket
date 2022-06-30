import React, { memo } from 'react';

const QuotesComponent = memo(
  ({ type, formatNumberWithThousandsSeparators, quotesInfo, totalQuotes }) => {
    return (
      <>
        <div className='QuotesContainer'>
          {quotesInfo &&
            quotesInfo.map((quote, index) => {
              return (
                <div
                  className={`QuotesContainer__row ${type} ${
                    quote.status ? 'new-quote' : null
                  }`}
                  key={index}
                >
                  <div className='QuotesContainer__row__item price'>
                    {formatNumberWithThousandsSeparators(quote.price)}
                  </div>
                  <div
                    className={`QuotesContainer__row__item size ${quote.sizeChange}`}
                  >
                    {formatNumberWithThousandsSeparators(quote.size)}
                  </div>
                  <div className='QuotesContainer__row__item total'>
                    {formatNumberWithThousandsSeparators(
                      quote.accumulativeTotal
                    )}
                    <div
                      className='percentage-bar'
                      style={{
                        right: `${
                          (quote.accumulativeTotal / totalQuotes) * 100
                        }%`,
                      }}
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }
);

export default QuotesComponent;
