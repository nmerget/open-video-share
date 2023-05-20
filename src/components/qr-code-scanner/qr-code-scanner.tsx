import { Result, useZxing } from "react-zxing";
import { QrCodeScannerType } from "./data";
import { decompress } from "../../utils";
import "./qr-code-scanner.css";

const QrCodeScanner = ({ onResult }: QrCodeScannerType) => {
  const { ref } = useZxing({
    onResult(result: Result) {
      if (result) {
        onResult(decompress(result.getText()));
      }
    },
  });
  return <video className="qr-code-scanner-video" ref={ref} />;
};

export default QrCodeScanner;
