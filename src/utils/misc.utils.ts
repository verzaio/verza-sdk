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

    const el = document.createElement('div');
    const h4 = document.createElement('h4');

    el.append(h4);

    el.style.position = 'absolute';
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.width = '100%';
    el.style.display = 'flex';
    el.style.margin = '0 auto';
    el.style.padding = '30px';

    h4.innerText =
      "Verza Script: Client scripts cannot initiate from the same page, make sure the script is added and enabled in the Server's settings";

    document.body.appendChild(el);

    return false;
  }

  return true;
};
