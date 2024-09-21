const opTypeKey = (opType: "call" | "put") => opType[0] as "c" | "p";

opTypeKey.CALL = "c" as const;
opTypeKey.PUT = "p" as const;

export default opTypeKey;
