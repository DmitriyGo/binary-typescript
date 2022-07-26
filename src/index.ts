import { Service } from "./Service"
import { log } from 'util';
export async function render(): Promise<void> {
    // TODO render your app here
    const builder = new Service();
    await builder.Popular()
    builder.RenderFavorite()

    document.getElementById('popular')!.addEventListener('click', () => builder.Popular())
    document.getElementById('top_rated')!.addEventListener('click', () => builder.TopRated())
    document.getElementById('upcoming')!.addEventListener('click', () => builder.Upcoming())

    const searchInput = document.getElementById('search') as HTMLInputElement;

    document.getElementById('submit')!
        .addEventListener('click', () => builder.Search(searchInput.value, 1, true))

    document.getElementById('load-more')!.addEventListener('click', () => builder.LoadMore())




}
