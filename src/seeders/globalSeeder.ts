import { ISeeder } from "@/interfaces/seeder/Seeder";
import connectDB from "@/db";
import { Command } from "@/interfaces/seeder/Command";
import StoriesSeeder from "./storiesSeeder";

/**
 * Seeds stories data to the database for testing
 * ONLY USE IT IN DEVELOPMENT MODE
 */
class GlobalSeeder implements ISeeder {
  private storiesSeeder = new StoriesSeeder();

  async seed(): Promise<void> {
    await this.storiesSeeder.seed();
  }

  async unseed(): Promise<void> {
    await this.storiesSeeder.unseed();
  }

  async run(): Promise<void> {
    if (process.env.DOPPLER_ENVIRONMENT === "prd") {
      throw new Error(`Can't run the seeder on production environment`);
    }

    await connectDB();

    const command = process.argv[2] as Command;

    if (!command) {
      throw new Error(
        "Please add an argument i (import) / d (delete) to the command."
      );
    }

    switch (command) {
      case Command.import:
        await this.seed();
        process.exit();
      case Command.delete:
        await this.unseed();
        process.exit();
    }
  }
}

const globalSeeder = new GlobalSeeder();
globalSeeder.run();
