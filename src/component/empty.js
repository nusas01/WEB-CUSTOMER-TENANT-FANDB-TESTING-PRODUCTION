import "../style/empty.css"

export function EmptyComponent({ gambar, title, desc }) {
    return (
        <div className="container-elament-empty">
            <img src={gambar} alt="Empty" />
            <h1>{title}</h1>
            <p>{desc}</p>
        </div>
    );
}

export const EmptyHistory = ({ gambar, title, desc }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center text-gray-500">
            <img 
                src={gambar} 
                className="w-24 h-24 mb-4 opacity-50"
            />
            <h2 className="text-lg text-black">{title}</h2>
            <p className="text-sm max-w-xs">
                {desc}
            </p>
        </div>
    )
}

