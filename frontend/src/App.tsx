import React, { useState, useEffect, useMemo } from 'react';
import { useWallet } from './hooks/useWallet';
import { useApi } from './hooks/useApi';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { StatusNotification } from './components/ui/StatusNotification';
import { BalanceSection } from './components/forms/BalanceSection';
import { RegisterForm } from './components/forms/RegisterForm';
import { LoadForm } from './components/forms/LoadForm';
import { PaymentForm } from './components/forms/PaymentForm';
import type { ViewType, ClientData } from './types';
import { VIEWS } from './utils/constants';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>(VIEWS.REGISTER);

  const {
    walletData,
    status,
    isLoading,
    isBalanceLoading,
    updateWalletData,
    setStatus,
    setIsLoading,
    handleCheckBalance
  } = useWallet();

  const { registerClient, loadWallet, initPayment, confirmPayment } = useApi();

  useEffect(() => {
    if (view === VIEWS.BALANCE && !isBalanceLoading && walletData.document && walletData.phone) {
      handleCheckBalance();
    }
  }, [view, walletData.document, walletData.phone, handleCheckBalance]);

  const handleRegister = async (clientData: ClientData) => {
    if (walletData.document || walletData.phone) {
      setStatus({
        message: 'Advertencia: El nuevo registro sobrescribirá la cuenta actual de la sesión.',
        type: 'warning'
      });
    }

    setIsLoading(true);
    setStatus({ message: 'Registrando cliente...', type: 'info' });

    try {
      const response = await registerClient(clientData);

      if (response.success) {
        setStatus({ message: '¡Registro exitoso! Cuenta creada y activa.', type: 'success' });

        updateWalletData({
          document: clientData.document,
          phone: clientData.phone,
          balance: 0.00
        });

        setView(VIEWS.BALANCE);
      } else {
        setStatus({ message: response.message || 'Error en el registro', type: 'error' });
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Error desconocido de conexión/API.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (amount: number) => {
    setIsLoading(true);
    setStatus({ message: `Recargando ${amount.toFixed(2)} USD...`, type: 'info' });

    try {
      const response = await loadWallet({
        document: walletData.document,
        phone: walletData.phone,
        amount
      });

      if (response.success) {
        setStatus({ message: `¡Recarga exitosa! Se han añadido ${amount.toFixed(2)} USD.`, type: 'success' });
        await handleCheckBalance();
      } else {
        setStatus({ message: response.message || 'Error en la recarga', type: 'error' });
      }
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'Error desconocido en la recarga.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (amount: number) => {
    setIsLoading(true);
    setStatus({ message: 'Iniciando proceso de pago (Fase 1/2)...', type: 'info' });

    try {
      const initResponse = await initPayment({
        document: walletData.document,
        phone: walletData.phone,
        amount
      });

      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.message || 'Error al iniciar el pago.');
      }

      const { sessionId, token } = (initResponse.data as any).data;

      if (!sessionId || !token) {
        throw new Error('El servicio no devolvió SessionId o Token para la confirmación.');
      }

      setStatus({ message: 'Pago iniciado. Confirmando transacción (Fase 2/2)...', type: 'info' });

      const confirmResponse = await confirmPayment({ sessionId, token });

      if (!confirmResponse.success) {
        throw new Error(confirmResponse.message || 'Error al confirmar el pago. Verifique el token y saldo.');
      }

      setStatus({ message: `¡Pago exitoso de ${amount.toFixed(2)} USD!`, type: 'success' });
      await handleCheckBalance();
    } catch (error) {
      setStatus({
        message: `Transacción fallida: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentContent = useMemo(() => {
    const isWalletActive = !!walletData.document && !!walletData.phone;

    if (!isWalletActive && (view === VIEWS.LOAD || view === VIEWS.PAY)) {
      return (
        <div className="text-center p-8 bg-gray-800 rounded-2xl border border-dashed border-red-700 shadow-xl">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-extrabold text-white">Sesión Requerida</h3>
          <p className="text-gray-400 mt-3 text-base">
            Debes <span className="font-bold text-green-400">registrar una cuenta</span> o <span className="font-bold text-green-400">consultar el saldo</span> para cargar y pagar.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setView(VIEWS.REGISTER)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition transform hover:scale-[1.02] active:scale-95"
            >
              Registrar
            </button>
            <button
              onClick={() => setView(VIEWS.BALANCE)}
              className="px-6 py-3 bg-gray-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-gray-600 transition transform hover:scale-[1.02] active:scale-95"
            >
              Consultar Saldo
            </button>
          </div>
        </div>
      );
    }

    switch (view) {
      case VIEWS.REGISTER:
        return (
          <RegisterForm
            onRegister={handleRegister}
            isLoading={isLoading}
            walletData={walletData}
            onUpdateWalletData={updateWalletData}
          />
        );
      case VIEWS.LOAD:
        return (
          <LoadForm
            walletData={walletData}
            onLoad={handleLoad}
            onUpdateWalletData={updateWalletData}
            isLoading={isLoading}
          />
        );
      case VIEWS.PAY:
        return (
          <PaymentForm
            walletData={walletData}
            onPayment={handlePayment}
            onUpdateWalletData={updateWalletData}
            isLoading={isLoading}
          />
        );
      case VIEWS.BALANCE:
      default:
        return (
          <BalanceSection
            walletData={walletData}
            isBalanceLoading={isBalanceLoading}
            onUpdateWalletData={updateWalletData}
            onCheckBalance={handleCheckBalance}
          />
        );
    }
  }, [view, walletData, isLoading, isBalanceLoading, handleCheckBalance, updateWalletData, handleRegister, handleLoad, handlePayment, setView]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 flex items-center justify-center font-['Inter']">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all duration-300">
        <Header />

        <div className="p-6 sm:p-8">

          <StatusNotification
            notification={status}
            onClose={() => setStatus({ message: '', type: 'info' })}
          />

          <Navigation
            currentView={view}
            onViewChange={setView}
          />

          <div className="p-0">
            {currentContent}
          </div>

          <div className="mt-8 p-4 bg-gray-900 border border-gray-700 rounded-xl text-sm text-gray-400 shadow-inner">
            <p className="font-bold mb-2 text-indigo-400 border-b border-gray-700 pb-1 flex items-center">
              <span className="inline-block w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
              Datos de Sesión
            </p>
            <div className="flex justify-between flex-wrap gap-y-2">
              <span className="mr-4">
                <span className="text-gray-500 font-medium">Documento:</span>
                <span className="font-mono ml-2 px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white shadow-sm">{walletData.document || 'N/A'}</span>
              </span>
              <span>
                <span className="text-gray-500 font-medium">Teléfono:</span>
                <span className="font-mono ml-2 px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white shadow-sm">{walletData.phone || 'N/A'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;