import { faker } from "@faker-js/faker";
import { ISeeder } from "@/interfaces/seeder/Seeder";
import { RegisteringStory } from "@/interfaces/story/IStory";
import StoryModel from "@/schemas/StorySchema";
import { Types } from "mongoose";

export default class StoriesSeeder implements ISeeder {
  private defaultCount = 20;

  private generateStory(): RegisteringStory {
    const story: RegisteringStory = {
      protagonist: faker.internet.displayName(),
      city: faker.location.city(),
      story: faker.person.bio(),
      avatar: {
        cloudinaryId: "protagonists/tlfl7zegosyr6tcu0dme",
        url: "https://res.cloudinary.com/dfddvb63i/image/upload/v1703266206/protagonists/tlfl7zegosyr6tcu0dme.webp",
      },
      age: faker.number.int({ min: 1, max: 90 }),
      job: faker.person.jobTitle(),
      tags: ["child"],
      translationLanguage: "en",
      translations: {
        en: {
          translationLanguage: "en",
          protagonist: faker.internet.displayName(),
          story: faker.person.bio(),
          job: faker.person.jobTitle(),
        },
      },
    };

    return story;
  }

  generateStories(count = this.defaultCount): RegisteringStory[] {
    const stories: RegisteringStory[] = [];

    for (let i = 0; i < count; i++) {
      const user: RegisteringStory = this.generateStory();

      stories.push(user);
    }

    return stories;
  }

  async seed(count = this.defaultCount): Promise<void> {
    const stories = this.generateStories(count);

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
