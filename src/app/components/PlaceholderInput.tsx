'use client'

import { useState } from 'react';

export default function InputComponent({send}) {
  const [input, setInput] = useState('');

  const handle_change = (input_event) => {
    setInput(input_event.target.value);
  };

  const submit = () => {
    console.log(input)
    send(input)
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handle_change}
        placeholder="Message NiceBot"
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
};
