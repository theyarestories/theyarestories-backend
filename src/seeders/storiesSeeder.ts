import { faker } from "@faker-js/faker";
import { ISeeder } from "@/interfaces/seeder/Seeder";
import { RegisteringStory } from "@/interfaces/story/IStory";
import StoryModel from "@/schemas/StorySchema";

export default class StoriesSeeder implements ISeeder {
  private count: number;

  constructor(count = 20) {
    this.count = count;
  }

  generateStory(): RegisteringStory {
    const story: RegisteringStory = {
      protagonist: faker.internet.displayName(),
      city: faker.location.city(),
      story: faker.person.bio(),
      avatar: faker.image.avatar(),
      images: Array(Math.ceil(Math.random() * 4))
        .fill(null)
        .map(() => faker.image.urlPicsumPhotos()),
      dateOfBirth: faker.date.anytime(),
      job: faker.person.jobTitle(),
    };

    return story;
  }

  generateStories(count = this.count): RegisteringStory[] {
    const stories: RegisteringStory[] = [];

    for (let i = 0; i < count; i++) {
      const user: RegisteringStory = this.generateStory();

      stories.push(user);
    }

    return stories;
  }

  async seed(): Promise<void> {
    const stories = this.generateStories();

    try {
      await StoryModel.create(stories);
      console.log("Seeded stories data 🚀");
    } catch (error) {
      console.error(error);
    }
  }

  async unseed(): Promise<void> {
    try {
      await StoryModel.deleteMany();
      console.log("Deleted stories data 😔");
    } catch (error) {
      console.error(error);
    }
  }
}