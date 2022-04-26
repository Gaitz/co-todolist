import { signIn } from "./userAuthenticationSlice";
import { useAppDispatch, RootState } from "@shared/store";
import { useSelector } from "react-redux";

const UserAuthentication = () => {
  const dispatch = useAppDispatch();

  const userAuthentication = useSelector(
    (state: RootState) => state.userAuthentication
  );

  const isAuthenticated = userAuthentication.isAuthenticated;
  const userEmail = userAuthentication.userEmail;

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      userEmail: { value: string };
    };
    const userEmail = target.userEmail.value;
    dispatch(signIn({ userEmail }));
  };

  if (isAuthenticated) {
    return <h2>Login as ${userEmail}</h2>;
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="userEmail">Email:</label>
      <input name="userEmail" type={"email"}></input>
      <button disabled={isAuthenticated}>Sign In</button>
    </form>
  );
};

export default UserAuthentication;
