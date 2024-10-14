import { IStory } from "@/interfaces/story/IStory";

export default function storyHasLanguage(
  story: IStory,
  language: string
): boolean {
  const result = Object.keys(story.translations).includes(language);

  return result;
}
