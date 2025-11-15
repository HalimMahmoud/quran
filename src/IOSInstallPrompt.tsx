import { useEffect, useState } from "react";

// Extend Navigator type for iOS standalone property
interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

const IOSInstallPrompt: React.FC = () => {
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const navigatorIOS = window.navigator as IOSNavigator;

    setIsIos(/iphone|ipad|ipod/.test(userAgent));
    setIsInstalled(!!navigatorIOS.standalone); // converts undefined to boolean
  }, []);

  if (!isIos || isInstalled) return null;

  return (
    <div className="install-banner">
      Install this app on your iPhone: tap the Share button and then "Add to
      Home Screen".
    </div>
  );
};

export default IOSInstallPrompt;
