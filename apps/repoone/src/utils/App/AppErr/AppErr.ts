class AppErr extends Error {
  public constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppErr.prototype);
  }
}

export default AppErr;
