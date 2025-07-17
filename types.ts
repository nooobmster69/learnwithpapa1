export interface Story {
  title: string;
  content: string[];
}

export interface Lesson {
  lesson_number: string;
  title: string;
  source_page: number;
  syllables: string[];
  words: string[];
  story: Story;
}

export interface LessonData {
  lessons: Lesson[];
}

export enum ActivityType {
  Syllables = 'syllables',
  Words = 'words',
  WordScramble = 'wordScramble',
}

export enum View {
  Welcome = 'welcome',
  LessonSelection = 'lessonSelection',
  ActivitySelection = 'activitySelection',
  Practice = 'practice',
  Story = 'story',
  AIStory = 'aiStory',
  WordScrambleGame = 'wordScrambleGame',
}
