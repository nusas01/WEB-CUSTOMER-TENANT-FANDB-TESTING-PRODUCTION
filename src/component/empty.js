import "../style/empty.css"

export default function EmptyComponent({ gambar, title, desc }) {
    return (
        <div className="container-elament-empty">
            <img src={gambar} alt="Empty" />
            <h1>{title}</h1>
            <p>{desc}</p>
        </div>
    );
}
