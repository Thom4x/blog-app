import { TextField, Button } from "@mui/material";

const LoginForm = ({
  handleLogin,
  isLoading,
  name,
  password
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
          {...name}
        />
        <TextField
          variant="standard"
          label="password"
          name="password"
          autoComplete="current-password"
          required
          {...password}
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
