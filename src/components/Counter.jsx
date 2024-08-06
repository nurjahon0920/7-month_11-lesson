import { useCountStore } from "../store/useCountStore";

const Counter = () => {
  const { count, increment } = useCountStore();
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Counter;
