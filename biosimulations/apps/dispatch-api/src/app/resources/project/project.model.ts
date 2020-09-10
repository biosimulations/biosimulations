import mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  uuid: { type: String, required: true },
  _email: { type: String, required: false },
});

export interface ProjectModel {
  _id: string;
  projectName: string;
  uuid: string;
  _email: string;
}
