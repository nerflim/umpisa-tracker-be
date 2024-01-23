import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    private projectService: ProjectService,
  ) {}

  async create(category: CreateCategoryInput): Promise<Category> {
    const project = await this.projectService.findOne(category.project);

    if (!project) {
      throw new NotFoundException(`Project not found`);
    }

    const newCategory = new this.categoryModel(category);
    newCategory.save();

    project.categories.push(newCategory);
    project.save();

    return newCategory;
  }

  findAll(project: string) {
    return this.categoryModel
      .find({ project })
      .populate('project')
      .populate('cards')
      .exec();
  }

  findOne(id: string) {
    return this.categoryModel.findById(id).populate('project').exec();
  }

  async update(id: string, category: UpdateCategoryInput) {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, category, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category not found`);
    }
    return updatedCategory;
  }

  async remove(id: string) {
    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(id)
      .exec();

    this.projectService.removeCategory(id);

    if (!deletedCategory) {
      throw new NotFoundException(`Category not found`);
    }
    return deletedCategory.populate('project');
  }
}
