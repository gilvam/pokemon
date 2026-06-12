/** Extracts the numeric id from a PokeAPI resource url (e.g. `.../pokemon/25/`). */
export class ResourceId {
  static fromUrl(url: string): number {
    const match = /\/(\d+)\/?$/.exec(url);
    const id = match?.at(1);
    return id ? Number(id) : 0;
  }
}
