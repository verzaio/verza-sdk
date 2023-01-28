export const isValidEnv = (): boolean => {
  // ignore if not present
  if (typeof window === 'undefined') {
    return false;
  }

  // local not allowed
  if (window.self === window.top || !window.top) {
    console.debug(
      'Script cannot initiate from the same page, make sure the script is included on the server.',
    );
    return false;
  }

  return true;
};
