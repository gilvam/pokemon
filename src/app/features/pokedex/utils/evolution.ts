import { EvolutionLinkDto } from '../services/http/http-pokeapi/models/evolution-link.dto';
import { extractIdFromUrl } from './pokemon-id';

export interface IEvolutionStage {
  id: number;
  name: string;
}

/** Flatten an evolution chain tree into an ordered list of stages (preorder). */
export function flattenEvolution(root: EvolutionLinkDto): IEvolutionStage[] {
  const stages: IEvolutionStage[] = [];

  const visit = (node: EvolutionLinkDto): void => {
    if (node.species.name.length > 0) {
      stages.push({ id: extractIdFromUrl(node.species.url), name: node.species.name });
    }
    node.evolvesTo.forEach(visit);
  };

  visit(root);
  return stages;
}
