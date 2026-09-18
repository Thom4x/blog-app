import { TextField, Button } from "@mui/material";

const LoginForm = ({
  setUsername,
  setPassword,
  handleLogin,
  username,
  password,
  isLoading,
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
          name="username"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          variant="standard"
          label="password"
          name="password"
          autoComplete="current-password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          style={{ marginTop: "10px", width: "70px" }}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
