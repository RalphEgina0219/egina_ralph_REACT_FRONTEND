import { useState } from "react";
function Form() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitted name: ${name}`);
  };
  return (
    <>
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Form;
