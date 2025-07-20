export default function SearchResult({ number, name }) {
    return(
        <div className="bg-base-200 p-6 rounded-xl border-gray-400 hover:bg-primary hover:text-white">
            <h1>{number}. {name}</h1>
        </div>
    );
}