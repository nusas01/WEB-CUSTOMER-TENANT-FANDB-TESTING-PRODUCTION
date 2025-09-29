import "../style/add.css";
import { useState } from "react";

export function ModelInputNumberEwallet({ channelCode, handleCloseModel, handleInputNumber }) {
    const [phoneNumber, setPhoneNumber] = useState("+62");

    const handleChange = (e) => {
        let value = e.target.value;

        if (value.length > 15) return;

        // Pastikan tetap dimulai dengan +62
        if (!value.startsWith("+62")) {
            value = "+62" + value.replace(/^(\+)?62?/, ""); // ganti apapun di awal jadi +62
        }

        setPhoneNumber(value);
    };

    const handleFocus = () => {
        if (phoneNumber === "") {
            setPhoneNumber("+62");
        }
    };

    return (
        <div className="bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-6" style={{ position: 'fixed', width: '100%', height: '100%', top: 0, zIndex: '100' }}>
            <div className="container-number-ewallet p-6">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">{channelCode}</h2>
                </div>
                <div className="text-summery mb-10">
                    <div className="flex mb-1">
                        <p className="mr-1">1.</p>
                        <p>Pastikan Anda sudah memiliki aplikasinya.</p>
                    </div>
                    <div className="flex">
                        <p className="mr-1">2.</p>
                        <p>Pastikan Nomor yang dimasukkan adalah nomor {channelCode} terdaftar.</p>
                    </div>
                </div>
                <div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="tel"
                            className="input mb-10"
                            placeholder=""
                            value={phoneNumber}
                            onFocus={handleFocus}
                            onChange={handleChange}
                        />
                        <label className="input-label">Phone Number</label>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mb-2"
                    onClick={() => handleInputNumber(phoneNumber)}
                    >
                        Continue
                    </button>
                    <button onClick={handleCloseModel} className="w-full text-white py-3 rounded-lg" style={{ backgroundColor: 'red' }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
