export const isValidEnv = (): boolean => {
  // ignore if not present
  if (typeof window === 'undefined') {
    return false;
  }

  // local not allowed
  if (window.self === window.top || !window.top) {
    console.debug(
      "Client Script cannot initiate from the same page, make sure the script is added/connected to the Server's settings",
    );
    return false;
  }

  return true;
};
