export default function SearchResult({ number, name }) {
    return(
        <div className="bg-base-200 p-6 rounded-xl hover:bg-primary hover:text-white transition duration-300 hover:scale-102">
            <h1>{number}. {name}</h1>
        </div>
    );
}