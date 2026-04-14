import { redirect } from 'next/navigation';
import { getFirstImplementedLesson } from './data';

export default function CoursePage() {
  redirect(getFirstImplementedLesson());
}
