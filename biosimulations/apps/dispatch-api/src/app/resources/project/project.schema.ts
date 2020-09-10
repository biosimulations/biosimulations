import mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  projectName: String,
  uuid: String,
  _email: String,
});
