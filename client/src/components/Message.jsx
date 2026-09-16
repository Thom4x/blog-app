import { Alert } from "@mui/material";
import { useNotification } from "../hooks/useStore";

const Message = () => {
  const notification = useNotification()

  if (!notification.message) {
    return null;
  }

  const className = notification.type === "success" ? "success" : "error";

  return (
    <Alert severity={className} style={{ marginBottom: "10px" }}>
      {notification.message}
    </Alert>
  );
};

export default Message;
