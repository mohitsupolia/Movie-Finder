import { useState, useEffect } from "react";
export function useLocalStorageState(iniitialState, key) {
  const [value, setValue] = useState(function () {
    const storedvalue = localStorage.getItem(key);
    return storedvalue ? JSON.parse(storedvalue) : iniitialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
