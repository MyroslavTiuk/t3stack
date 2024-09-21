// @ts-nocheck

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { FIREBASE } from "../../config/Firebase";

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE.CONFIG);
}

export const loginWithFirebase = (emailAddress: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(emailAddress, password);

export const registerWithFirebase = (emailAddress: string, password: string) =>
  firebase.auth().createUserWithEmailAndPassword(emailAddress, password);

export const registerAnonUser = (emailAddress: string, password: string) =>
  firebase.auth.EmailAuthProvider.credential(emailAddress, password);

export const resetPasswordWithFirebase = (emailAddress: string) =>
  firebase.auth().sendPasswordResetEmail(emailAddress);

export const logoutFireBase = async () => firebase.auth().signOut();

export const db = firebase.firestore();
