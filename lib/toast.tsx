import * as ReactDOMClient from "react-dom/client";
import { SnackbarMessage, SnackbarProvider, useSnackbar } from "notistack";

const isBrowser = typeof window !== "undefined";

let root: ReactDOMClient.Root;
if (isBrowser) {
  const mountPoint = window.document.createElement("div");
  root = ReactDOMClient.createRoot(mountPoint);
  window.document.body.appendChild(mountPoint);
}
const ShowSnackbar = ({ message, variant }: { message: SnackbarMessage; variant: "default" | "error" | "success" | "warning" | "info" }) => {
  const { enqueueSnackbar } = useSnackbar();
  enqueueSnackbar(message, { variant });
  return null;
};

export const toast = (msg: SnackbarMessage, variant: "default" | "error" | "success" | "warning" | "info" = "default") => {
  if (root) {
    const provider = (
      <SnackbarProvider maxSnack={5} className="z-[999]" anchorOrigin={{ horizontal: "center", vertical: "top" }}>
        <ShowSnackbar message={msg} variant={variant} />
      </SnackbarProvider>
    );
    root.render(provider);
  }
};

toast.success = (msg: SnackbarMessage) => {
  toast(msg, "success");
};
toast.warning = (msg: SnackbarMessage) => {
  toast(msg, "warning");
};
toast.info = (msg: SnackbarMessage) => {
  toast(msg, "info");
};
toast.error = (msg: SnackbarMessage) => {
  toast(msg, "error");
};
