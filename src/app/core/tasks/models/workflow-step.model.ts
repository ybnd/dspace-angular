import { autoserialize, deserialize, inheritSerialization } from 'cerialize';
import { link, typedObject } from '../../cache/builders/build-decorators';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { WORKFLOW_STEP } from './workflow-step.resource-type';
import { HALLink } from '../../shared/hal-link.model';
import { WORKFLOW_ACTION } from './workflow-action-object.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { WorkflowAction } from './workflow-action-object.model';
import { DSpaceObject } from '../../shared/dspace-object.model';

/**
 * A model class for a workflow step
 */
@typedObject
@inheritSerialization(DSpaceObject)
export class WorkflowStep extends DSpaceObject {
  static type = WORKFLOW_STEP;

  /**
   * The workflow step's identifier
   */
  @autoserialize
  id: string;
}
