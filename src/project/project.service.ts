import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}

  create(project: CreateProjectInput) {
    const newProject = new this.projectModel(project);
    return newProject.save();
  }

  findAll() {
    return this.projectModel
      .find()
      .populate({
        path: 'categories',
        populate: {
          path: 'cards',
          strictPopulate: false,
        },
      })
      .exec();
  }

  findOne(id: string) {
    return this.projectModel
      .findById(id)
      .populate({
        path: 'categories',
        populate: {
          path: 'cards',
          strictPopulate: false,
        },
      })
      .exec();
  }

  async update(id: string, project: UpdateProjectInput) {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, project, { new: true })
      .populate({
        path: 'categories',
        populate: {
          path: 'cards',
          strictPopulate: false,
        },
      })
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updatedProject;
  }

  async remove(id: string) {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return deletedProject;
  }

  async removeCategory(id: string) {
    const deletedCategory = await this.projectModel
      .updateMany({ categories: { $in: [id] } }, { $pull: { categories: id } })
      .exec();

    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return deletedCategory;
  }
}
