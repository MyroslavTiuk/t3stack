import { useMemo } from "react";
import { useDocument } from "react-firebase-hooks/firestore";

import { type Optional } from "opc-types/lib/util/Optional";
import { UsersCollection } from "../../../../../services/Firebase/firestoreCollections";

import { type UserData } from "../Session.types";

const useUpdatedUserData = (uid: Optional<string>) => {
  const [updatedUserDocument] = useDocument(
    uid ? UsersCollection.doc(uid) : null,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );

  return useMemo(
    () => updatedUserDocument?.data() as UserData,
    [updatedUserDocument]
  );
};

export default useUpdatedUserData;
