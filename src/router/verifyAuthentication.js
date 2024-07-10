import {authenticationStore} from "@/store/authentication";
export default (to, from, next) => {
  const store = authenticationStore();

  const authenticationStatus = store.authenticationStatus;
  const authenticationRequired = to.meta.authenticationRequired;

  if (!authenticationRequired) {
    return next();
  }

  if (authenticationStatus === 'AUTHENTICATED') {
    return next();
  }

  next("/authentication");
}
