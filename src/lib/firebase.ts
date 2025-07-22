
// This file is no longer used after removing Firebase Authentication.
// It is kept to avoid breaking imports in files that are not part of this change.
// In a real cleanup, this file and its dependencies would be removed.

import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

const app: FirebaseApp | null = null;
const auth: Auth | null = null;

export { app, auth };
