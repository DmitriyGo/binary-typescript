import { Search } from "./Partial/Search"
export async function render(): Promise<void> {
    // TODO render your app here
    const a = new Search();
    a.Popular()


    document.getElementById('popular')!.addEventListener('click', () => a.Popular())
    document.getElementById('top_rated')!.addEventListener('click', () => a.TopRated())
    document.getElementById('upcoming')!.addEventListener('click', () => a.Upcoming())

    const searchInput = document.getElementById('search') as HTMLInputElement;

    document.getElementById('submit')!
        .addEventListener('click', () => a.Search(searchInput.value))
}
