import React, { useRef, useEffect } from 'react';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    //assign the value of ref to the argument
    ref.current = value;
  }, [value]); //this code will run when the value of 'value' changes

  //in the end, return the current ref value.
  return ref.current;
};
export default usePrevious;
