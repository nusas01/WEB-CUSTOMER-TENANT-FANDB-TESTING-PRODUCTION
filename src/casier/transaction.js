import { useEffect, useState, useRef } from "react"
import Sidebar from "../component/sidebar"
import TransactionTable from "../component/transactionTable"
import { useDispatch, useSelector } from "react-redux"
import { checkTransactionNonCashInternalSlice  } from "../reducers/get"
import { useFullscreen } from "../helper/helper"
import { Toast, ToastPortal } from "../component/alert";


export default function KasirTransaction() {
    const dispatch = useDispatch()
    const [activeMenu, setActiveMenu] = useState("Transaction")
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
  
    // cek status transaction transaciton in the sever and payment gateway
    const { resetCheckTransactionNonCash } = checkTransactionNonCashInternalSlice.actions
    const { errorCheckTransactionNonCash } = useSelector((state) => state.checkTransactionNonCashInternalState)
    useEffect(() => {
    if (errorCheckTransactionNonCash) {
      setToast({
        show: true,
        type: 'error',
        message: 'Terjadi kesalahan saat memeriksa status transaksi. Silakan coba kembali.'
      });

      const timer = setTimeout(() => {
        setToast({ show: false, type: '', message: '' });
        dispatch(resetCheckTransactionNonCash());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorCheckTransactionNonCash]);

  const handleToastClose = () => {
    setToast({ show: false, type: '', message: '' });
    dispatch(resetCheckTransactionNonCash());
  };


  // maxsimaz minimaz layar
  const contentRef = useRef(null);
  const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

  // handle navbar ketika ukuran table dan hp
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  return (
        <div className="flex relative">
          {/* Toast Portal */}
          {toast.show && (
              <ToastPortal>
              <div className="fixed top-4 right-4 z-100">
                  <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={handleToastClose}
                  duration={3000}
                  />
              </div>
              </ToastPortal>
          )}

          {/* Sidebar */}
          {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
            <div className="w-1/10 z-50 min-w-[290px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>
          )}

          {/* Main Content */}
          <div
              ref={contentRef}
              className={`flex-1 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
          >
              <TransactionTable
              isFullScreen={isFullScreen}
              fullscreenchange={toggleFullScreen}
              />
          </div>

          {/* Full Screen Indicator */}
          {isFullScreen && (
              <div className="fixed bottom-4 left-4 z-40 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm">
              Full Screen Mode - Press ESC to exit
              </div>
          )}
          </div>
  )
}