import React, { useState } from "react";

const Brok = () => {
  const [data, setData] = useState("");

  const functions = () => {
    console.log("Click in function");
  };

  return (
    <div>
      <h1>Hi!, Welcome</h1>
      {data.map((d) => {
        <li key={d.id}>This is {d.content}</li>;
        {
          data ? <button onClick={() => functions()}>Add info</button> : null;
        }
      })}
    </div>
  );
};

export default Brok;
