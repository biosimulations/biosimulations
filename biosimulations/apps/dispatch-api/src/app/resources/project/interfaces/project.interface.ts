import { Document } from 'mongoose';

export interface ProjectModel extends Document {
  _id: string;
  projectName: string;
  uuid: string;
  _email: string;
}
