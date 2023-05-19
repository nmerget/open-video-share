import { Result, useZxing } from "react-zxing";
import { QrCodeScannerType } from "./data";

const QrCodeScanner = ({ onResult }: QrCodeScannerType) => {
  const { ref } = useZxing({
    onResult(result: Result) {
      onResult(result.getText());
    },
  });
  return <video style={{ width: "100%" }} ref={ref} />;
};

export default QrCodeScanner;
