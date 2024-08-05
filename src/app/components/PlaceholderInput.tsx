'use client'

import { Textarea } from '@/components/ui/textarea';
import { Button } from "@/components/ui/button"
import { ChangeEvent, useState, memo } from 'react';
import { SendHorizontal } from 'lucide-react';

interface IInputCompnent {
  send: (string: string) => void
}

const InputComponent = memo(function InputComponent({send}: IInputCompnent) {
  const [input, setInput] = useState('');

  const handle_change = (input_event: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(input_event.target.value);
  };

  const submit = () => {
    console.log(input);
    send(input);
    setInput(" ");
  };

  return (
    <div className="flex flex-row space-x-1">
      <Textarea
            id="msg"
            value={input}
            onChange={handle_change}
            name="message"
            placeholder="Aa"
            className="w-11/12 border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background "
      ></Textarea>
      <Button variant="ghost" size="icon" onClick={submit}>
        <SendHorizontal size={20} className="text-muted-foreground" />
      </Button>
    </div>
  );
});

export default InputComponent
