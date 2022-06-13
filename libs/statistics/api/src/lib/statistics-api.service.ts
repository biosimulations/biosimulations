import { StatisticType } from '@biosimulations/statistics-datamodel';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatsItem, StatisticDocument } from './statistics-api.database.model';

@Injectable()
export class StatisticsApiService {
  private logger = new Logger('StatisticsApiService');
  public constructor(@InjectModel(StatsItem.name) private readonly statItemModel: Model<StatsItem>) {}

  public async PostStatistics(body: StatsItem): Promise<StatisticDocument> {
    this.logger.log('Creating new statistic item: ' + body.id);
    const newStat = await (await this.statItemModel.create(body)).save();
    return newStat;
  }

  public async PutStatistics(id: string, body: StatsItem): Promise<StatisticType> {
    const stat = await this.statItemModel.findOne({ id: body.id }).exec();
    if (stat) {
      this.logger.log('Updating statistic item: ' + body.id);
      stat.values = body.values;
      stat.labels = body.labels;
      await stat.save();
    } else {
      throw new NotFoundException(`Statistics item ${body.id} not found`);
    }
    return stat.toJSON();
  }

  public async getStatistics(): Promise<StatisticType[]> {
    const stats = await this.statItemModel.find({}, '-_id -__v', { lean: true }).exec();
    return stats;
  }
  public async getStat(
    id: string,
    topCount: number,
    includeOther = true,
    otherCount = true,
    otherLabel = 'others',
  ): Promise<StatisticType> {
    const stats = await this.statItemModel.findOne({ id }, '-_id', { lean: true }).exec();
    const values = stats?.values || [];
    const labels = stats?.labels || [];
    let topLabels = [];
    let topValues = [];
    this.logger.error(topCount);
    if (values.length < topCount || topCount === 0) {
      this.logger.error('not filtering');
      topLabels = labels;

      topValues = values;
    } else {
      topLabels = labels.slice(0, topCount);
      topValues = values.slice(0, topCount);
      if (includeOther) {
        const otherCount = values.slice(topCount).reduce((a, b) => a + b, 0);
        topLabels.push(`${otherCount ? labels.length - topLabels.length + ' ' : ''} + ${otherLabel}`);
        topValues.push(otherCount);
      }
    }

    return {
      id,
      labels: topLabels || [],
      values: topValues || [],
    };
  }
}
