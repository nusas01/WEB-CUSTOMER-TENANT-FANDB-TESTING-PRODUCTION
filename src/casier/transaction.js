import { useEffect, useState } from "react"
import Sidebar from "../component/sidebar"
import TransactionTable from "../component/transactionTable"
import { useDispatch, useSelector } from "react-redux"
import { ErrorAlert } from "../component/alert"
import { checkTransactionNonCashInternalSlice  } from "../reducers/get"


export default function KasirTransaction() {
    const dispatch = useDispatch()
    const [activeMenu, setActiveMenu] = useState("Transaction")
    const [error, setError] = useState(false)
  
    // cek status transaction transaciton in the sever and payment gateway
    const { resetCheckTransactionNonCash } = checkTransactionNonCashInternalSlice.actions
    const { errorCheckTransactionNonCash } = useSelector((state) => state.checkTransactionNonCashInternalState)
    useEffect(() => {
        if (errorCheckTransactionNonCash) {
            setError(true)
            setTimeout(() => {
                setError(false)
                dispatch(resetCheckTransactionNonCash())
            }, 3000)
        }
    }, [errorCheckTransactionNonCash])

    return (
        <>
            { error && (
                <ErrorAlert 
                message={"there was an error on our server, we are fixing it"} 
                onClose={() => setError(false)}
                />
            )}

            <div className="flex">
                {/* Sidebar - Fixed width */}
                <div className="w-1/10 min-w-[250px]">
                    <Sidebar 
                    activeMenu={activeMenu}
                    />
                </div>

                {/* Content - Flexible width */}
                <div className="flex-1">
                    <TransactionTable />
                </div>
            </div>
        </>
    )
}