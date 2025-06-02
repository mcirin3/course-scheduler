import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type Course = {
  code: string;
  title: string;
  hours: string;
  description: string;
};

export async function savePlan(userId: string, planName: string, courses: Course[]) {
  const ref = doc(db, "users", userId, "plans", planName);
  await setDoc(ref, { courses });
}

export async function loadPlan(userId: string, planName: string): Promise<Course[]> {
  if (!userId || !planName) {
    console.error("Missing userId or planName");
    return [];
  }
  const ref = doc(db, "users", userId, "plans", planName);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data()?.courses || []) : [];
}


//saving completed courses 
export async function saveCompletedCourses(userId: string, courses: Course[]){
  const ref = doc(db, "users", userId, "completed", "courses");
  await setDoc(ref, { courses });
} 

//loading completed courses 
export async function getCompletedCourses(userId: string): Promise<Course[]> {
  const ref = doc(db, "users", userId, "completed", "courses"); 
  const snap = await getDoc(ref); 
  return snap.exists() ? (snap.data()?.courses || []) : [];
}