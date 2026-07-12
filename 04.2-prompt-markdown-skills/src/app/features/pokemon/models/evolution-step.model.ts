/** A single flattened node of an evolution chain (id + species name). */
export class EvolutionStep {
  constructor(
    public id = 0,
    public name = '',
  ) {}
}
