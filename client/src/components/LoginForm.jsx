import { TextField, Button } from "@mui/material";

const LoginForm = ({
  setUsername,
  setpassword,
  handleLogin,
  username,
  password,
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", width: "240px" }}
      >
        <TextField
          variant="standard"
          label="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          variant="standard"
          label="password"
          type="password"
          value={password}
          onChange={(event) => setpassword(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          style={{ marginTop: "10px", width: "70px" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
