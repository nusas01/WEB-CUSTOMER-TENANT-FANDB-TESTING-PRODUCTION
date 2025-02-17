import "../style/add.css";

export function ModelInputNumberEwallet({paymentMethode, setPaymentMethod, closeModel}) {
    const handleCloseModel = () => {
        closeModel(true)
        setPaymentMethod()
    }
    return (
        <div className="bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-6" style={{position: 'fixed', width: '100%', height: '100%', top: 0, zIndex: '100'}}>
            <div className="container-number-ewallet p-6">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">{paymentMethode}</h2>
                </div>
                <div className="text-summery mb-10">
                    <div className="flex" style={{marginBottom: '5px'}}>
                        <p style={{marginRight: '5px'}}>1.</p>
                        <p>Pastikan Anda sudah memiliki aplikasinya.</p>
                    </div>
                    <div className="flex">
                        <p style={{marginRight: '5px'}}>2.</p>
                        <p>Pastikan Nomor yang dimasukkan adalah nomor {paymentMethode}.</p>
                    </div>
                </div>
                <div>
                    <div style={{position: 'relative'}}>
                            <input type="email" placeholder="" className="input mb-10" />
                            <label className="input-label">Phone Number</label>
                    </div>
                    <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors" style={{padding: '10px', marginBottom: '5px'}}>Continue</button>
                    <button onClick={() => handleCloseModel()} class="w-full text-white py-3  rounded-lg  transition-colors" style={{padding: '10px', backgroundColor: 'red'}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}