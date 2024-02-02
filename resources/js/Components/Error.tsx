import { useState } from "react";
import { useForm } from "@inertiajs/react";
import Input from "./Input";
import Button from "./Button";

const Error = ({ message, data }: { message: string; data: object }) => {
  return (
    <div className="p-4 bg-white border-2 border-black">
      <h2 className="text-xl font-semibold">Error in your equation(s).</h2>

      <pre className="mt-4 whitespace-pre-wrap overflow-x-scroll bg-gray-100 p-3">
        {message}
      </pre>

      <div className="mt-6">
        <Help
          message={`
Data:
${JSON.stringify(data, null, 2)}

Error:
${message}`.trim()}
        />
      </div>
    </div>
  );
};

const Help = ({ message }: { message: string }) => {
  const [askForEmail, setAskForEmail] = useState(false);
  const { data, setData, post, errors } = useForm<{
    email: string;
    message: string;
  }>({
    email: "",
    message,
  });

  if (!askForEmail) {
    return (
      <Button onClick={() => setAskForEmail(true)}>
        No idea what’s wrong, ask for help &rarr;
      </Button>
    );
  }

  return (
    <div>
      <div className="text-sm text-black space-y-0.5  bg-gray-100 p-3">
        <p>
          Leave your email and I’ll take a look! (Either it’s your fault and
          I’ll let you know how to fix it, or it’s my fault and I’ll fix it.
          Both are very helpful! I will be very grateful either way!)
        </p>
        <p className="italic">— Ben (Tufts ’25)</p>
      </div>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          post(route("contact"), {
            onSuccess: () => alert("I’ll get back to you asap!"),
          });
        }}
      >
        <Input
          label="What’s your email?"
          type="email"
          required
          placeholder="you@tufts.edu"
          value={data.email}
          error={errors.email}
          onChange={(e) => setData("email", e.target.value)}
        />

        <div className="mt-3 flex justify-end">
          <Button type="submit">Send report</Button>
        </div>
      </form>
    </div>
  );
};

export default Error;
