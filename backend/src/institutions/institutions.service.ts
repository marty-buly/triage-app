import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InstitutionDto } from 'src/institutions/institution.dto';
import {CreateInstitutionDto, Institution} from 'src/institutions/institution.model';

@Injectable()
export class InstitutionsService {
  constructor(
    @InjectModel(Institution) private institution: typeof Institution,
  ) {}

  async findAll(): Promise<InstitutionDto[]> {
    const institutions = this.institution.findAll();
    return institutions.map(p => CreateInstitutionDto(p));
  }

  async find(id: string): Promise<InstitutionDto> {
    const institution = await this.institution.findByPk(id);
    if (!institution) {
      throw new HttpException('No institution found.', HttpStatus.NOT_FOUND);
    }
    return CreateInstitutionDto(institution);
  }

  async create(dto: InstitutionDto): Promise<Institution> {
    const institution = new Institution();
    institution.name = dto.name;
    return institution.save();
  }

  async update(id: string, dto: InstitutionDto): Promise<InstitutionDto> {
    const institution = await this.institution.findByPk(id);
    if (!institution) {
      throw new HttpException('No institution found.', HttpStatus.NOT_FOUND);
    }
    institution.name = dto.name || institution.name;

    try {
      const institution2 = await institution.save();
      return CreateInstitutionDto(institution2);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<InstitutionDto> {
    const institution = await this.institution.findByPk(id);
    console.log("AAA", institution);
    await institution.destroy();
    return CreateInstitutionDto(institution);
  }
}
