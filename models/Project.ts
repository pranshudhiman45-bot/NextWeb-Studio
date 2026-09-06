import { model, models, Schema, type InferSchemaType } from "mongoose";

const projectDetailSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    projectType: {
      type: String,
      enum: [
        "NextWeb Studio Project",
        "Personal Project",
        "Showcase Application",
      ],
      required: true,
    },
    primaryCategory: { type: String, required: true },
    categories: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    thumbnail: { type: String, required: true },
    images: { type: [String], default: [] },
    githubUrl: String,
    liveUrl: String,
    internalUrl: String,
    featured: { type: Boolean, default: false },
    problem: String,
    solution: String,
    architecture: String,
    architectureHeading: String,
    challenges: { type: [String], default: [] },
    challengesHeading: String,
    implementation: String,
    implementationHeading: String,
    results: { type: [String], default: [] },
    resultsEyebrow: String,
    resultsTitle: String,
    technologyNote: String,
    details: { type: [projectDetailSectionSchema], default: [] },
  },
  { timestamps: true },
);

export type ProjectDocument = InferSchemaType<typeof projectSchema>;

export const Project = models.Project ?? model("Project", projectSchema);
