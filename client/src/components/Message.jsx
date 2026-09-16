import { Alert } from "@mui/material";

const Message = ({ message, status }) => {
  if (!message) {
    return null;
  }

  const className = status === "success" ? "success" : "error";

  return (
    <Alert severity={className} style={{ marginBottom: "10px" }}>
      {message}
    </Alert>
  );
};

export default Message;
