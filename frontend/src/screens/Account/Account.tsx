import Logout from "src/components/Logout";
import BuildBlockSubmissions from "./components/BuildBlockSubmissions";

interface AccountProps {}

const Account: React.FC<AccountProps> = () => {
  return (
    <>
      <p>Account</p>
      <Logout />
      <BuildBlockSubmissions />
    </>
  );
};

export default Account;
