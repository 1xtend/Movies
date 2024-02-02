import { MediaType } from '../media.type';
import { IShow } from './show.interface';

export interface IShowMediaType extends IShow {
  media_type: MediaType;
}
